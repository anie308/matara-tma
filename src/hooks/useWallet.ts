import { useState, useEffect, useCallback } from "react";
import { walletService, WalletState, Token } from "../services/wallet";

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    chainId: null,
    balance: "0",
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const state = await walletService.connectWallet();
      setWalletState(state);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    walletService.disconnect();
    setWalletState({
      isConnected: false,
      address: null,
      provider: null,
      chainId: null,
      balance: "0",
    });
  }, []);

  const getTokenBalances = useCallback(async (tokens: Token[]) => {
    if (!walletState.address) return {};
    
    try {
      return await walletService.getAllTokenBalances(tokens, walletState.address);
    } catch (err) {
      console.error("Error fetching token balances:", err);
      return {};
    }
  }, [walletState.address]);

  const importToken = useCallback(async (token: Token) => {
    try {
      return await walletService.importToken(token);
    } catch (err) {
      console.error("Error importing token:", err);
      return false;
    }
  }, []);

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

    const handleChainChanged = () => {
      // Reconnect to get new chain info
      connect();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [connect, disconnect]);

  return {
    ...walletState,
    isConnecting,
    error,
    connect,
    disconnect,
    getTokenBalances,
    importToken,
  };
};
