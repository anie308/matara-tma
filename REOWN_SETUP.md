# Reown (WalletConnect v2) Setup Guide

## 🚀 What We've Implemented

Your Telegram Mini App now has **full Reown integration** with the following features:

### ✅ **Hybrid Wallet System**
- **Telegram Mini Apps**: Uses custom BSC wallet service with address input
- **Regular Browsers**: Uses Reown/WalletConnect for 300+ wallet support
- **Automatic Detection**: Switches between modes based on environment

### ✅ **BSC Network Support**
- **Primary Chain**: Binance Smart Chain (BSC)
- **Supported Chains**: BSC, Ethereum, Polygon, Arbitrum
- **Direct RPC**: Uses BSC RPC endpoints for reliable connection

### ✅ **Telegram Mini App Optimizations**
- **Mobile Wallet Support**: MetaMask, Trust Wallet, Coinbase Wallet
- **Deep Linking**: Proper URL schemes for mobile wallets
- **Fallback System**: Custom BSC wallet for address-based connection

## 🔧 Setup Instructions

### 1. Get Reown Project ID

1. Go to [Reown Cloud](https://cloud.reown.com/)
2. Create a new project
3. Copy your Project ID
4. Add it to your environment variables:

```bash
# Create .env file
echo "VITE_REOWN_PROJECT_ID=your-project-id-here" > .env
```

### 2. Update Your Environment

Replace `your-project-id-here` in `src/services/reownConfig.ts` with your actual Project ID:

```typescript
projectId: import.meta.env.VITE_REOWN_PROJECT_ID || 'your-actual-project-id',
```

### 3. Test the Integration

```bash
# Start development server
yarn dev

# Build for production
yarn build
```

## 🎯 How It Works

### **In Telegram Mini Apps:**
1. User opens your Mini App
2. System detects Telegram environment
3. Shows "Connect BSC Wallet" button
4. User enters their BSC wallet address
5. App connects to BSC network directly
6. Fetches token balances using BSC RPC

### **In Regular Browsers:**
1. User opens your app in browser
2. System detects browser environment
3. Shows "Connect Wallet" button
4. Reown modal opens with 300+ wallet options
5. User connects their preferred wallet
6. App works with connected wallet

## 🔑 Key Features

### **Smart Environment Detection**
```typescript
const isTelegramMiniApp = typeof window !== 'undefined' && 
                         (window as any).Telegram?.WebApp !== undefined
```

### **Hybrid Wallet Service**
- **Telegram**: Custom BSC wallet with address input
- **Browser**: Reown with full wallet support
- **Unified API**: Same interface for both environments

### **BSC Network Focus**
- **Primary Chain**: BSC (Chain ID: 56)
- **RPC Endpoints**: Multiple BSC RPC providers
- **Token Support**: All BSC tokens (USDT, USDC, CAKE, etc.)

## 🛠️ Customization Options

### **Add More Wallets**
Edit `src/services/reownConfig.ts`:

```typescript
mobileWallets: [
  {
    id: 'metamask',
    name: 'MetaMask',
    links: {
      native: 'metamask://',
      universal: 'https://metamask.app.link/'
    }
  },
  // Add more wallets here
]
```

### **Change Theme**
Update theme variables in `reownConfig.ts`:

```typescript
themeVariables: {
  '--w3m-color-mix': '#44F58E', // Your brand color
  '--w3m-color-mix-strength': 40,
  '--w3m-border-radius-master': '12px',
}
```

### **Add More Chains**
Add chains to the `chains` array:

```typescript
export const chains = [bsc, mainnet, polygon, arbitrum, avalanche] as const
```

## 🚨 Important Notes

### **Telegram Mini App Limitations**
- No direct wallet extension access
- Requires manual address input
- Limited to read operations (viewing balances)
- Transaction signing needs additional setup

### **Browser Wallet Support**
- Full wallet extension support
- Transaction signing capabilities
- 300+ wallet compatibility
- Deep linking to mobile wallets

## 🔍 Testing

### **Test in Telegram Mini App**
1. Deploy your app to a public URL
2. Create a Telegram bot
3. Set webhook to your app URL
4. Test wallet connection flow

### **Test in Browser**
1. Open `http://localhost:5173`
2. Click "Connect Wallet"
3. Test with MetaMask, WalletConnect, etc.

## 📱 Mobile Wallet Deep Linking

The integration includes proper deep linking for mobile wallets:

- **MetaMask**: `metamask://` → `https://metamask.app.link/`
- **Trust Wallet**: `trust://` → `https://link.trustwallet.com/`
- **Coinbase**: `cbwallet://` → `https://go.cb-w.com/`

## 🎉 Benefits

### **For Users**
- ✅ Seamless wallet connection
- ✅ Support for 300+ wallets
- ✅ Works in Telegram and browsers
- ✅ BSC network optimized

### **For Developers**
- ✅ Unified API
- ✅ Environment detection
- ✅ Fallback systems
- ✅ Easy customization

## 🆘 Troubleshooting

### **Common Issues**

1. **"Project ID not found"**
   - Make sure you've set `VITE_REOWN_PROJECT_ID` in your environment

2. **"Wallet not connecting"**
   - Check if you're in the right environment (Telegram vs Browser)
   - Verify your Reown project ID

3. **"BSC network issues"**
   - The app uses multiple BSC RPC endpoints for reliability
   - Check your internet connection

### **Debug Mode**
Add this to see detailed logs:

```typescript
// In reownConfig.ts
features: {
  analytics: true, // Enable for debugging
}
```

## 🚀 Next Steps

1. **Get your Reown Project ID** from [cloud.reown.com](https://cloud.reown.com/)
2. **Update the configuration** with your Project ID
3. **Test in both environments** (Telegram Mini App and browser)
4. **Customize the theme** to match your brand
5. **Deploy and test** with real users

Your Telegram Mini App now has **professional-grade wallet integration** that works seamlessly in both Telegram and regular browsers! 🎉
