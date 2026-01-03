import { config } from '../config.js';

/**
 * Fetches NFTs owned by a wallet address using Reservoir API (free, no key needed)
 * Falls back to Alchemy if key is configured
 * @param {string} walletAddress - The wallet address to fetch NFTs for
 * @param {string} continuation - Pagination token
 * @param {number} limit - Number of NFTs per page (max 100)
 * @returns {Promise<{nfts: Array, continuation: string|null}>}
 */
export async function fetchNFTsForWallet(walletAddress = null, continuation = null, limit = 50) {
  const address = walletAddress || config.wallet.address;

  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error('Wallet address is not configured. Please add your wallet address to config.js');
  }

  // Use Reservoir API (free, no key required)
  const params = new URLSearchParams({
    limit: String(Math.min(limit, 100)),
    includeAttributes: 'true',
  });

  if (continuation) {
    params.append('continuation', continuation);
  }

  const url = `https://api.reservoir.tools/users/${address}/tokens/v10?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Reservoir API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Transform Reservoir response to match our expected format
  const nfts = (data.tokens || []).map(item => ({
    contract: {
      address: item.token?.contract,
      name: item.token?.collection?.name,
    },
    tokenId: item.token?.tokenId,
    name: item.token?.name || `#${item.token?.tokenId}`,
    description: item.token?.description,
    image: {
      cachedUrl: item.token?.imageSmall || item.token?.image,
      thumbnailUrl: item.token?.imageSmall,
      originalUrl: item.token?.image,
    },
    collection: {
      name: item.token?.collection?.name,
      slug: item.token?.collection?.slug,
    },
    raw: item,
  }));

  return {
    nfts,
    continuation: data.continuation || null,
  };
}

/**
 * Fetches all NFTs for a wallet by handling pagination automatically
 * @param {string} walletAddress - The wallet address to fetch NFTs for
 * @param {number} maxNFTs - Maximum number of NFTs to fetch (default 200)
 * @returns {Promise<Array>} Array of all NFTs
 */
export async function fetchAllNFTs(walletAddress = null, maxNFTs = 200) {
  const allNFTs = [];
  let continuation = null;

  do {
    const result = await fetchNFTsForWallet(walletAddress, continuation);
    allNFTs.push(...result.nfts);
    continuation = result.continuation;

    // Stop if we've reached the max limit
    if (allNFTs.length >= maxNFTs) {
      break;
    }
  } while (continuation);

  return allNFTs.slice(0, maxNFTs);
}

/**
 * Extracts the best available image URL from an NFT object
 * @param {Object} nft - The NFT object
 * @returns {string|null} The image URL or null if not available
 */
export function getNFTImageUrl(nft) {
  const image = nft.image;

  if (!image) return null;

  // Prefer cached/gateway URLs for better loading performance
  return (
    image.cachedUrl ||
    image.thumbnailUrl ||
    image.originalUrl ||
    null
  );
}

/**
 * Gets the OpenSea URL for an NFT
 * @param {Object} nft - The NFT object
 * @returns {string} The OpenSea URL
 */
export function getOpenSeaUrl(nft) {
  const contractAddress = nft.contract?.address;
  const tokenId = nft.tokenId;

  if (!contractAddress || !tokenId) {
    return 'https://opensea.io';
  }

  return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`;
}
