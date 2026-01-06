// DexScreener API service for fetching token logos and metadata
export interface TokenMetadata {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price?: number;
  market_cap?: number;
}

export class CoinLogoService {
  private static cache = new Map<string, TokenMetadata>();

  // Get token logo from DexScreener by contract address
  static async getTokenLogoFromDexScreener(contractAddress: string): Promise<string | null> {
    if (contractAddress === 'native' || !contractAddress) {
      return null;
    }

    try {
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      console.log(data)
      
      // DexScreener returns pairs array, get the first pair's token info
      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];
        
        // Check if the contract address matches baseToken or quoteToken
        const isBaseToken = pair.baseToken?.address?.toLowerCase() === contractAddress.toLowerCase();
        const isQuoteToken = pair.quoteToken?.address?.toLowerCase() === contractAddress.toLowerCase();
        
        // Get logo from pair.info.imageUrl (this is the main token's logo)
        if ((isBaseToken || isQuoteToken) && pair.info?.imageUrl) {
          return pair.info.imageUrl;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching token logo from DexScreener for ${contractAddress}:`, error);
      return null;
    }
  }

  // Get token metadata by contract address using DexScreener
  static async getTokenByContract(contractAddress: string): Promise<TokenMetadata | null> {
    if (contractAddress === 'native') {
      return null;
    }

    // Check cache first
    const cached = this.cache.get(contractAddress.toLowerCase());
    if (cached) {
      return cached;
    }

    // Fetch from DexScreener
    const dexScreenerLogo = await this.getTokenLogoFromDexScreener(contractAddress);
    if (dexScreenerLogo) {
      const metadata: TokenMetadata = {
        id: contractAddress,
        symbol: '',
        name: '',
        image: dexScreenerLogo
      };
      this.cache.set(contractAddress.toLowerCase(), metadata);
      return metadata;
    }

    return null;
  }

  // Get multiple tokens by their contract addresses using DexScreener
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

  // Get cached metadata
  static getCachedMetadata(contractAddress: string): TokenMetadata | null {
    return this.cache.get(contractAddress.toLowerCase()) || null;
  }

  // Clear cache
  static clearCache(): void {
    this.cache.clear();
  }
}


// BSC Token Addresses - Only these 9 tokens are supported
// Logos will be fetched from DexScreener API dynamically
export const POPULAR_BSC_TOKENS = {
  'MARS': {
    symbol: 'MARS',
    name: 'MARS Token',
    address: '0x6844B2e9afB002d188A072A3ef0FBb068650F214', // BSC Mainnet MARS
    logo: 'https://cdn.dexscreener.com/cms/images/d33c76a1c7bb23e4de0e83553377c191453dfc36f114393a0e012ea509060908?width=128&height=128&fit=crop&quality=95&format=auto', // DexScreener logo
    decimals: 18
  },
  'BNB': {
    symbol: 'BNB',
    name: 'BNB',
    address: 'native', // Native BNB
    logo: '',
    decimals: 18
  },
  'WKC': {
    symbol: 'WKC',
    name: 'WKC Token',
    address: '0x6Ec90334d89dBdc89E08A133271be3d104128Edb', // BSC Mainnet WKC
    logo: '', // Will be fetched from DexScreener
    decimals: 18
  },
  'DTG': {
    symbol: 'DTG',
    name: 'DTG Token',
    address: '0xb1957bdba889686ebde631df970ece6a7571a1b6', // BSC Mainnet DTG
    logo: '', // Will be fetched from DexScreener
    decimals: 18
  },
  'YUKAN': {
    symbol: 'YUKAN',
    name: 'YUKAN Token',
    address: '0xd086B849a71867731D74D6bB5Df4f640de900171', // BSC Mainnet YUKAN
    logo: '', // Will be fetched from DexScreener
    decimals: 18
  },
  'TWD': {
    symbol: 'TWD',
    name: 'TWD Token',
    address: '0xf00cd9366a13e725ab6764ee6fc8bd21da22786e', // BSC Mainnet TWD
    logo: '', // Will be fetched from DexScreener
    decimals: 18
  },
  'TKC': {
    symbol: 'TKC',
    name: 'TKC Token',
    address: '0x06dc293c250e2fb2416a4276d291803fc74fb9b5', // BSC Mainnet TKC
    logo: '', // Will be fetched from DexScreener
    decimals: 18
  },
  'ETH': {
    symbol: 'ETH',
    name: 'Ethereum Token',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', // BSC Mainnet ETH
    logo: '',
    decimals: 18
  },
  'USDT': {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x55d398326f99059fF775485246999027B3197955', // BSC Mainnet USDT
    logo: '',
    decimals: 18
  }
};
