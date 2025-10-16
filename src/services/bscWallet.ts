import { ethers } from "ethers";

export interface Token {
  symbol: string;
  name: string;
  logo: string;
  address: string;
  decimals: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: ethers.JsonRpcProvider | null;
  chainId: number | null;
  balance: string;
}

export class BSCWalletService {
  private static instance: BSCWalletService;
  private provider: ethers.JsonRpcProvider | null = null;
  private account: string | null = null;
  private chainId: number = 56; // BSC mainnet

  private constructor() {}

  static getInstance(): BSCWalletService {
    if (!BSCWalletService.instance) {
      BSCWalletService.instance = new BSCWalletService();
    }
    return BSCWalletService.instance;
  }

  async connectWallet(): Promise<WalletState> {
    try {
      // For Telegram Mini Apps, we need to use a different approach
      // Since window.ethereum doesn't exist, we'll use a direct RPC connection
      // and ask the user to provide their wallet address
      
      console.log("Connecting to BSC network for Telegram Mini App...");
      
      // Initialize BSC RPC provider
      this.provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
      this.chainId = 56;

      // For Telegram Mini Apps, we need to get the address from the user
      // This could be done through:
      // 1. QR code scanning
      // 2. Manual address input
      // 3. Integration with Telegram's wallet features
      
      // For now, we'll simulate a connection - in a real app, you'd get this from user input
      const userAddress = await this.getUserAddress();
      
      if (!userAddress) {
        throw new Error("No wallet address provided. Please connect your wallet.");
      }

      this.account = userAddress;

      // Get balance
      const balance = await this.provider.getBalance(this.account);
      const balanceFormatted = ethers.formatEther(balance);

      return {
        isConnected: true,
        address: this.account,
        provider: this.provider,
        chainId: this.chainId,
        balance: balanceFormatted,
      };
    } catch (error) {
      console.error("BSC wallet connection failed:", error);
      throw error;
    }
  }

  private async getUserAddress(): Promise<string | null> {
    // In a real Telegram Mini App, you would:
    // 1. Show a QR code for users to scan with their BSC wallet
    // 2. Provide a manual input field
    // 3. Use Telegram's built-in wallet features if available
    
    // For now, we'll check if there's a stored address or prompt the user
    const storedAddress = localStorage.getItem('bsc_wallet_address');
    
    if (storedAddress) {
      return storedAddress;
    }

    // In a real implementation, you would show a modal or form here
    // For now, we'll return null to trigger the connection flow
    return null;
  }

  async setUserAddress(address: string): Promise<WalletState> {
    try {
      // Validate the address
      if (!ethers.isAddress(address)) {
        throw new Error("Invalid wallet address");
      }

      this.account = address;
      this.provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
      this.chainId = 56;

      // Store the address for future use
      localStorage.setItem('bsc_wallet_address', address);

      // Get balance
      const balance = await this.provider.getBalance(this.account);
      const balanceFormatted = ethers.formatEther(balance);

      return {
        isConnected: true,
        address: this.account,
        provider: this.provider,
        chainId: this.chainId,
        balance: balanceFormatted,
      };
    } catch (error) {
      console.error("Failed to set user address:", error);
      throw error;
    }
  }

  async getTokenBalance(token: Token, userAddress: string): Promise<number> {
    if (!this.provider) throw new Error("Wallet not connected");

    try {
      if (token.address === "native") {
        const balance = await this.provider.getBalance(userAddress);
        return Number(ethers.formatEther(balance));
      }

      // Validate token address
      if (!token.address || token.address === "0x0000000000000000000000000000000000000000") {
        console.warn(`Invalid token address for ${token.symbol}: ${token.address}`);
        return 0;
      }

      const ERC20_ABI = [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)",
      ];

      console.log(`Fetching BSC balance for ${token.symbol} (${token.address})`);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Contract call timeout')), 10000)
      );

      const contract = new ethers.Contract(token.address, ERC20_ABI, this.provider);
      
      // Try to get balance with a timeout
      const balancePromise = contract.balanceOf(userAddress);
      const decimalsPromise = contract.decimals();
      
      const [rawBalance, decimals] = await Promise.race([
        Promise.all([balancePromise, decimalsPromise]),
        timeoutPromise
      ]) as [bigint, number];

      const balance = Number(ethers.formatUnits(rawBalance, decimals));
      console.log(`BSC Balance for ${token.symbol}: ${balance}`);
      return balance;
    } catch (error: any) {
      console.error(`Error fetching BSC balance for ${token.symbol}:`, error);
      return 0;
    }
  }

  async getAllTokenBalances(tokens: Token[], userAddress: string): Promise<Record<string, number>> {
    const balances: Record<string, number> = {};

    console.log(`Fetching BSC balances for ${tokens.length} tokens for address: ${userAddress}`);

    // Process tokens in batches to avoid overwhelming the network
    const batchSize = 3;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      
      console.log(`Processing BSC batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tokens.length / batchSize)}: ${batch.map(t => t.symbol).join(', ')}`);
      
      const batchPromises = batch.map(async (token) => {
        try {
          const balance = await this.getTokenBalance(token, userAddress);
          return { symbol: token.symbol, balance };
        } catch (error) {
          console.error(`Error fetching BSC balance for ${token.symbol}:`, error);
          return { symbol: token.symbol, balance: 0 };
        }
      });

      try {
        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(({ symbol, balance }) => {
          balances[symbol] = balance;
        });
      } catch (error) {
        console.error(`BSC batch processing failed:`, error);
        // Set all tokens in this batch to 0 balance
        batch.forEach(token => {
          balances[token.symbol] = 0;
        });
      }

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < tokens.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`Completed fetching BSC balances. Results:`, balances);
    return balances;
  }

  getCurrentState(): WalletState {
    return {
      isConnected: !!this.account,
      address: this.account,
      provider: this.provider,
      chainId: this.chainId,
      balance: "0",
    };
  }

  disconnect(): void {
    this.provider = null;
    this.account = null;
    this.chainId = 56;
    localStorage.removeItem('bsc_wallet_address');
  }

  // Method to check if we're in a Telegram Mini App environment
  isTelegramMiniApp(): boolean {
    return typeof window !== 'undefined' && 
           (window as any).Telegram?.WebApp !== undefined;
  }

  // Method to get Telegram user info if available
  getTelegramUser(): any {
    if (this.isTelegramMiniApp()) {
      return (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
    }
    return null;
  }
}

export const bscWalletService = BSCWalletService.getInstance();
