// Steam API Service
// Note: Steam API has CORS restrictions and cannot be called directly from browser.
// This service provides both real API functions (for server-side/proxy use) and mock data.

import { config } from '../config.js';

const STEAM_API_BASE = config.apis.steam;
const STEAM_ID = config.steam.steamId;
const API_KEY = config.steam.apiKey;

/**
 * Check if we have valid Steam API credentials configured
 */
export const hasValidCredentials = () => {
  return API_KEY && API_KEY.length > 0 && STEAM_ID && !STEAM_ID.includes('0000000000');
};

/**
 * Fetch player profile summary
 * Endpoint: ISteamUser/GetPlayerSummaries/v2
 */
export const fetchPlayerSummary = async () => {
  if (!hasValidCredentials()) {
    console.warn('Steam API: No valid credentials configured, using mock data');
    return getMockPlayerSummary();
  }

  try {
    const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${STEAM_ID}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    const player = data.response?.players?.[0];

    if (!player) {
      throw new Error('Player not found');
    }

    return {
      steamId: player.steamid,
      personaName: player.personaname,
      avatarUrl: player.avatarfull,
      profileUrl: player.profileurl,
      personaState: player.personastate, // 0=Offline, 1=Online, 2=Busy, etc.
      lastLogoff: player.lastlogoff,
      timeCreated: player.timecreated,
      realName: player.realname,
      countryCode: player.loccountrycode,
    };
  } catch (error) {
    console.error('Steam API fetchPlayerSummary error:', error);
    // Return mock data on CORS/network errors
    if (error.message.includes('CORS') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      console.warn('CORS issue detected, returning mock data');
      return getMockPlayerSummary();
    }
    throw error;
  }
};

/**
 * Fetch Steam level for a player
 * Endpoint: IPlayerService/GetSteamLevel/v1
 */
