// This file is deprecated - use reownWallet.ts instead
export interface Token {
  symbol: string;
  name: string;
  logo: string;
  address: string;
  decimals: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: any;
  chainId: number | null;
  balance: string;
}