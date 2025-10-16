import { useAccount, useConnect, useDisconnect, useBalance, useReadContract, useWriteContract } from 'wagmi'
import { useBSCWallet } from '../hooks/useBSCWallet'
import { Token } from './wallet'

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
  const { connect, connectors, isPending: isConnecting, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const { writeContract } = useWriteContract()
  
  // Fallback to our custom BSC wallet for Telegram Mini Apps
  const bscWallet = useBSCWallet()
  
  const isTelegramMiniApp = typeof window !== 'undefined' && 
                           (window as any).Telegram?.WebApp !== undefined

  const connectWallet = async () => {
    if (isTelegramMiniApp) {
      // In Telegram Mini App, use our custom BSC wallet
      return await bscWallet.connect()
    } else {
      // In regular browser, use Reown/WalletConnect
      try {
        await connect({ connector: connectors[0] })
      } catch (error) {
        console.error('Reown connection failed:', error)
        throw error
      }
    }
  }

  const connectWithAddress = async (address: string) => {
    if (isTelegramMiniApp) {
      return await bscWallet.connectWithAddress(address)
    } else {
      throw new Error("connectWithAddress is only available in Telegram Mini Apps")
    }
  }

  const disconnectWallet = () => {
    if (isTelegramMiniApp) {
      bscWallet.disconnect()
    } else {
      disconnect()
    }
  }

  const getTokenBalance = async (token: Token) => {
    if (isTelegramMiniApp) {
      // Use our custom BSC wallet service
      return await bscWallet.getTokenBalances([token])
    } else {
      // Use wagmi for contract reading
      if (!address || !token.address) return 0
      
      try {
        const result = await useReadContract({
          address: token.address as `0x${string}`,
          abi: [
            {
              name: 'balanceOf',
              type: 'function',
              stateMutability: 'view',
              inputs: [{ name: 'account', type: 'address' }],
              outputs: [{ name: 'balance', type: 'uint256' }],
            },
            {
              name: 'decimals',
              type: 'function',
              stateMutability: 'view',
              inputs: [],
              outputs: [{ name: 'decimals', type: 'uint8' }],
            }
          ],
          functionName: 'balanceOf',
          args: [address],
        })
        
        return result.data ? Number(result.data) / Math.pow(10, token.decimals) : 0
      } catch (error) {
        console.error('Error reading token balance:', error)
        return 0
      }
    }
  }

  const getAllTokenBalances = async (tokens: Token[]) => {
    if (isTelegramMiniApp) {
      return await bscWallet.getTokenBalances(tokens)
    } else {
      const balances: Record<string, number> = {}
      
      for (const token of tokens) {
        try {
          const balance = await getTokenBalance(token)
          balances[token.symbol] = balance
        } catch (error) {
          console.error(`Error fetching balance for ${token.symbol}:`, error)
          balances[token.symbol] = 0
        }
      }
      
      return balances
    }
  }

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
    isConnected: isTelegramMiniApp ? bscWallet.isConnected : isConnected,
    address: isTelegramMiniApp ? bscWallet.address : address,
    chainId: isTelegramMiniApp ? bscWallet.chainId : chainId,
    balance: isTelegramMiniApp ? bscWallet.balance : balance?.formatted || '0',
    isConnecting: isTelegramMiniApp ? bscWallet.isConnecting : isConnecting,
    error: isTelegramMiniApp ? bscWallet.error : connectError?.message || null,
    
    // Actions
    connect: connectWallet,
    connectWithAddress,
    disconnect: disconnectWallet,
    getTokenBalance,
    getAllTokenBalances,
    sendTransaction,
    
    // Additional info
    isTelegramMiniApp,
    telegramUser: isTelegramMiniApp ? bscWallet.telegramUser : null,
    connectors: isTelegramMiniApp ? [] : connectors,
  }
}
