// Transaction service based on TRSANC.md documentation
// Backend API for transaction tracking

export interface Transaction {
  _id: string;
  userId: string;
  walletAddress: string;
  chain: 'BSC' | 'ETH' | 'POLYGON';
  type: 'deposit' | 'withdrawal' | 'swap' | 'transfer' | 'approval' | 'other';
  transactionHash: string;
  blockNumber?: number;
  blockHash?: string;
  from?: string;
  to?: string;
  tokenAddress?: string;
  tokenSymbol?: string;
  amount?: string;
  amountFormatted?: string;
  // For swaps
  tokenIn?: string;
  tokenOut?: string;
  tokenInSymbol?: string;
  tokenOutSymbol?: string;
  amountIn?: string;
  amountOut?: string;
  // Gas information
  gasUsed?: string;
  gasPrice?: string;
  gasFee?: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  transactionTimestamp?: string;
  confirmedAt?: string;
  metadata?: any;
  swapRequestId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface TransactionStats {
  totalTransactions: number;
  byType: {
    deposits: number;
    withdrawals: number;
    swaps: number;
  };
  byStatus: {
    pending: number;
    confirmed: number;
    failed: number;
  };
  totalDeposits: string;
}

export interface TransactionStatsResponse {
  data: TransactionStats;
  message: string;
}

// Get API base URL from environment
const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_APP_API_URL;
  if (!baseUrl) {
    console.warn('VITE_APP_API_URL not set, using default');
    return 'http://localhost:4000';
  }
  return baseUrl;
};

export interface GetUserTransactionsParams {
  username: string;
  type?: 'deposit' | 'withdrawal' | 'swap' | 'transfer' | 'approval' | 'other';
  status?: 'pending' | 'confirmed' | 'failed';
  chain?: 'BSC' | 'ETH' | 'POLYGON';
  limit?: number;
  page?: number;
}

// Get user transactions
export const getUserTransactions = async (
  params: GetUserTransactionsParams
): Promise<TransactionResponse> => {
  const baseUrl = getApiBaseUrl();
  const queryParams = new URLSearchParams({
    username: params.username,
  });

  if (params.type) queryParams.append('type', params.type);
  if (params.status) queryParams.append('status', params.status);
  if (params.chain) queryParams.append('chain', params.chain);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.page) queryParams.append('page', params.page.toString());

  const url = `${baseUrl}/transaction/user?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};

// Get transaction by hash
export const getTransactionByHash = async (
  transactionHash: string
): Promise<Transaction> => {
  const baseUrl = getApiBaseUrl();
  // Remove 0x prefix if present
  const hash = transactionHash.startsWith('0x') 
    ? transactionHash.slice(2) 
    : transactionHash;
  
  const url = `${baseUrl}/transaction/hash/${hash}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching transaction by hash:', error);
    throw error;
  }
};

// Get transactions by wallet address
export const getTransactionsByWallet = async (
  walletAddress: string,
  params?: {
    type?: string;
    status?: string;
    limit?: number;
    page?: number;
  }
): Promise<TransactionResponse> => {
  const baseUrl = getApiBaseUrl();
  // Remove 0x prefix if present
  const address = walletAddress.startsWith('0x') 
    ? walletAddress.slice(2) 
    : walletAddress;
  
  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.append('type', params.type);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.page) queryParams.append('page', params.page.toString());

  const url = `${baseUrl}/transaction/wallet/${address}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching transactions by wallet:', error);
    throw error;
  }
};

// Get user transaction statistics
export const getUserTransactionStats = async (
  username: string
): Promise<TransactionStats> => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/transaction/user/stats?username=${encodeURIComponent(username)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    throw error;
  }
};

// Get blockchain explorer URL
export const getExplorerUrl = (chain: string, txHash: string): string => {
  const explorers: Record<string, string> = {
    BSC: `https://bscscan.com/tx/${txHash}`,
    ETH: `https://etherscan.io/tx/${txHash}`,
    POLYGON: `https://polygonscan.com/tx/${txHash}`,
  };
  return explorers[chain] || `https://bscscan.com/tx/${txHash}`;
};

