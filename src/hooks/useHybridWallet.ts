import { useCallback, useEffect, useState } from "react";
import { useBSCWallet } from "./useBSCWallet";
import { useWalletRedux } from "./useWalletRedux";
import { Token } from "../services/wallet";

export const useHybridWallet = () => {
  const bscWallet = useBSCWallet();
  const ethWallet = useWalletRedux();
  
  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);

  useEffect(() => {
    // Check if we're in a Telegram Mini App environment
    const isTMA = typeof window !== 'undefined' && 
                  (window as any).Telegram?.WebApp !== undefined;
    setIsTelegramMiniApp(isTMA);
  }, []);

  const connect = useCallback(async () => {
    if (isTelegramMiniApp) {
      // For Telegram Mini Apps, we need to show the address input modal
      // This will be handled by the UI component
      throw new Error("Please use connectWithAddress for Telegram Mini Apps");
    } else {
      return await ethWallet.connect();
    }
  }, [isTelegramMiniApp, ethWallet]);

  const connectWithAddress = useCallback(async (address: string) => {
    if (isTelegramMiniApp) {
      return await bscWallet.connectWithAddress(address);
    } else {
      throw new Error("connectWithAddress is only available in Telegram Mini Apps");
    }
  }, [isTelegramMiniApp, bscWallet]);

  const disconnect = useCallback(() => {
    if (isTelegramMiniApp) {
      bscWallet.disconnect();
    } else {
      ethWallet.disconnect();
    }
  }, [isTelegramMiniApp, bscWallet, ethWallet]);

  const getTokenBalances = useCallback(async (tokens: Token[]) => {
    if (isTelegramMiniApp) {
      return await bscWallet.getTokenBalances(tokens);
    } else {
      return await ethWallet.getTokenBalances(tokens);
    }
  }, [isTelegramMiniApp, bscWallet, ethWallet]);

  // Return the appropriate wallet state
  const walletState = isTelegramMiniApp ? bscWallet : ethWallet;

  return {
    ...walletState,
    isTelegramMiniApp,
    connect,
    connectWithAddress,
    disconnect,
    getTokenBalances,
    // Additional methods for Telegram Mini App
    telegramUser: isTelegramMiniApp ? bscWallet.telegramUser : null,
    // Ensure customTokens is available
    customTokens: ethWallet.customTokens || [],
  };
};
