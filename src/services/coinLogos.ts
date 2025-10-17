// CoinGecko API service for fetching token logos and metadata
export interface TokenMetadata {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price?: number;
  market_cap?: number;
}

export class CoinLogoService {
  private static baseUrl = 'https://api.coingecko.com/api/v3';
  private static cache = new Map<string, TokenMetadata>();

  // Get token metadata by contract address on BSC
  static async getTokenByContract(contractAddress: string): Promise<TokenMetadata | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/binance-smart-chain/contract/${contractAddress}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const metadata: TokenMetadata = {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        image: data.image?.small || data.image?.thumb || '',
        current_price: data.market_data?.current_price?.usd,
        market_cap: data.market_data?.market_cap?.usd
      };
      
      // Cache the result
      this.cache.set(contractAddress.toLowerCase(), metadata);
      
      return metadata;
    } catch (error) {
      console.error(`Error fetching token metadata for ${contractAddress}:`, error);
      return null;
    }
  }

  // Get multiple tokens by their contract addresses
  static async getMultipleTokens(contractAddresses: string[]): Promise<Map<string, TokenMetadata>> {
    const results = new Map<string, TokenMetadata>();
    
    // Process in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < contractAddresses.length; i += batchSize) {
      const batch = contractAddresses.slice(i, i + batchSize);
      
      const promises = batch.map(async (address) => {
        const cached = this.cache.get(address.toLowerCase());
        if (cached) {
          return { address, metadata: cached };
        }
        
        const metadata = await this.getTokenByContract(address);
        return { address, metadata };
      });
      
      const batchResults = await Promise.all(promises);
      
      batchResults.forEach(({ address, metadata }) => {
        if (metadata) {
          results.set(address.toLowerCase(), metadata);
        }
      });
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < contractAddresses.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return results;
  }

  // Search for tokens by symbol or name
  static async searchTokens(query: string): Promise<TokenMetadata[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.coins?.slice(0, 10).map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.thumb,
        current_price: coin.market_cap_rank
      })) || [];
    } catch (error) {
      console.error(`Error searching tokens for "${query}":`, error);
      return [];
    }
  }

  // Get popular BSC tokens
  static async getPopularBSCTokens(): Promise<TokenMetadata[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&category=binance-smart-chain&order=market_cap_desc&per_page=20&page=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap
      }));
    } catch (error) {
      console.error('Error fetching popular BSC tokens:', error);
      return [];
    }
  }

  // Get cached metadata
  static getCachedMetadata(contractAddress: string): TokenMetadata | null {
    return this.cache.get(contractAddress.toLowerCase()) || null;
  }

  // Clear cache
  static clearCache(): void {
    this.cache.clear();
  }
}


// BSC Testnet Token Addresses for testing
export const POPULAR_BSC_TOKENS = {
  'BNB': {
    symbol: 'BNB',
    name: 'BNB',
    address: 'native', // Native BNB
    logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    decimals: 18
  },
  'USDT': {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x55d398326f99059fF775485246999027B3197955', // BSC Mainnet USDT
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    decimals: 18
  },
  'USDC': {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // BSC Mainnet USDC
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    decimals: 18
  },
  'BUSD': {
    symbol: 'BUSD',
    name: 'Binance USD',
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // BSC Mainnet BUSD
    logo: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png',
    decimals: 18
  },
  'CAKE': {
    symbol: 'CAKE',
    name: 'PancakeSwap Token',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', // BSC Mainnet CAKE
    logo: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_%281%29.png',
    decimals: 18
  },
  'ETH': {
    symbol: 'ETH',
    name: 'Ethereum Token',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', // BSC Mainnet ETH
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    decimals: 18
  },
  'BTCB': {
    symbol: 'BTCB',
    name: 'Bitcoin BEP2',
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', // BSC Mainnet BTCB
    logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    decimals: 18
  }
};
