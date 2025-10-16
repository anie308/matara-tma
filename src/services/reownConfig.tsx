import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { bsc, bscTestnet, mainnet, polygon, arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Configure supported chains - focus on BSC Testnet for testing
export const networks = [bscTestnet, bsc, mainnet, polygon, arbitrum]

// Create query client
export const queryClient = new QueryClient()

// Get projectId from environment
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'your-project-id-here'

// Create metadata object
const metadata = {
  name: 'Matara',
  description: 'Matara Telegram Mini App - BSC DeFi Platform',
  url: 'https://matara-tma.vercel.app',
  icons: ['https://matara-tma.vercel.app/icon.png']
}

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// Create AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks: [bscTestnet] as any, // Use BSC Testnet for testing
  projectId,
  metadata,
  features: {
    analytics: true
  }
})

// Providers wrapper
export const ReownProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
