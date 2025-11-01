// Crypto price API service using CoinGecko API
// CoinGecko provides free access without API key for reasonable usage

export interface TokenPriceData {
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

export interface HistoricalPriceData {
  time: string;
  price: number;
}

// Token ID mapping for CoinGecko API
// CoinGecko uses different IDs than token symbols
const TOKEN_ID_MAP: Record<string, string> = {
  'BNB': 'binancecoin',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'BUSD': 'binance-usd',
  'ETH': 'ethereum',
  'BTC': 'bitcoin',
  'BTCB': 'bitcoin', // Bitcoin BEP2 uses bitcoin price
  'CAKE': 'pancakeswap-token',
  'WBNB': 'binancecoin', // Wrapped BNB uses BNB price
};

// Fallback token IDs for common tokens
const getTokenId = (symbol: string): string => {
  return TOKEN_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
};

// Helper function to fetch with timeout
const fetchWithTimeout = async (url: string, timeout: number = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Get current token price and market data
export const getTokenPriceData = async (symbol: string): Promise<TokenPriceData | null> => {
  try {
    const tokenId = getTokenId(symbol);
    
    // CoinGecko simple price endpoint with timeout
    const response = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`,
      8000 // 8 second timeout
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data[tokenId]) {
      console.warn(`Token ${symbol} (ID: ${tokenId}) not found in CoinGecko`);
      return null;
    }
    
    const tokenData = data[tokenId];
    const price = tokenData.usd;
    
    // If price is 0 or undefined, token might not be supported
    if (!price || price === 0) {
      console.warn(`Invalid price data for ${symbol}`);
      return null;
    }
    
    return {
      price: price,
      change24h: (tokenData.usd_24h_change || 0) / 100 * price,
      changePercent24h: tokenData.usd_24h_change || 0,
      volume24h: tokenData.usd_24h_vol || 0,
      marketCap: tokenData.usd_market_cap || 0,
      high24h: price * 1.05, // Approximate - CoinGecko simple endpoint doesn't include high/low
      low24h: price * 0.95, // Approximate
    };
  } catch (error) {
    console.error('Error fetching token price data:', error);
    return null;
  }
};

// Get detailed market data with high/low
export const getTokenMarketData = async (symbol: string): Promise<TokenPriceData | null> => {
  try {
    const tokenId = getTokenId(symbol);
    
    // CoinGecko market data endpoint with timeout
    const response = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      10000 // 10 second timeout
    );
    
    if (!response.ok) {
      // If 404, token not found - try fallback
      if (response.status === 404) {
        console.warn(`Token ${symbol} (ID: ${tokenId}) not found in CoinGecko, trying fallback`);
        return await getTokenPriceData(symbol);
      }
      throw new Error(`Failed to fetch market data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.market_data) {
      console.warn(`Market data not available for ${symbol}`);
      // Try fallback
      return await getTokenPriceData(symbol);
    }
    
    const marketData = data.market_data;
    const currentPrice = marketData.current_price?.usd || 0;
    
    // If price is 0, token might not have valid data
    if (currentPrice === 0) {
      console.warn(`Invalid price data for ${symbol}, trying fallback`);
      return await getTokenPriceData(symbol);
    }
    
    const priceChange24h = marketData.price_change_24h || 0;
    const priceChangePercent24h = marketData.price_change_percentage_24h || 0;
    
    return {
      price: currentPrice,
      change24h: priceChange24h,
      changePercent24h: priceChangePercent24h,
      volume24h: marketData.total_volume?.usd || 0,
      marketCap: marketData.market_cap?.usd || 0,
      high24h: marketData.high_24h?.usd || currentPrice * 1.05,
      low24h: marketData.low_24h?.usd || currentPrice * 0.95,
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Fallback to simple price endpoint
    try {
      return await getTokenPriceData(symbol);
    } catch (fallbackError) {
      console.error('Fallback price fetch also failed:', fallbackError);
      return null;
    }
  }
};

// Get historical price data for charts
export const getHistoricalPriceData = async (
  symbol: string,
  days: number = 7
): Promise<HistoricalPriceData[]> => {
  try {
    const tokenId = getTokenId(symbol);
    
    // CoinGecko market chart endpoint with timeout
    const response = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`,
      10000 // 10 second timeout
    );
    
    if (!response.ok) {
      // If 404, token not found
      if (response.status === 404) {
        console.warn(`Token ${symbol} (ID: ${tokenId}) not found in CoinGecko for historical data`);
      } else {
        throw new Error(`Failed to fetch historical data: ${response.statusText}`);
      }
      return [];
    }
    
    const data = await response.json();
    
    if (!data.prices || !Array.isArray(data.prices)) {
      console.warn(`Historical data not available for ${symbol}`);
      return [];
    }
    
    // Convert to our format
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      time: new Date(timestamp).toISOString(),
      price: price as number,
    }));
  } catch (error) {
    console.error('Error fetching historical price data:', error);
    return [];
  }
};

// Get multiple token prices at once
export const getMultipleTokenPrices = async (symbols: string[]): Promise<Record<string, number>> => {
  try {
    // Filter out empty symbols and deduplicate
    const uniqueSymbols = [...new Set(symbols.filter(s => s && s.trim()))];
    
    if (uniqueSymbols.length === 0) {
      return {};
    }

    const tokenIds = uniqueSymbols.map(getTokenId).join(',');
    
    // Use timeout to prevent hanging
    const response = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`,
      10000 // 10 second timeout
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      console.warn('Invalid API response format');
      return {};
    }
    
    // Convert back to symbol-based map
    const prices: Record<string, number> = {};
    uniqueSymbols.forEach((symbol) => {
      const tokenId = getTokenId(symbol);
      const price = data[tokenId]?.usd;
      // Only set price if it's a valid number
      if (typeof price === 'number' && price > 0) {
        prices[symbol] = price;
      }
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching multiple token prices:', error);
    return {};
  }
};

