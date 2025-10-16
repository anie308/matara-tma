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

// Pre-defined popular BSC tokens with their contract addresses
export const POPULAR_BSC_TOKENS = {
  'BNB': {
    symbol: 'BNB',
    name: 'BNB',
    address: 'native',
    logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png'
  },
  'USDT': {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x55d398326f99059fF775485246999027B3197955',
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
  },
  'USDC': {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
  },
  'BUSD': {
    symbol: 'BUSD',
    name: 'Binance USD',
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    logo: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png'
  },
  'CAKE': {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    logo: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_1194099.png'
  },
  'ADA': {
    symbol: 'ADA',
    name: 'Cardano',
    address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
    logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
  },
  'DOT': {
    symbol: 'DOT',
    name: 'Polkadot',
    address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    logo: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png'
  },
  'LINK': {
    symbol: 'LINK',
    name: 'ChainLink',
    address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
    logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png'
  }
};

// BSC Testnet Token Addresses for testing
export const POPULAR_BSC_TESTNET_TOKENS = {
  'BNB': {
    symbol: 'tBNB',
    name: 'Testnet BNB',
    address: '0x0000000000000000000000000000000000000000', // Native BNB on testnet
    logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png'
  },
  'USDT': {
    symbol: 'USDT',
    name: 'Tether USD (Testnet)',
    address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // BSC Testnet USDT
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
  },
  'USDC': {
    symbol: 'USDC',
    name: 'USD Coin (Testnet)',
    address: '0x64544969ed7EBf5f083679233325356EbE738930', // BSC Testnet USDC
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
  },
  'BUSD': {
    symbol: 'BUSD',
    name: 'Binance USD (Testnet)',
    address: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7', // BSC Testnet BUSD
    logo: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png'
  },
  'CAKE': {
    symbol: 'CAKE',
    name: 'PancakeSwap Token (Testnet)',
    address: '0xFa60D973F7642B748046464c1653B2b8c0b5C4c0', // BSC Testnet CAKE
    logo: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_%281%29.png'
  },
  'ADA': {
    symbol: 'ADA',
    name: 'Cardano (Testnet)',
    address: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5', // BSC Testnet ADA
    logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
  },
  'DOT': {
    symbol: 'DOT',
    name: 'Polkadot (Testnet)',
    address: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5', // BSC Testnet DOT
    logo: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png'
  },
  'LINK': {
    symbol: 'LINK',
    name: 'ChainLink Token (Testnet)',
    address: '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06', // BSC Testnet LINK
    logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png'
  },
  'UNI': {
    symbol: 'UNI',
    name: 'Uniswap (Testnet)',
    address: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5', // BSC Testnet UNI
    logo: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png'
  }
};
