import { useAccount, useConnect, useDisconnect, useBalance, useWriteContract } from 'wagmi'
import { useMemo, useCallback, useState } from 'react'
// import { useBSCWallet } from '../hooks/useBSCWallet' // Removed - using direct BSC wallet service
import { Token } from './wallet'
import { useAppKit } from '@reown/appkit/react'

export interface ReownWalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnecting: boolean;
  error: string | null;
}

export const useReownWallet = () => {
  const { address, isConnected, chainId } = useAccount()
  const { connectors, isPending: isConnecting, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const { writeContract } = useWriteContract()
  
  // Use AppKit for modal management
  const { open, close } = useAppKit()
  
  // For Telegram Mini Apps, we'll use localStorage-based wallet state
  const [bscWalletState, setBscWalletState] = useState({
    isConnected: false,
    address: null as string | null,
    chainId: 56,
    balance: "0",
    isConnecting: false,
    error: null as string | null
  })
  
  // Memoize Telegram Mini App detection to avoid repeated checks
  const isTelegramMiniApp = useMemo(() => 
    typeof window !== 'undefined' && 
    (window as any).Telegram?.WebApp !== undefined, 
    []
  )

  const connectWallet = useCallback(async () => {
    if (isTelegramMiniApp) {
      // In Telegram Mini App, we need to show the address input modal
      // This should be handled by the UI component, not here
      console.log('Telegram Mini App detected - redirecting to address input')
      return Promise.resolve()
    } else {
      // In regular browser, use Reown/WalletConnect
      try {
        console.log('Opening Reown wallet modal...')
        // Open the AppKit modal
        open()
        console.log('Reown wallet modal opened')
      } catch (error) {
        console.error('Reown modal failed to open:', error)
        throw error
      }
    }
  }, [isTelegramMiniApp, open])

  const connectWithAddress = useCallback(async (address: string) => {
    if (isTelegramMiniApp) {
      setBscWalletState(prev => ({
        ...prev,
        isConnected: true,
        address,
        isConnecting: false,
        error: null
      }))
      return true
    } else {
      throw new Error("connectWithAddress is only available in Telegram Mini Apps")
    }
  }, [isTelegramMiniApp])

  const disconnectWallet = useCallback(() => {
    if (isTelegramMiniApp) {
      setBscWalletState(prev => ({
        ...prev,
        isConnected: false,
        address: null,
        error: null
      }))
    } else {
      disconnect()
    }
  }, [isTelegramMiniApp, disconnect])

  const getTokenBalance = async (token: Token): Promise<number> => {
    if (isTelegramMiniApp) {
      // Use our custom BSC wallet service
      // For Telegram Mini Apps, return 0 for now (can be implemented later)
      const balances = {}
      return (balances as any)[token.symbol] || 0
    } else {
      // For now, return 0 for non-Telegram environments
      // Token balance reading will be handled by the component
      console.log(`Token balance for ${token.symbol} not implemented for browser environment`)
      return 0
    }
  }

  const getAllTokenBalances = useCallback(async (tokens: Token[]) => {
    if (isTelegramMiniApp) {
      // For Telegram Mini Apps, return empty balances for now
      const balances: Record<string, number> = {}
      tokens.forEach(token => {
        balances[token.symbol] = 0
      })
      return balances
    } else {
      // For browser environment, return empty balances for now
      const balances: Record<string, number> = {}
      tokens.forEach(token => {
        balances[token.symbol] = 0
      })
      return balances
    }
  }, [isTelegramMiniApp])

  const importToken = useCallback(async (token: Token) => {
    if (isTelegramMiniApp) {
      // For Telegram Mini Apps, we can store custom tokens in localStorage
      try {
        const customTokens = JSON.parse(localStorage.getItem('customTokens') || '[]');
        const tokenExists = customTokens.some((t: Token) => t.address === token.address);
        
        if (!tokenExists) {
          customTokens.push(token);
          localStorage.setItem('customTokens', JSON.stringify(customTokens));
          console.log(`Token ${token.symbol} imported successfully`);
          return true;
        } else {
          console.log(`Token ${token.symbol} already exists`);
          return false;
        }
      } catch (error) {
        console.error('Error importing token:', error);
        return false;
      }
    } else {
      // For browser environment, custom tokens are not supported with Reown
      console.log('Custom token import not supported in browser environment with Reown');
      return false;
    }
  }, [isTelegramMiniApp]);

  const getCustomTokens = useCallback(() => {
    if (isTelegramMiniApp) {
      try {
        return JSON.parse(localStorage.getItem('customTokens') || '[]');
      } catch (error) {
        console.error('Error loading custom tokens:', error);
        return [];
      }
    }
    return [];
  }, [isTelegramMiniApp]);

  const removeCustomToken = useCallback(async (tokenAddress: string) => {
    if (isTelegramMiniApp) {
      try {
        const customTokens = JSON.parse(localStorage.getItem('customTokens') || '[]');
        const filteredTokens = customTokens.filter((t: Token) => t.address !== tokenAddress);
        localStorage.setItem('customTokens', JSON.stringify(filteredTokens));
        console.log(`Token with address ${tokenAddress} removed`);
        return true;
      } catch (error) {
        console.error('Error removing token:', error);
        return false;
      }
    }
    return false;
  }, [isTelegramMiniApp]);

  const sendTransaction = async (to: string, amount: string, token?: Token) => {
    if (isTelegramMiniApp) {
      throw new Error("Transaction signing not supported in Telegram Mini App with current setup")
    } else {
      if (!address) throw new Error("Wallet not connected")
      
      try {
        if (token && token.address !== 'native') {
          // ERC20 token transfer
          await writeContract({
            address: token.address as `0x${string}`,
            abi: [
              {
                name: 'transfer',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [
                  { name: 'to', type: 'address' },
                  { name: 'amount', type: 'uint256' }
                ],
                outputs: [{ name: 'success', type: 'bool' }],
              }
            ],
            functionName: 'transfer',
            args: [to as `0x${string}`, BigInt(amount)],
          })
        } else {
          // Native token transfer
          await writeContract({
            address: to as `0x${string}`,
            abi: [],
            functionName: 'transfer',
            args: [BigInt(amount)],
          })
        }
      } catch (error) {
        console.error('Transaction failed:', error)
        throw error
      }
    }
  }

  return {
    // State
    isConnected: isTelegramMiniApp ? bscWalletState.isConnected : isConnected,
    address: isTelegramMiniApp ? bscWalletState.address : address,
    chainId: isTelegramMiniApp ? bscWalletState.chainId : chainId,
    balance: isTelegramMiniApp ? bscWalletState.balance : balance?.formatted || '0',
    isConnecting: isTelegramMiniApp ? bscWalletState.isConnecting : isConnecting,
    error: isTelegramMiniApp ? bscWalletState.error : connectError?.message || null,
    
    // Actions
    connect: connectWallet,
    connectWithAddress,
    disconnect: disconnectWallet,
    getTokenBalance,
    getAllTokenBalances,
    importToken,
    getCustomTokens,
    removeCustomToken,
    sendTransaction,
    
    // Additional info
    isTelegramMiniApp,
    telegramUser: isTelegramMiniApp ? null : null, // Telegram user data not implemented yet
    connectors: isTelegramMiniApp ? [] : connectors,
    // AppKit functions
    openModal: open,
    closeModal: close,
  }
}
