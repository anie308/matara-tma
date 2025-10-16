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
  provider: ethers.BrowserProvider | null;
  chainId: number | null;
  balance: string;
}

export class WalletService {
  private static instance: WalletService;
  private provider: ethers.BrowserProvider | null = null;
  private account: string | null = null;
  private chainId: number | null = null;

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async connectWallet(): Promise<WalletState> {
    try {
      if (!window.ethereum) {
        throw new Error("No wallet found. Please install MetaMask or another Web3 wallet.");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.account = accounts[0];

      // Get chain ID
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);

      // Check if we're on BSC, if not, try to switch
      if (this.chainId !== 56) {
        console.log(`Current network: ${network.name} (Chain ID: ${this.chainId}). Switching to BSC...`);
        await this.switchToBSC();
        
        // Get updated network info after switching
        const updatedNetwork = await this.provider.getNetwork();
        this.chainId = Number(updatedNetwork.chainId);
        
        if (this.chainId !== 56) {
          throw new Error("Failed to switch to BSC network. Please switch manually to Binance Smart Chain.");
        }
      }

      // Get balance
      const balance = await this.provider.getBalance(this.account!);
      const balanceFormatted = ethers.formatEther(balance);

      return {
        isConnected: true,
        address: this.account,
        provider: this.provider,
        chainId: this.chainId,
        balance: balanceFormatted,
      };
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw error;
    }
  }

  async switchToBSC(): Promise<void> {
    if (!window.ethereum) return;

    try {
      console.log("Attempting to switch to BSC network...");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }], // BSC mainnet
      });
      console.log("Successfully switched to BSC network");
    } catch (switchError: any) {
      console.log("Switch failed, error:", switchError);
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        console.log("BSC network not found, adding it...");
        await this.addBSCNetwork();
      } else {
        console.error("Failed to switch to BSC:", switchError);
        throw switchError;
      }
    }
  }

  private async addBSCNetwork(): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x38",
            chainName: "Binance Smart Chain",
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            rpcUrls: [
              "https://bsc-dataseed.binance.org/",
              "https://bsc-dataseed1.defibit.io/",
              "https://bsc-dataseed1.ninicoin.io/"
            ],
            blockExplorerUrls: ["https://bscscan.com/"],
          },
        ],
      });
      console.log("BSC network added successfully");
    } catch (error) {
      console.error("Failed to add BSC network:", error);
      throw error;
    }
  }

  async getTokenBalance(token: Token, userAddress: string, retryCount: number = 0): Promise<number> {
    if (!this.provider) throw new Error("Wallet not connected");

    try {
      // Check if we're on the correct network (BSC)
      const network = await this.provider.getNetwork();
      console.log(`Current network: ${network.name} (Chain ID: ${network.chainId})`);
      
      if (Number(network.chainId) !== 56) {
        console.warn(`Not on BSC network. Current chainId: ${network.chainId}`);
        return 0;
      }

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

      console.log(`Fetching balance for ${token.symbol} (${token.address}) - Attempt ${retryCount + 1}`);
      
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
      console.log(`Balance for ${token.symbol}: ${balance}`);
      return balance;
    } catch (error: any) {
      console.error(`Error fetching balance for ${token.symbol} (Attempt ${retryCount + 1}):`, error);
      
      // Retry logic for certain errors
      if (retryCount < 2 && (
        error.message === 'Contract call timeout' || 
        error.code === 'NETWORK_ERROR' ||
        error.code === 'TIMEOUT'
      )) {
        console.log(`Retrying ${token.symbol} in 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getTokenBalance(token, userAddress, retryCount + 1);
      }
      
      // Check if it's a timeout error
      if (error.message === 'Contract call timeout') {
        console.warn(`Contract call timed out for ${token.symbol}. Trying fallback RPC...`);
      }
      
      // Check if it's a network-related error
      if (error.code === 'CALL_EXCEPTION' || error.reason === 'missing revert data' || error.message === 'Contract call timeout') {
        console.warn(`Contract call failed for ${token.symbol}. This might be due to wrong network or invalid contract.`);
        
        // Try with a direct BSC RPC as fallback
        try {
          console.log(`Attempting fallback RPC for ${token.symbol}...`);
          const fallbackProvider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
          const ERC20_ABI = [
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)",
          ];
          const fallbackContract = new ethers.Contract(token.address, ERC20_ABI, fallbackProvider);
          
          // Add timeout for fallback as well
          const fallbackTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Fallback contract call timeout')), 8000)
          );
          
          const [rawBalance, decimals] = await Promise.race([
            Promise.all([
              fallbackContract.balanceOf(userAddress),
              fallbackContract.decimals(),
            ]),
            fallbackTimeoutPromise
          ]) as [bigint, number];
          
          const balance = Number(ethers.formatUnits(rawBalance, decimals));
          console.log(`Fallback balance for ${token.symbol}: ${balance}`);
          return balance;
        } catch (fallbackError: any) {
          console.error(`Fallback also failed for ${token.symbol}:`, fallbackError);
          
          // If it's a specific contract error, log more details
          if (fallbackError.code === 'CALL_EXCEPTION') {
            console.error(`Contract ${token.symbol} (${token.address}) might not exist or be invalid on BSC`);
          }
        }
      }
      
      return 0;
    }
  }

  async getAllTokenBalances(tokens: Token[], userAddress: string): Promise<Record<string, number>> {
    const balances: Record<string, number> = {};

    console.log(`Fetching balances for ${tokens.length} tokens for address: ${userAddress}`);

    // Process tokens in batches to avoid overwhelming the network
    const batchSize = 3;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tokens.length / batchSize)}: ${batch.map(t => t.symbol).join(', ')}`);
      
      const batchPromises = batch.map(async (token) => {
        try {
          const balance = await this.getTokenBalance(token, userAddress);
          return { symbol: token.symbol, balance };
        } catch (error) {
          console.error(`Error fetching balance for ${token.symbol}:`, error);
          return { symbol: token.symbol, balance: 0 };
        }
      });

      try {
        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(({ symbol, balance }) => {
          balances[symbol] = balance;
        });
      } catch (error) {
        console.error(`Batch processing failed:`, error);
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

    console.log(`Completed fetching balances. Results:`, balances);
    return balances;
  }

  async importToken(token: Token): Promise<boolean> {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.logo,
          },
        },
      });
      return true;
    } catch (error) {
      console.error("Token import failed:", error);
      return false;
    }
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
    this.chainId = null;
  }
}

export const walletService = WalletService.getInstance();
