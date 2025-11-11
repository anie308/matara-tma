import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { POPULAR_BSC_TOKENS } from "../coinLogos";
import { getMultipleTokenPrices } from "../cryptoPrice";

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  logo: string;
  decimals: number;
  price?: number;
  lastPriceUpdate?: number;
}

interface TokensState {
  tokens: Record<string, TokenInfo>;
  prices: Record<string, number>;
  lastPriceUpdate: number | null;
  isUpdatingPrices: boolean;
  priceUpdateInterval: number; // in milliseconds
}

// Initialize tokens from POPULAR_BSC_TOKENS
const initializeTokens = (): Record<string, TokenInfo> => {
  const tokens: Record<string, TokenInfo> = {};
  Object.values(POPULAR_BSC_TOKENS).forEach((token) => {
    tokens[token.symbol] = {
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      logo: token.logo,
      decimals: token.decimals,
    };
  });
  return tokens;
};

const initialState: TokensState = {
  tokens: initializeTokens(),
  prices: {},
  lastPriceUpdate: null,
  isUpdatingPrices: false,
  priceUpdateInterval: 60000, // 1 minute default
};

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokenPrice: (
      state,
      action: PayloadAction<{ symbol: string; price: number }>
    ) => {
      const { symbol, price } = action.payload;
      state.prices[symbol] = price;
      if (state.tokens[symbol]) {
        state.tokens[symbol].price = price;
        state.tokens[symbol].lastPriceUpdate = Date.now();
      }
    },
    setTokenPrices: (
      state,
      action: PayloadAction<Record<string, number>>
    ) => {
      const prices = action.payload;
      state.prices = { ...state.prices, ...prices };
      state.lastPriceUpdate = Date.now();
      
      // Update prices in tokens
      Object.keys(prices).forEach((symbol) => {
        if (state.tokens[symbol]) {
          state.tokens[symbol].price = prices[symbol];
          state.tokens[symbol].lastPriceUpdate = Date.now();
        }
      });
    },
    addToken: (state, action: PayloadAction<TokenInfo>) => {
      const token = action.payload;
      state.tokens[token.symbol] = token;
    },
    updateTokenLogo: (
      state,
      action: PayloadAction<{ symbol: string; logo: string }>
    ) => {
      const { symbol, logo } = action.payload;
      if (state.tokens[symbol]) {
        state.tokens[symbol].logo = logo;
      }
    },
    setIsUpdatingPrices: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingPrices = action.payload;
    },
    setPriceUpdateInterval: (state, action: PayloadAction<number>) => {
      state.priceUpdateInterval = action.payload;
    },
  },
});

export const {
  setTokenPrice,
  setTokenPrices,
  addToken,
  updateTokenLogo,
  setIsUpdatingPrices,
  setPriceUpdateInterval,
} = tokensSlice.actions;

// Thunk to fetch and update prices for all tokens
export const updateAllTokenPrices = (): any => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { tokens } = state.tokens;
    
    // Prevent concurrent updates
    if (state.tokens.isUpdatingPrices) {
      return;
    }

    dispatch(setIsUpdatingPrices(true));

    try {
      const symbols = Object.keys(tokens);
      const prices = await getMultipleTokenPrices(symbols);
      
      if (Object.keys(prices).length > 0) {
        dispatch(setTokenPrices(prices));
      }
    } catch (error) {
      console.error("Error updating token prices:", error);
    } finally {
      dispatch(setIsUpdatingPrices(false));
    }
  };
};

// Thunk to initialize and start price updates
export const initializeTokenPrices = (): any => {
  return async (dispatch: AppDispatch) => {
    // Initial price fetch
    await dispatch(updateAllTokenPrices());
  };
};

export default tokensSlice.reducer;

