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
  'CAKE': 'pancakeswap-token',
  'BUSD': 'binance-usd',
};

// Fallback token IDs for common tokens
const getTokenId = (symbol: string): string => {
  return TOKEN_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
};

// Get current token price and market data
export const getTokenPriceData = async (symbol: string): Promise<TokenPriceData | null> => {
  try {
    const tokenId = getTokenId(symbol);
    
    // CoinGecko simple price endpoint
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data[tokenId]) {
      console.warn(`Token ${symbol} not found in CoinGecko`);
      return null;
    }
    
    const tokenData = data[tokenId];
    
    return {
      price: tokenData.usd || 0,
      change24h: (tokenData.usd_24h_change || 0) / 100 * (tokenData.usd || 1),
      changePercent24h: tokenData.usd_24h_change || 0,
      volume24h: tokenData.usd_24h_vol || 0,
      marketCap: tokenData.usd_market_cap || 0,
      high24h: (tokenData.usd || 0) * 1.05, // Approximate - CoinGecko simple endpoint doesn't include high/low
      low24h: (tokenData.usd || 0) * 0.95, // Approximate
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
    
    // CoinGecko market data endpoint
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch market data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.market_data) {
      console.warn(`Market data not available for ${symbol}`);
      return null;
    }
    
    const marketData = data.market_data;
    const currentPrice = marketData.current_price?.usd || 0;
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
    return await getTokenPriceData(symbol);
  }
};

// Get historical price data for charts
export const getHistoricalPriceData = async (
  symbol: string,
  days: number = 7
): Promise<HistoricalPriceData[]> => {
  try {
    const tokenId = getTokenId(symbol);
    
    // CoinGecko market chart endpoint
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch historical data: ${response.statusText}`);
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
    const tokenIds = symbols.map(getTokenId).join(',');
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Convert back to symbol-based map
    const prices: Record<string, number> = {};
    symbols.forEach((symbol) => {
      const tokenId = getTokenId(symbol);
      prices[symbol] = data[tokenId]?.usd || 0;
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching multiple token prices:', error);
    return {};
  }
};

