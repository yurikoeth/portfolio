// Path of Exile API Service
// Handles character and league data fetching
import { config } from '../config.js';

const { poe2, apis } = config;

/**
 * Fetch characters for an account
 * Note: POE API may require OAuth or have CORS restrictions
 * This service handles errors gracefully and provides mock data as fallback
 * @returns {Promise<object>} Characters data or mock data
 */
export async function fetchCharacters() {
  try {
    // POE API endpoint for character list
    const url = `${apis.poe}/character`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Portfolio-Display/1.0',
      },
    });

    if (!response.ok) {
      // POE API often requires authentication or has CORS issues
      if (response.status === 401 || response.status === 403) {
        console.warn('POE API requires authentication. Using mock data.');
        return getMockCharacters();
      }
      throw new Error(`POE API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      characters: data.characters || [],
      isMockData: false,
    };
  } catch (error) {
    console.warn('POE API unavailable, using mock data:', error.message);
    return getMockCharacters();
  }
}

/**
 * Fetch league information
 * @returns {Promise<object>} League data or mock data
 */
export async function fetchLeagues() {
  try {
    const url = `${apis.poe}/league`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Portfolio-Display/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`League API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      leagues: data.leagues || [],
      isMockData: false,
    };
  } catch (error) {
    console.warn('POE League API unavailable, using mock data:', error.message);
    return getMockLeagues();
  }
}

/**
 * Fetch account profile (requires OAuth in POE2)
 * @returns {Promise<object>} Account data or mock data
 */
export async function fetchAccountProfile() {
  try {
    const url = `${apis.poe}/profile`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Portfolio-Display/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Profile API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      name: data.name || poe2.accountName,
      realm: data.realm || poe2.realm,
      isMockData: false,
    };
  } catch (error) {
    console.warn('POE Profile API unavailable, using mock data:', error.message);
    return {
      name: poe2.accountName,
      realm: poe2.realm,
      isMockData: true,
    };
  }
}

/**
 * Fetch all POE2 data in one call
 * @returns {Promise<object>} Combined POE2 data
 */
export async function fetchAllPOE2Data() {
  const [charactersData, leaguesData, profileData] = await Promise.all([
    fetchCharacters(),
    fetchLeagues(),
    fetchAccountProfile(),
  ]);

  return {
    account: profileData,
    characters: charactersData.characters || charactersData,
    leagues: leaguesData.leagues || leaguesData,
    currentLeague: getCurrentLeague(leaguesData.leagues || leaguesData),
    isMockData: charactersData.isMockData || leaguesData.isMockData || profileData.isMockData,
  };
}

/**
 * Get the current active challenge league
 * @param {Array} leagues - List of leagues
 * @returns {object|null} Current league or null
 */
function getCurrentLeague(leagues) {
  if (!Array.isArray(leagues) || leagues.length === 0) {
    return { name: 'Settlers', type: 'Challenge League' };
  }

  // Find the current challenge league (not Standard or Hardcore)
  const challengeLeague = leagues.find(league =>
    !league.id.includes('Standard') &&
    !league.id.includes('Hardcore') &&
    !league.id.includes('SSF') &&
    league.rules?.length > 0
  );

  return challengeLeague || leagues[0];
}

// Mock data functions

function getMockCharacters() {
  return {
    characters: [
      {
        name: 'ShadowBlade',
        class: 'Mercenary',
        level: 92,
        league: 'Settlers',
        experience: 2847593847,
        lastActive: Date.now() - 3600000,
      },
      {
        name: 'FrostWitch',
        class: 'Sorceress',
        level: 88,
        league: 'Settlers',
        experience: 1293847562,
        lastActive: Date.now() - 86400000,
      },
      {
        name: 'BoneWarrior',
        class: 'Warrior',
        level: 85,
        league: 'Settlers',
        experience: 983746251,
        lastActive: Date.now() - 172800000,
      },
      {
        name: 'StormMonk',
        class: 'Monk',
        level: 78,
        league: 'Standard',
        experience: 487293651,
        lastActive: Date.now() - 604800000,
      },
      {
        name: 'VoidHunter',
        class: 'Ranger',
        level: 71,
        league: 'Settlers',
        experience: 287463912,
        lastActive: Date.now() - 259200000,
      },
    ],
    isMockData: true,
  };
}

function getMockLeagues() {
  return {
    leagues: [
      {
        id: 'Settlers',
        name: 'Settlers',
        realm: 'pc',
        startAt: '2024-12-06T20:00:00Z',
        endAt: null,
        rules: [{ id: 'settlers', name: 'Settlers' }],
      },
      {
        id: 'Standard',
        name: 'Standard',
        realm: 'pc',
        startAt: null,
        endAt: null,
        rules: [],
      },
      {
        id: 'Hardcore',
        name: 'Hardcore',
        realm: 'pc',
        startAt: null,
        endAt: null,
        rules: [{ id: 'Hardcore', name: 'Hardcore' }],
      },
    ],
    isMockData: true,
  };
}

/**
 * Format experience number to readable string
 * @param {number} exp - Experience points
 * @returns {string} Formatted experience
 */
export function formatExperience(exp) {
  if (exp >= 1000000000) {
    return `${(exp / 1000000000).toFixed(2)}B`;
  }
  if (exp >= 1000000) {
    return `${(exp / 1000000).toFixed(2)}M`;
  }
  if (exp >= 1000) {
    return `${(exp / 1000).toFixed(2)}K`;
  }
  return exp.toString();
}

/**
 * Get class icon/color based on POE2 class
 * @param {string} className - POE2 class name
 * @returns {object} Class styling info
 */
export function getClassInfo(className) {
  const classMap = {
    'Warrior': { color: '#c41e3a', icon: 'sword' },
    'Mercenary': { color: '#ff7c0a', icon: 'crossbow' },
    'Ranger': { color: '#aad372', icon: 'bow' },
    'Sorceress': { color: '#3fc7eb', icon: 'staff' },
    'Witch': { color: '#8788ee', icon: 'wand' },
    'Monk': { color: '#00ff98', icon: 'fist' },
    'Huntress': { color: '#f48cba', icon: 'spear' },
    'Druid': { color: '#ff7c0a', icon: 'nature' },
  };

  return classMap[className] || { color: '#ffffff', icon: 'default' };
}
