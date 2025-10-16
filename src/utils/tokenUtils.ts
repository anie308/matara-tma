// Utility functions for token classification and styling

export const getTokenVariant = (symbol: string, name: string): 'default' | 'crypto' | 'defi' | 'stable' | 'nft' => {
  const symbolLower = symbol.toLowerCase();
  const nameLower = name.toLowerCase();

  // Stable coins
  if (symbolLower.includes('usd') || symbolLower.includes('usdt') || symbolLower.includes('usdc') || 
      symbolLower.includes('busd') || symbolLower.includes('dai') || symbolLower.includes('tusd') ||
      nameLower.includes('stable') || nameLower.includes('dollar')) {
    return 'stable';
  }

  // DeFi tokens
  if (symbolLower.includes('cake') || symbolLower.includes('uni') || symbolLower.includes('sushi') ||
      symbolLower.includes('comp') || symbolLower.includes('aave') || symbolLower.includes('crv') ||
      symbolLower.includes('bal') || symbolLower.includes('mkr') || symbolLower.includes('snx') ||
      nameLower.includes('swap') || nameLower.includes('finance') || nameLower.includes('protocol')) {
    return 'defi';
  }

  // NFT tokens
  if (symbolLower.includes('nft') || symbolLower.includes('ape') || symbolLower.includes('bayc') ||
      symbolLower.includes('punk') || nameLower.includes('nft') || nameLower.includes('collectible')) {
    return 'nft';
  }

  // Major cryptocurrencies
  if (symbolLower.includes('btc') || symbolLower.includes('eth') || symbolLower.includes('bnb') ||
      symbolLower.includes('ada') || symbolLower.includes('dot') || symbolLower.includes('link') ||
      symbolLower.includes('matic') || symbolLower.includes('avax') || symbolLower.includes('sol')) {
    return 'crypto';
  }

  return 'default';
};

export const getTokenColor = (symbol: string, name: string): string => {
  const variant = getTokenVariant(symbol, name);
  
  switch (variant) {
    case 'crypto':
      return 'from-yellow-400 to-orange-500';
    case 'defi':
      return 'from-blue-500 to-purple-600';
    case 'stable':
      return 'from-green-400 to-green-600';
    case 'nft':
      return 'from-pink-500 to-purple-600';
    default:
      return 'from-gray-600 to-gray-800';
  }
};

export const formatTokenAmount = (amount: number, decimals: number = 4): string => {
  if (amount === 0) return '0.0000';
  if (amount < 0.0001) return '< 0.0001';
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(2)}K`;
  return amount.toFixed(decimals);
};

export const getTokenDisplayName = (symbol: string, name: string): string => {
  // If name is too long, use symbol
  if (name.length > 20) return symbol;
  return name;
};
