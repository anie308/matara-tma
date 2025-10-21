// Backend wallet service for server-generated wallets
export interface BackendWallet {
  address: string;
  // privateKey: string; // This should be encrypted in production
  // mnemonic?: string;
}

export interface TokenBalance {
  symbol: string; 
  balance: number;
  usdValue: number;
}

export class BackendWalletService {
  private static instance: BackendWalletService;
  private wallet: BackendWallet | null = null;
  private balances: Record<string, number> = {};

  private constructor() {}

  static getInstance(): BackendWalletService {
    if (!BackendWalletService.instance) {
      BackendWalletService.instance = new BackendWalletService();
    }
    return BackendWalletService.instance;
  }

  // Initialize wallet from backend response
  setWallet(walletData: BackendWallet): void {
    this.wallet = walletData;
  }

  // Get current wallet
  getWallet(): BackendWallet | null {
    return this.wallet;
  }

  // Get wallet address
  getAddress(): string | null {
    return this.wallet?.address || null;
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.wallet !== null;
  }

  // Set token balances (from backend API)
  setBalances(balances: Record<string, number>): void {
    this.balances = balances;
  }

  // Get token balance
  getTokenBalance(symbol: string): number {
    return this.balances[symbol] || 0;
  }

  // Get all balances
  getAllBalances(): Record<string, number> {
    return { ...this.balances };
  }

  // Clear wallet data
  clearWallet(): void {
    this.wallet = null;
    this.balances = {};
  }

  // Get custom tokens (for now, return empty array)
  getCustomTokens(): any[] {
    return [];
  }
}

export const backendWalletService = BackendWalletService.getInstance();
