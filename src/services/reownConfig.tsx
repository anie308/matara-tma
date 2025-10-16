import { createAppKit } from '@reown/appkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { bsc, mainnet, polygon, arbitrum } from 'wagmi/chains'

// Configure supported chains - focus on BSC
export const chains = [bsc, mainnet, polygon, arbitrum] as const

// Create wagmi config
export const config = createConfig({
  chains,
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org/'),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
})

// Create query client
export const queryClient = new QueryClient()

// Create AppKit with Telegram Mini App optimizations
export const appKit = createAppKit({
  adapters: [],
  networks: [bsc],
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID || 'your-project-id-here',
  metadata: {
    name: 'Matara',
    description: 'Matara Telegram Mini App - BSC DeFi Platform',
    url: 'https://matara-tma.vercel.app',
    icons: ['https://matara-tma.vercel.app/icon.png']
  },
  features: {
    analytics: true,
    email: false,
    emailShowWallets: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#44F58E',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '12px',
    '--w3m-font-size-master': '14px',
  }
})

// Providers wrapper
export const ReownProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
