// Service to fetch wallet transactions from BSCScan API
// BSCScan provides free API access for reasonable usage

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenDecimal?: number;
  timeStamp: string;
  blockNumber: string;
  gasUsed: string;
  gasPrice: string;
  txreceipt_status: string;
  isError?: string;
  type: 'sent' | 'received' | 'contract';
  contractAddress?: string;
}

export interface TransactionResponse {
  status: string;
  message: string;
  result: any[];
}

// BSCScan API endpoint (free tier)
const BSCSCAN_API_URL = 'https://api.bscscan.com/api';
// For testnet, use: 'https://api-testnet.bscscan.com/api'
// Note: API key is optional but recommended for higher rate limits
// Get free API key from: https://bscscan.com/apis
const API_KEY = process.env.REACT_APP_BSCSCAN_API_KEY || '';


// Fetch normal BNB transactions
export const getNormalTransactions = async (
  address: string,
  startBlock: number = 0,
  endBlock: number = 99999999,
  page: number = 1,
  offset: number = 100
): Promise<Transaction[]> => {
  try {
    // Validate address format
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      console.warn('Invalid address format for normal transactions');
      return [];
    }

    let url = `${BSCSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=desc`;
    if (API_KEY) {
      url += `&apikey=${API_KEY}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`HTTP error fetching normal transactions: ${response.status}`);
      return [];
    }
    
    const data: TransactionResponse = await response.json();
    
    // Handle various "no results" scenarios
    if (data.status === '0') {
      const message = data.message?.toLowerCase() || '';
      
      // These all mean "no transactions found" - return empty array
      if (
        message === 'no transactions found' ||
        message === 'notok' ||
        message.includes('no record')
      ) {
        return [];
      }
      
      // Handle rate limiting
      if (message.includes('rate limit') || message.includes('max rate limit')) {
        console.warn('BSCScan API rate limit reached for normal transactions. Consider adding an API key.');
        return [];
      }
      
      // For other errors, log but don't throw - just return empty array
      console.warn(`BSCScan API returned status 0 for normal transactions: ${data.message}`);
      return [];
    }
    
    // Check if result is valid array
    if (!data.result || !Array.isArray(data.result)) {
      console.warn('Invalid response format from BSCScan API for normal transactions');
      return [];
    }
    
    return data.result.map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      timeStamp: tx.timeStamp,
      blockNumber: tx.blockNumber,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      txreceipt_status: tx.txreceipt_status,
      isError: tx.isError,
      type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
    }));
  } catch (error) {
    console.error('Error fetching normal transactions:', error);
    return [];
  }
};

// Fetch ERC20 token transactions
export const getTokenTransactions = async (
  address: string,
  contractAddress?: string,
  page: number = 1,
  offset: number = 100
): Promise<Transaction[]> => {
  try {
    // Validate address format
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      console.warn('Invalid address format for token transactions');
      return [];
    }

    let url = `${BSCSCAN_API_URL}?module=account&action=tokentx&address=${address}&page=${page}&offset=${offset}&sort=desc`;
    
    if (contractAddress) {
      url += `&contractaddress=${contractAddress}`;
    }
    
    if (API_KEY) {
      url += `&apikey=${API_KEY}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`HTTP error fetching token transactions: ${response.status}`);
      return [];
    }
    
    const data: TransactionResponse = await response.json();
    
    // Handle various "no results" scenarios
    if (data.status === '0') {
      const message = data.message?.toLowerCase() || '';
      
      // These all mean "no transactions found" - return empty array
      if (
        message === 'no transactions found' ||
        message === 'notok' ||
        message.includes('no record') ||
        message.includes('no token transfer')
      ) {
        return [];
      }
      
      // Handle rate limiting
      if (message.includes('rate limit') || message.includes('max rate limit')) {
        console.warn('BSCScan API rate limit reached for token transactions. Consider adding an API key.');
        return [];
      }
      
      // For other errors, log but don't throw - just return empty array
      console.warn(`BSCScan API returned status 0 for token transactions: ${data.message}`);
      return [];
    }
    
    // Check if result is valid array
    if (!data.result || !Array.isArray(data.result)) {
      console.warn('Invalid response format from BSCScan API for token transactions');
      return [];
    }
    
    return data.result.map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      tokenSymbol: tx.tokenSymbol,
      tokenName: tx.tokenName,
      tokenDecimal: parseInt(tx.tokenDecimal) || 18,
      timeStamp: tx.timeStamp,
      blockNumber: tx.blockNumber,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      txreceipt_status: tx.txreceipt_status,
      contractAddress: tx.contractAddress,
      type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
    }));
  } catch (error) {
    // Log error but return empty array instead of throwing
    console.warn('Error fetching token transactions (returning empty array):', error);
    return [];
  }
};

// Fetch all transactions (both normal and token)
export const getAllTransactions = async (
  address: string,
  limit: number = 50
): Promise<Transaction[]> => {
  try {
    // Validate address format
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      console.warn('Invalid address format for getAllTransactions');
      return [];
    }

    // Fetch both in parallel, but handle errors independently
    // This way if one fails, we can still show results from the other
    const [normalTxsResult, tokenTxsResult] = await Promise.allSettled([
      getNormalTransactions(address, 0, 99999999, 1, limit),
      getTokenTransactions(address, undefined, 1, limit),
    ]);
    
    // Extract results, defaulting to empty array if promise was rejected
    const normalTxs = normalTxsResult.status === 'fulfilled' ? normalTxsResult.value : [];
    const tokenTxs = tokenTxsResult.status === 'fulfilled' ? tokenTxsResult.value : [];
    
    // Log if one of the requests failed
    if (normalTxsResult.status === 'rejected') {
      console.warn('Failed to fetch normal transactions:', normalTxsResult.reason);
    }
    if (tokenTxsResult.status === 'rejected') {
      console.warn('Failed to fetch token transactions:', tokenTxsResult.reason);
    }
    
    // Combine and sort by timestamp (newest first)
    const allTransactions = [...normalTxs, ...tokenTxs].sort((a, b) => {
      return parseInt(b.timeStamp) - parseInt(a.timeStamp);
    });
    
    // Remove duplicates by hash
    const uniqueTransactions = allTransactions.filter((tx, index, self) =>
      index === self.findIndex((t) => t.hash === tx.hash)
    );
    
    return uniqueTransactions.slice(0, limit);
  } catch (error) {
    // This should rarely happen now since we handle errors in individual functions
    console.warn('Unexpected error in getAllTransactions:', error);
    return [];
  }
};

// Get transaction details from BSCScan
export const getTransactionDetails = async (txHash: string): Promise<any> => {
  try {
    let url = `${BSCSCAN_API_URL}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`;
    if (API_KEY) {
      url += `&apikey=${API_KEY}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
};

// Get BSCScan explorer URL for a transaction
export const getTransactionExplorerUrl = (txHash: string, isTestnet: boolean = false): string => {
  const baseUrl = isTestnet 
    ? 'https://testnet.bscscan.com/tx/'
    : 'https://bscscan.com/tx/';
  return `${baseUrl}${txHash}`;
};