export const fetchSteamLevel = async () => {
  if (!hasValidCredentials()) {
    return getMockSteamLevel();
  }

  try {
    const url = `${STEAM_API_BASE}/IPlayerService/GetSteamLevel/v1/?key=${API_KEY}&steamid=${STEAM_ID}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response?.player_level || 0;
  } catch (error) {
    console.error('Steam API fetchSteamLevel error:', error);
    return getMockSteamLevel();
  }
};

/**
 * Fetch all owned games with playtime
 * Endpoint: IPlayerService/GetOwnedGames/v1
 */
export const fetchOwnedGames = async () => {
  if (!hasValidCredentials()) {
    console.warn('Steam API: No valid credentials configured, using mock data');
    return getMockOwnedGames();
  }

  try {
    const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${API_KEY}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=true`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    const games = data.response?.games || [];

    return {
      totalCount: data.response?.game_count || games.length,
      games: games.map(game => ({
        appId: game.appid,
        name: game.name,
        playtimeMinutes: game.playtime_forever,
        playtimeHours: Math.round((game.playtime_forever / 60) * 10) / 10,
        playtime2Weeks: game.playtime_2weeks || 0,
        iconUrl: game.img_icon_url
          ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
          : null,
        logoUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`,
        lastPlayed: game.rtime_last_played,
      })).sort((a, b) => b.playtimeMinutes - a.playtimeMinutes),
    };
  } catch (error) {
    console.error('Steam API fetchOwnedGames error:', error);
    if (error.message.includes('CORS') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      console.warn('CORS issue detected, returning mock data');
      return getMockOwnedGames();
    }
    throw error;
  }
};

/**
 * Fetch recently played games (last 2 weeks)
 * Endpoint: IPlayerService/GetRecentlyPlayedGames/v1
 */
export const fetchRecentGames = async (count = 10) => {
  if (!hasValidCredentials()) {
    console.warn('Steam API: No valid credentials configured, using mock data');
    return getMockRecentGames();
  }

  try {
    const url = `${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${API_KEY}&steamid=${STEAM_ID}&count=${count}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    const games = data.response?.games || [];

    return {
      totalCount: data.response?.total_count || games.length,
      games: games.map(game => ({
        appId: game.appid,
        name: game.name,
        playtimeMinutes: game.playtime_forever,
        playtimeHours: Math.round((game.playtime_forever / 60) * 10) / 10,
        playtime2WeeksMinutes: game.playtime_2weeks,
        playtime2WeeksHours: Math.round((game.playtime_2weeks / 60) * 10) / 10,
        iconUrl: game.img_icon_url
          ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
          : null,
        logoUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`,
      })),
    };
  } catch (error) {
    console.error('Steam API fetchRecentGames error:', error);
    if (error.message.includes('CORS') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      console.warn('CORS issue detected, returning mock data');
      return getMockRecentGames();
    }
    throw error;
  }
};

/**
 * Fetch all Steam data in parallel
 */
export const fetchAllSteamData = async () => {
  const [playerSummary, steamLevel, ownedGames, recentGames] = await Promise.all([
    fetchPlayerSummary(),
    fetchSteamLevel(),
    fetchOwnedGames(),
    fetchRecentGames(),
  ]);

  return {
    profile: {
      ...playerSummary,
      level: steamLevel,
    },
    ownedGames,
    recentGames,
    isMockData: !hasValidCredentials(),
  };
};

// ============================================
// Mock Data (for development/CORS fallback)
// ============================================

const getMockPlayerSummary = () => ({
  steamId: '76561198000000000',
  personaName: 'GamerTag',
  avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
  profileUrl: 'https://steamcommunity.com/profiles/76561198000000000',
  personaState: 1,
  lastLogoff: Math.floor(Date.now() / 1000) - 3600,
  timeCreated: 1293753600, // Dec 30, 2010
  realName: null,
  countryCode: 'US',
});

const getMockSteamLevel = () => 42;

const getMockOwnedGames = () => ({
  totalCount: 247,
  games: [
    {
      appId: 730,
      name: 'Counter-Strike 2',
      playtimeMinutes: 18420,
      playtimeHours: 307,
      playtime2Weeks: 840,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg',
      lastPlayed: Math.floor(Date.now() / 1000) - 86400,
    },
    {
      appId: 1245620,
      name: 'Elden Ring',
      playtimeMinutes: 9600,
      playtimeHours: 160,
      playtime2Weeks: 420,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1245620/header.jpg',
      lastPlayed: Math.floor(Date.now() / 1000) - 172800,
    },
    {
      appId: 570,
      name: 'Dota 2',
      playtimeMinutes: 7200,
      playtimeHours: 120,
      playtime2Weeks: 0,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg',
      lastPlayed: Math.floor(Date.now() / 1000) - 604800,
    },
    {
      appId: 1172470,
      name: 'Apex Legends',
      playtimeMinutes: 5400,
      playtimeHours: 90,
      playtime2Weeks: 180,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1172470/header.jpg',
      lastPlayed: Math.floor(Date.now() / 1000) - 259200,
    },
    {
      appId: 292030,
      name: 'The Witcher 3: Wild Hunt',
      playtimeMinutes: 4800,
      playtimeHours: 80,
      playtime2Weeks: 0,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/292030/header.jpg',
      lastPlayed: Math.floor(Date.now() / 1000) - 2592000,
    },
    {
      appId: 1086940,
      name: 'Baldur\'s Gate 3',
      playtimeMinutes: 4200,
      playtimeHours: 70,
      playtime2Weeks: 300,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1086940/header.jpg',
      lastPlayed: Math.floor(Date.now() / 1000) - 43200,
    },
    {
      appId: 413150,
      name: 'Stardew Valley',
      playtimeMinutes: 3600,
      playtimeHours: 60,
      playtime2Weeks: 120,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/413150/header.jpg',
      lastPlayed: Math.floor(Date.now() / 1000) - 86400,
    },
    {
      appId: 1091500,
      name: 'Cyberpunk 2077',
      playtimeMinutes: 3000,
      playtimeHours: 50,
      playtime2Weeks: 0,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1091500/header.jpg',
      lastPlayed: Math.floor(Date.now() / 1000) - 1209600,
    },
  ],
});

const getMockRecentGames = () => ({
  totalCount: 5,
  games: [
    {
      appId: 1086940,
      name: 'Baldur\'s Gate 3',
      playtimeMinutes: 4200,
      playtimeHours: 70,
      playtime2WeeksMinutes: 300,
      playtime2WeeksHours: 5,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1086940/header.jpg',
    },
    {
      appId: 730,
      name: 'Counter-Strike 2',
      playtimeMinutes: 18420,
      playtimeHours: 307,
      playtime2WeeksMinutes: 840,
      playtime2WeeksHours: 14,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg',
    },
    {
      appId: 1245620,
      name: 'Elden Ring',
      playtimeMinutes: 9600,
      playtimeHours: 160,
      playtime2WeeksMinutes: 420,
      playtime2WeeksHours: 7,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1245620/header.jpg',
    },
    {
      appId: 1172470,
      name: 'Apex Legends',
      playtimeMinutes: 5400,
      playtimeHours: 90,
      playtime2WeeksMinutes: 180,
      playtime2WeeksHours: 3,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/1172470/header.jpg',
    },
    {
      appId: 413150,
      name: 'Stardew Valley',
      playtimeMinutes: 3600,
      playtimeHours: 60,
      playtime2WeeksMinutes: 120,
      playtime2WeeksHours: 2,
      iconUrl: null,
      logoUrl: 'https://steamcdn-a.akamaihd.net/steam/apps/413150/header.jpg',
    },
  ],
});

export default {
  fetchPlayerSummary,
  fetchSteamLevel,
  fetchOwnedGames,
  fetchRecentGames,
  fetchAllSteamData,
  hasValidCredentials,
};
