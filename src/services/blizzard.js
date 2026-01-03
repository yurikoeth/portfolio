// Blizzard API Service for World of Warcraft
// Handles OAuth authentication and character data fetching
import { config } from '../config.js';

const { wow, apis } = config;

// Cache for OAuth token
let accessToken = null;
let tokenExpiry = 0;

/**
 * Fetch OAuth access token using client credentials flow
 * @returns {Promise<string|null>} Access token or null if credentials missing
 */
export async function getAccessToken() {
  // Check if we have valid cached token
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  // Validate credentials exist
  if (!wow.clientId || !wow.clientSecret) {
    console.warn('Blizzard API credentials not configured. Using mock data.');
    return null;
  }

  try {
    const tokenUrl = `https://${wow.region}.battle.net/oauth/token`;
    const credentials = btoa(`${wow.clientId}:${wow.clientSecret}`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`OAuth failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiry 5 minutes before actual expiry for safety
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    return accessToken;
  } catch (error) {
    console.error('Failed to get Blizzard access token:', error);
    return null;
  }
}

/**
 * Make authenticated API request to Blizzard
 * @param {string} endpoint - API endpoint path
 * @param {object} params - Query parameters
 * @returns {Promise<object|null>} API response data or null on error
 */
async function blizzardFetch(endpoint, params = {}) {
  const token = await getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const url = new URL(`${apis.blizzard}${endpoint}`);
    url.searchParams.append('namespace', `profile-${wow.region}`);
    url.searchParams.append('locale', 'en_US');

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Blizzard API request failed:', error);
    return null;
  }
}

/**
 * Fetch character profile data
 * @returns {Promise<object>} Character profile or mock data
 */
export async function fetchCharacterProfile() {
  const endpoint = `/profile/wow/character/${wow.realm}/${wow.characterName.toLowerCase()}`;
  const data = await blizzardFetch(endpoint);

  if (data) {
    return {
      name: data.name,
      realm: data.realm?.name || wow.realm,
      class: data.character_class?.name || 'Unknown',
      race: data.race?.name || 'Unknown',
      level: data.level || 80,
      faction: data.faction?.name || 'Unknown',
      itemLevel: data.equipped_item_level || 0,
      averageItemLevel: data.average_item_level || 0,
      guild: data.guild?.name || null,
      lastLogin: data.last_login_timestamp,
    };
  }

  // Return mock data if API fails or no credentials
  return getMockCharacterProfile();
}

/**
 * Fetch Mythic+ profile data
 * @returns {Promise<object>} M+ data or mock data
 */
export async function fetchMythicPlusProfile() {
  const endpoint = `/profile/wow/character/${wow.realm}/${wow.characterName.toLowerCase()}/mythic-keystone-profile/season/current`;
  const data = await blizzardFetch(endpoint);

  if (data) {
    return {
      rating: data.mythic_rating?.rating || 0,
      ratingColor: data.mythic_rating?.color || { r: 255, g: 255, b: 255 },
      bestRuns: (data.best_runs || []).slice(0, 5).map(run => ({
        dungeon: run.dungeon?.name || 'Unknown',
        level: run.keystone_level || 0,
        completedInTime: run.is_completed_within_time || false,
        duration: run.duration || 0,
        affixes: (run.keystone_affixes || []).map(a => a.name),
      })),
    };
  }

  return getMockMythicPlusProfile();
}

/**
 * Fetch raid progression data
 * @returns {Promise<object>} Raid progress or mock data
 */
export async function fetchRaidProgress() {
  const endpoint = `/profile/wow/character/${wow.realm}/${wow.characterName.toLowerCase()}/encounters/raids`;
  const data = await blizzardFetch(endpoint);

  if (data) {
    // Get the most recent expansion's raids
    const expansions = data.expansions || [];
    const currentExpansion = expansions[expansions.length - 1];

    if (currentExpansion && currentExpansion.instances) {
      return {
        expansionName: currentExpansion.expansion?.name || 'Current Expansion',
        raids: currentExpansion.instances.map(raid => ({
          name: raid.instance?.name || 'Unknown Raid',
          modes: (raid.modes || []).map(mode => ({
            difficulty: mode.difficulty?.name || 'Unknown',
            status: mode.status?.type || 'INCOMPLETE',
            progress: `${mode.progress?.completed_count || 0}/${mode.progress?.total_count || 0}`,
          })),
        })),
      };
    }
  }

  return getMockRaidProgress();
}

/**
 * Fetch all WoW character data in one call
 * @returns {Promise<object>} Combined character data
 */
export async function fetchAllWoWData() {
  const [profile, mythicPlus, raids] = await Promise.all([
    fetchCharacterProfile(),
    fetchMythicPlusProfile(),
    fetchRaidProgress(),
  ]);

  return {
    profile,
    mythicPlus,
    raids,
    isMockData: !accessToken,
  };
}

// Mock data functions for when API is unavailable

function getMockCharacterProfile() {
  return {
    name: wow.characterName || 'Hero',
    realm: wow.realm || 'Area-52',
    class: 'Death Knight',
    race: 'Blood Elf',
    level: 80,
    faction: 'Horde',
    itemLevel: 623,
    averageItemLevel: 625,
    guild: 'Sample Guild',
    lastLogin: Date.now(),
  };
}

function getMockMythicPlusProfile() {
  return {
    rating: 2847,
    ratingColor: { r: 255, g: 128, b: 0 },
    bestRuns: [
      { dungeon: 'The Stonevault', level: 12, completedInTime: true, duration: 1800000, affixes: ['Fortified', 'Entangling'] },
      { dungeon: 'Mists of Tirna Scithe', level: 11, completedInTime: true, duration: 1650000, affixes: ['Tyrannical', 'Incorporeal'] },
      { dungeon: 'The Dawnbreaker', level: 11, completedInTime: false, duration: 2100000, affixes: ['Fortified', 'Afflicted'] },
      { dungeon: 'Ara-Kara', level: 10, completedInTime: true, duration: 1500000, affixes: ['Tyrannical', 'Spiteful'] },
      { dungeon: 'City of Threads', level: 10, completedInTime: true, duration: 1700000, affixes: ['Fortified', 'Bursting'] },
    ],
  };
}

function getMockRaidProgress() {
  return {
    expansionName: 'The War Within',
    raids: [
      {
        name: 'Nerub-ar Palace',
        modes: [
          { difficulty: 'LFR', status: 'COMPLETE', progress: '8/8' },
          { difficulty: 'Normal', status: 'COMPLETE', progress: '8/8' },
          { difficulty: 'Heroic', status: 'COMPLETE', progress: '8/8' },
          { difficulty: 'Mythic', status: 'IN_PROGRESS', progress: '5/8' },
        ],
      },
    ],
  };
}
