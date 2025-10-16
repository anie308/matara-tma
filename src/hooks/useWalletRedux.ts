import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/store";
import { 
  connectWalletAsync, 
  disconnectWalletAsync, 
  updateBalance,
  updateChainId,
  addCustomToken,
  removeCustomToken,
  clearCustomTokens
} from "../services/redux/wallet";
import { walletService, Token } from "../services/wallet";
import { ethers } from "ethers";

export const useWalletRedux = () => {
  const dispatch = useDispatch();
  const walletState = useSelector((state: RootState) => state.wallet);

  const connect = useCallback(async () => {
    dispatch(connectWalletAsync() as any);
  }, [dispatch]);

  const disconnect = useCallback(async () => {
    dispatch(disconnectWalletAsync() as any);
  }, [dispatch]);

  const getTokenBalances = useCallback(async (tokens: Token[]) => {
    if (!walletState.address) {
      console.warn("No wallet address available for fetching token balances");
      return {};
    }
    
    try {
      console.log(`Fetching balances for ${tokens.length} tokens...`);
      const balances = await walletService.getAllTokenBalances(tokens, walletState.address);
      console.log(`Successfully fetched balances for ${Object.keys(balances).length} tokens`);
      return balances;
    } catch (err) {
      console.error("Error fetching token balances:", err);
      // Return empty object but don't throw - let the UI handle the empty state
      return {};
    }
  }, [walletState.address]);

  const importToken = useCallback(async (token: Token) => {
    try {
      // Add to Redux store for persistence
      dispatch(addCustomToken({
        symbol: token.symbol,
        name: token.name,
        logo: token.logo,
        address: token.address,
        decimals: token.decimals
      }));
      
      // Also try to add to wallet (for MetaMask import)
      return await walletService.importToken(token);
    } catch (err) {
      console.error("Error importing token:", err);
      return false;
    }
  }, [dispatch]);

  const removeToken = useCallback((tokenAddress: string) => {
    dispatch(removeCustomToken(tokenAddress));
  }, [dispatch]);

  const clearAllTokens = useCallback(() => {
    dispatch(clearCustomTokens());
  }, [dispatch]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        // Reconnect with new account
        connect();
      }
    };

    const handleChainChanged = (chainId: string) => {
      // Update chain ID
      dispatch(updateChainId(parseInt(chainId, 16)));
      // Reconnect to get updated state
      connect();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [connect, disconnect, dispatch]);

  // Update balance periodically
  useEffect(() => {
    if (!walletState.isConnected || !walletState.address) return;

    const updateBalancePeriodically = async () => {
      try {
        if (!walletState.address) return;
        const balance = await walletService.getCurrentState().provider?.getBalance(walletState.address);
        if (balance) {
          const balanceFormatted = ethers.formatEther(balance);
          dispatch(updateBalance(balanceFormatted));
        }
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    };

    // Update balance immediately
    updateBalancePeriodically();

    // Update balance every 30 seconds
    const interval = setInterval(updateBalancePeriodically, 30000);

    return () => clearInterval(interval);
  }, [walletState.isConnected, walletState.address, dispatch]);

  return {
    ...walletState,
    connect,
    disconnect,
    getTokenBalances,
    importToken,
    removeToken,
    clearAllTokens,
  };
};
