// import React from 'react'

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../services/store";
import { useDispatch, useSelector } from "react-redux";
import { setTransaction } from "../services/redux/transaction";
import { useBackendWallet } from "../hooks/useBackendWallet";
import { POPULAR_BSC_TOKENS } from "../services/coinLogos";
import TokenLogo from "../components/TokenLogo";
import { getTokenVariant } from "../utils/tokenUtils";
import { useState, useEffect, useMemo } from "react";
import { getMultipleTokenPrices } from "../services/cryptoPrice";

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

function SelectToken() {
    const navigate = useNavigate();
    const transaction = useSelector((state: RootState) => state.transaction);
    const dispatch = useDispatch();
    
    // Get wallet state including custom tokens
    const { 
        isConnected, 
        address,
        balances: walletBalances,
        isLoadingBalances,
        getCustomTokens,
        getTokenBalances
    } = useBackendWallet();
    
    const [balances, setBalances] = useState<Record<string, number>>({});
    const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
    const [isLoadingPrices, setIsLoadingPrices] = useState(true);

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
    
    // Memoize token list to prevent infinite loops
    const allTokens = useMemo(() => {
        const TOKENS = Object.values(POPULAR_BSC_TOKENS).map(token => ({
            symbol: token.symbol,
            name: token.name,
            logo: token.logo,
            address: token.address,
            decimals: 18
        }));
        const customTokens = getCustomTokens();
        return [...TOKENS, ...customTokens];
    }, [getCustomTokens]);
    
    // Use wallet balances directly when available and merge with any new balances
    useEffect(() => {
        if (Object.keys(walletBalances).length > 0) {
            // Merge with existing balances to preserve any custom token balances
            setBalances(prevBalances => ({
                ...prevBalances,
                ...walletBalances
            }));
        }
    }, [walletBalances]);

    // Fetch real token prices
    useEffect(() => {
        if (!isConnected) {
            setIsLoadingPrices(false);
            return;
        }

        let isMounted = true;
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
                const symbols = allTokens.map(t => t.symbol).filter(s => s);
                
                if (symbols.length === 0) {
                    if (isMounted) setIsLoadingPrices(false);
                    if (priceTimeoutId) clearTimeout(priceTimeoutId);
                    return;
                }

                const prices = await getMultipleTokenPrices(symbols);
                
                if (priceTimeoutId) clearTimeout(priceTimeoutId);
                
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
        
        return () => {
            isMounted = false;
            clearTimeout(initialTimeout);
            if (priceTimeoutId) {
                clearTimeout(priceTimeoutId);
            }
        };
    }, [isConnected]); // Only depend on isConnected, not allTokens
    
    const handleSelectToken = (token: any) => {
        dispatch(setTransaction({ 
            ...transaction, 
            token: token.symbol, 
            address: token.address, 
            icon: token.logo,
            name: token.name
        }));
        navigate(`${transaction.type === "send" ? "/send" : "/receive"}`);
    }
    return (
      <div className="h-full  flex-col items-center justify-center w-full py-[20px]">
          <div className="flex items-center justify-between border-b border-gray-500 px-[20px] pb-[20px]">
              <button onClick={()=> navigate(-1)} className="p-[5px] rounded-full z-20 border border-[#44F58E] bg-black">
                  <ChevronLeft color="#44F58E"/>
              </button>
              <p className="flex-1 text-center text-[25px] font-[600] gradient-text ml-[-30px]">Select Token</p>
          </div>

          {!isConnected ? (
            <div className="flex flex-col items-center justify-center w-full px-[20px] mt-[40px] gap-[20px]">
              <div className="text-center">
                <h2 className="text-white text-xl font-bold mb-2">Wallet Not Connected</h2>
                <p className="text-gray-400">
                  Please connect your wallet to view token balances
                </p>
              </div>
              <button 
                onClick={() => {/* Connect wallet logic will be handled by backend */}}
                className="btn p-[15px] text-[18px] font-[600] rounded-[15px]"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
          <div className="flex flex-col items-center justify-center w-full gap-[5px] px-[20px]">
            {allTokens.map((token) => {
              const customTokens = getCustomTokens();
              const isCustomToken = customTokens.some((ct: any) => ct.address === token.address);
              const balance = balances[token.symbol] || 0;
              const hasBalance = balance > 0;
              
              return (
                <div 
                  key={`${token.symbol}-${token.address}`} 
                  onClick={() => handleSelectToken(token)} 
                  className="flex items-center justify-between w-full border-b border-gray-500 p-[15px] cursor-pointer hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center gap-[15px]">
                    <TokenLogo
                      symbol={token.symbol}
                      address={token.address}
                      size={40}
                      variant={getTokenVariant(token.symbol, token.name)}
                      className=" border-gray-300"
                    />
                    <div>
                      <p className="text-white font-[600] text-lg">{token.symbol}</p>
                      <p className="text-gray-400 text-sm">{token.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-[10px]">
                    <div className="text-right">
                      {isLoadingBalances ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-gray-400 text-sm">Loading...</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-white font-[600]">
                            {hasBalance ? formatNumber(balance) : '0.00'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {isLoadingPrices ? (
                              <span className="text-gray-500">Loading...</span>
                            ) : tokenPrices[token.symbol] && tokenPrices[token.symbol] > 0 ? (
                              hasBalance 
                                ? `≈ $${formatNumber(balance * tokenPrices[token.symbol])}`
                                : `$${formatNumber(tokenPrices[token.symbol])}`
                            ) : (
                              '$0.00'
                            )}
                          </p>
                        </>
                      )}
                    </div>
                    
                    {isCustomToken && (
                      <div className="text-xs text-[#44F58E] bg-[#44F58E]/10 px-2 py-1 rounded">
                        Imported
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          )}
      </div>
    )
}

export default SelectToken