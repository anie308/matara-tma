// Swap service for BSC token swaps via backend API
// Based on SWAP.md documentation

export interface SwapRequest {
  username: string;
  tokenIn: string; // Token address (use WBNB for BNB: 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c)
  tokenOut: string; // Token address
  tokenInSymbol?: string;
  tokenOutSymbol?: string;
  amountIn: string; // Amount as string
  amountOut?: string;
  amountOutMin?: string; // Minimum output amount
  slippageTolerance?: number; // Percentage (default: 0.5)
  deadline?: number; // Unix timestamp
}

export interface SwapResponse {
  message: string;
  data: {
    swapRequestId: string;
    walletAddress: string;
    tokenIn: string;
    tokenOut: string;
    tokenInSymbol: string;
    tokenOutSymbol: string;
    amountIn: string;
    amountOut: string;
    amountOutMin: string;
    feePercentage: number;
    feeAmount: string;
    feeRecipientAddress: string;
    status: 'completed' | 'failed';
    transactionHash?: string;
    createdAt: string;
    completedAt?: string;
    errorMessage?: string;
  };
}

// WBNB address for BNB swaps
export const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

// Get API base URL from environment
const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_APP_API_URL;
  if (!baseUrl) {
    console.warn('VITE_APP_API_URL not set, using default');
    return 'http://localhost:4000';
  }
  return baseUrl;
};

// Calculate deadline (5 minutes from now by default)
export const calculateDeadline = (minutes: number = 5): number => {
  return Math.floor(Date.now() / 1000) + (minutes * 60);
};

// Convert token address - if BNB, use WBNB address
export const getTokenAddress = (tokenAddress: string): string => {
  if (tokenAddress === 'native' || tokenAddress.toLowerCase() === 'bnb') {
    return WBNB_ADDRESS;
  }
  return tokenAddress;
};

// Execute swap
export const executeSwap = async (swapData: SwapRequest): Promise<SwapResponse> => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/swap`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(swapData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during swap');
  }
};

// Get user swap history
export const getUserSwapHistory = async (username: string): Promise<any[]> => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/swap/user?username=${encodeURIComponent(username)}`;

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

    return data.data || [];
  } catch (error) {
    console.error('Error fetching swap history:', error);
    return [];
  }
};

// Get swap request by ID
export const getSwapRequest = async (swapRequestId: string): Promise<any> => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/swap/${swapRequestId}`;

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
    console.error('Error fetching swap request:', error);
    throw error;
  }
};

