import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { bscWalletService, WalletState, Token } from "../services/bscWallet";

export const useBSCWallet = () => {
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
      const state = await bscWalletService.connectWallet();
      setWalletState(state);
    } catch (err: any) {
      setError(err.message || "Failed to connect BSC wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectWithAddress = useCallback(async (address: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const state = await bscWalletService.setUserAddress(address);
      setWalletState(state);
    } catch (err: any) {
      setError(err.message || "Failed to connect with address");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    bscWalletService.disconnect();
    setWalletState({
      isConnected: false,
      address: null,
      provider: null,
      chainId: null,
      balance: "0",
    });
  }, []);

  const getTokenBalances = useCallback(async (tokens: Token[]) => {
    if (!walletState.address) {
      console.warn("No BSC wallet address available for fetching token balances");
      return {};
    }
    
    try {
      console.log(`Fetching BSC balances for ${tokens.length} tokens...`);
      const balances = await bscWalletService.getAllTokenBalances(tokens, walletState.address);
      console.log(`Successfully fetched BSC balances for ${Object.keys(balances).length} tokens`);
      return balances;
    } catch (err) {
      console.error("Error fetching BSC token balances:", err);
      return {};
    }
  }, [walletState.address]);

  // Update balance periodically
  useEffect(() => {
    if (!walletState.isConnected || !walletState.address) return;

    const updateBalancePeriodically = async () => {
      try {
        if (!walletState.address) return;
        const balance = await bscWalletService.getCurrentState().provider?.getBalance(walletState.address);
        if (balance) {
          const balanceFormatted = ethers.formatEther(balance);
          setWalletState(prev => ({ ...prev, balance: balanceFormatted }));
        }
      } catch (error) {
        console.error("Error updating BSC balance:", error);
      }
    };

    // Update balance immediately
    updateBalancePeriodically();

    // Update balance every 30 seconds
    const interval = setInterval(updateBalancePeriodically, 30000);

    return () => clearInterval(interval);
  }, [walletState.isConnected, walletState.address]);

  // Check if we're in Telegram Mini App
  const isTelegramMiniApp = bscWalletService.isTelegramMiniApp();
  const telegramUser = bscWalletService.getTelegramUser();

  return {
    ...walletState,
    isConnecting,
    error,
    connect,
    connectWithAddress,
    disconnect,
    getTokenBalances,
    isTelegramMiniApp,
    telegramUser,
  };
};
