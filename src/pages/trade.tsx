import WebApp from "@twa-dev/sdk";
import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Copy, Eye, EyeOff, Plus, RefreshCw, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTransaction } from "../services/redux/transaction";
import { RootState } from "../services/store";
import { useBackendWallet } from "../hooks/useBackendWallet";
import ImportTokenModal from "../components/modal/ImportTokenModal";
import TokenLogo from "../components/TokenLogo";
import { getTokenVariant } from "../utils/tokenUtils";
import { getMultipleTokenPrices } from "../services/cryptoPrice";
import { toast } from "react-hot-toast";

// Utility function to format numbers with commas
const formatNumber = (num: number): string => {
  if (num === 0) return "0.00";
  if (num < 0.01) return num.toFixed(6);
  if (num < 1) return num.toFixed(4);
  if (num < 1000) return num.toFixed(2);
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};


export default function Trade() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  WebApp.BackButton.hide();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  const { 
    isConnected, 
    address, 
    isLoadingBalances,
    totalBalanceUsd,
    getAvailableTokens,
    getTokenBalances,
    importToken,
  } = useBackendWallet();

  const transaction = useSelector((state: RootState) => state.transaction);
  const dispatch = useDispatch();

  // Refresh balances when component mounts or address changes
  useEffect(() => {
    if (!isConnected || !address) {
      return;
    }
    
    // Small delay to prevent multiple calls
    const timeoutId = setTimeout(() => {
      getTokenBalances();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [isConnected, address]); // Removed getTokenBalances from dependencies

  // Fetch real token prices
  useEffect(() => {
    if (!isConnected) {
      setIsLoadingPrices(false);
      return;
    }

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;
    let priceTimeoutId: NodeJS.Timeout | null = null;

    const fetchPrices = async () => {
      // Set timeout for price fetch
      priceTimeoutId = setTimeout(() => {
        if (isMounted) {
          setIsLoadingPrices(false);
          console.warn('Price fetch timeout');
        }
      }, 15000); // 15 second timeout
      
      try {
        const availableTokens = getAvailableTokens();
        const symbols = availableTokens.map(t => t.symbol).filter(s => s); // Filter out empty symbols
        
        if (symbols.length === 0) {
          if (isMounted) {
            setIsLoadingPrices(false);
          }
          if (priceTimeoutId) clearTimeout(priceTimeoutId);
          return;
        }

        const prices = await getMultipleTokenPrices(symbols);
        
        if (priceTimeoutId) clearTimeout(priceTimeoutId);
        
        // Only update state if component is still mounted
        if (isMounted) {
          if (Object.keys(prices).length > 0) {
            setTokenPrices(prices);
          }
          setIsLoadingPrices(false);
        }
      } catch (error) {
        console.error('Error fetching token prices:', error);
        if (priceTimeoutId) clearTimeout(priceTimeoutId);
        if (isMounted) {
          setIsLoadingPrices(false);
        }
      }
    };

    // Initial fetch with delay to prevent race conditions
    const initialTimeout = setTimeout(() => {
      fetchPrices();
    }, 1000);
    
    // Refresh prices every 60 seconds
    intervalId = setInterval(fetchPrices, 60000);
    
    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (priceTimeoutId) {
        clearTimeout(priceTimeoutId);
      }
    };
  }, [isConnected]); // Only depend on isConnected




  const handleReceive = () => {
    dispatch(setTransaction({ ...transaction, type: "receive" }));
    navigate("/select-token");
  }

  const handleSend = () => {
    dispatch(setTransaction({ ...transaction, type: "send" }));
    navigate("/select-token");
  }

  const handleImportToken = async () => {
    return await importToken();
  }

  const handleRefresh = async () => {
    if (!isConnected || isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      // Refresh balances
      await getTokenBalances();
      
      // Refresh prices
      const availableTokens = getAvailableTokens();
      const symbols = availableTokens.map(t => t.symbol).filter(s => s);
      
      if (symbols.length > 0) {
        const prices = await getMultipleTokenPrices(symbols);
        if (Object.keys(prices).length > 0) {
          setTokenPrices(prices);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }

  const handleCopyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
      // Optional: Show toast notification here
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  }

  const availableTokens = getAvailableTokens();
  
  // Show all popular BSC tokens with their balances
  const tokensWithBalances = availableTokens.map(token => {
    return {
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      logo: token.logoURI,
      balance: token.balance
    };
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full p-[20px]">
        

        <div className="flex flex-col items-center justify-center w-full mt-[20px]	">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-4">
              <Wallet className="text-[#FFB948] text-6xl" />
              <h2 className="text-white text-xl font-bold">Connect Your Wallet</h2>
              <p className="text-gray-400 text-center">
                Use the "Connect" button in the top bar to connect your wallet
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-[10px]">
                <p className="font-[900] text-[32px] gradient-text">
                  {isVisible ? (
                    isLoadingBalances ? (
                      <span className="text-gray-500">Loading...</span>
                    ) : (
                      `$${formatNumber(totalBalanceUsd || 0)}`
                    )
                  ) : (
                    "****"
                  )}
                </p>
                <button onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? <Eye className="text-white text-[20px]" /> : <EyeOff className="text-white text-[20px]" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-gray-400 text-sm">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
                </p>
                {address && (
                  <button 
                    onClick={handleCopyAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copy address"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          )}


          <div className="flex items-center justify-center gap-[15px] mt-[20px]">
            <button onClick={handleSend} className="btn p-[8px] rounded-[10px]">
              <ArrowUp className=" text-[20px]" />
            </button>
            <button onClick={handleReceive} className="btn p-[8px] rounded-[10px]">
              <ArrowDown className=" text-[20px]" />
            </button>
            <button onClick={() => navigate("/swap")} className="btn p-[8px] rounded-[10px] rotate-90">
              <ArrowUpDown className=" text-[20px]" />
            </button>
          </div>
        
          {isConnected && (
            <div className="w-full mt-[30px]">
              <div className="flex items-center text-white border-b pb-[10px] justify-between">
                <p className="font-[600] text-[18px]">Tokens</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoadingBalances}
                    className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="text-[#FFB948] text-sm flex items-center gap-1 hover:text-[#FFA500]"
                  >
                    <Plus size={16} />
                    Import
                  </button>
                  {/* <p className="text-gray-400 text-sm">Filters</p> */}
                </div>
              </div>

              {tokensWithBalances.length > 0 ? (
                tokensWithBalances.map((token) => {
                  return (
                    <button
                      key={`${token.symbol}-${token.address}`}
                      onClick={() => navigate(`/token/${token.symbol}/${token.address}`)}
                      className="w-full flex items-center justify-between mt-[20px] rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-[10px]">
                        <TokenLogo
                          symbol={token.symbol}
                          address={token.address}
                          size={40}
                          variant={getTokenVariant(token.symbol, token.name)}
                          className=""
                        />
                        <div className="text-left">
                          <p className="text-white font-[600]">
                            {token.symbol} <span className="text-[#44F58E]">+0.00%</span>
                          </p>
                          <p className="text-[#CDCBC8] text-[14px]">{token.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-[600] text-white">
                            {formatNumber(token.balance || 0)} {token.symbol}
                          </p>
                          <p className="text-[#CDCBC8] text-[14px]">
                            {isLoadingPrices ? (
                              <span className="text-gray-500">Loading...</span>
                            ) : tokenPrices[token.symbol] && tokenPrices[token.symbol] > 0 ? (
                              `$${formatNumber(tokenPrices[token.symbol])}`
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </p>
                        </div>
                        {/* <div className="text-gray-400 ml-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div> */}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-4 mt-8">
                  <div className="text-gray-400 text-center">
                    <p className="text-lg font-medium">Loading tokens...</p>
                    <p className="text-sm">Checking your wallet for BSC tokens</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ImportTokenModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportToken}
      />
    </>
  );
}
