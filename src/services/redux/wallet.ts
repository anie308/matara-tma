import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { walletService } from '../wallet'; // Removed - using Reown instead

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: any;
  chainId: number | null;
  balance: string;
  isConnecting: boolean;
  error: string | null;
  customTokens: Array<{
    symbol: string;
    name: string;
    logo: string;
    address: string;
    decimals: number;
  }>;
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  provider: null,
  chainId: null,
  balance: "0",
  isConnecting: false,
  error: null,
  customTokens: [],
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setWalletState: (state, action: PayloadAction<Partial<WalletState>>) => {
      Object.assign(state, action.payload);
    },
    connectWallet: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    connectWalletSuccess: (state, action: PayloadAction<{
      address: string;
      provider: any;
      chainId: number;
      balance: string;
    }>) => {
      state.isConnected = true;
      state.address = action.payload.address;
      state.provider = action.payload.provider;
      state.chainId = action.payload.chainId;
      state.balance = action.payload.balance;
      state.isConnecting = false;
      state.error = null;
    },
    connectWalletFailure: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.address = null;
      state.provider = null;
      state.chainId = null;
      state.balance = "0";
      state.isConnecting = false;
      state.error = action.payload;
    },
    disconnectWallet: (state) => {
      state.isConnected = false;
      state.address = null;
      state.provider = null;
      state.chainId = null;
      state.balance = "0";
      state.isConnecting = false;
      state.error = null;
    },
    updateBalance: (state, action: PayloadAction<string>) => {
      state.balance = action.payload;
    },
    updateChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    addCustomToken: (state, action: PayloadAction<{
      symbol: string;
      name: string;
      logo: string;
      address: string;
      decimals: number;
    }>) => {
      // Check if token already exists
      const exists = state.customTokens.some(token => 
        token.address.toLowerCase() === action.payload.address.toLowerCase()
      );
      if (!exists) {
        state.customTokens.push(action.payload);
      }
    },
    removeCustomToken: (state, action: PayloadAction<string>) => {
      state.customTokens = state.customTokens.filter(
        token => token.address.toLowerCase() !== action.payload.toLowerCase()
      );
    },
    clearCustomTokens: (state) => {
      state.customTokens = [];
    },
  },
});

export const {
  setConnecting,
  setError,
  setWalletState,
  connectWallet,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  updateBalance,
  updateChainId,
  addCustomToken,
  removeCustomToken,
  clearCustomTokens,
} = walletSlice.actions;

// Async thunk for connecting wallet - now handled by Reown
export const connectWalletAsync = () => async (dispatch: any) => {
  dispatch(connectWallet());
  // Connection is now handled by useReownWallet hook in components
  // This is just for Redux state management
};

// Async thunk for disconnecting wallet - now handled by Reown
export const disconnectWalletAsync = () => async (dispatch: any) => {
  // Disconnection is now handled by useReownWallet hook in components
  dispatch(disconnectWallet());
};

export default walletSlice.reducer;
