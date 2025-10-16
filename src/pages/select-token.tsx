// import React from 'react'

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../services/store";
import { useDispatch, useSelector } from "react-redux";
import { setTransaction } from "../services/redux/transaction";
import { useReownWallet } from "../services/reownWallet";
import { POPULAR_BSC_TOKENS } from "../services/coinLogos";
import TokenLogo from "../components/TokenLogo";
import { getTokenVariant } from "../utils/tokenUtils";
import { useState, useEffect, useCallback, useMemo } from "react";
import { WalletConnectModal } from "../components/WalletConnectModal";
import { ReownConnectButton } from "../components/ReownConnectButton";

function SelectToken() {
    const navigate = useNavigate();
    const transaction = useSelector((state: RootState) => state.transaction);
    const dispatch = useDispatch();
    
    // Get wallet state including custom tokens
    const { 
        isConnected, 
        address, 
        getAllTokenBalances,
        isTelegramMiniApp,
        getCustomTokens
    } = useReownWallet();
    
    const [balances, setBalances] = useState<Record<string, number>>({});
    const [isLoadingBalances, setIsLoadingBalances] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    
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
    
    // Memoize the loadBalances function to prevent infinite loops
    const loadBalances = useCallback(async () => {
        if (!isConnected || !address) {
            console.log('Wallet not connected, skipping balance fetch');
            setBalances({});
            return;
        }
        
        console.log(`Loading balances for ${allTokens.length} tokens...`);
        setIsLoadingBalances(true);
        try {
            const result = await getAllTokenBalances(allTokens);
            console.log(`Loaded balances for ${Object.keys(result).length} tokens`);
            setBalances(result);
        } catch (error) {
            console.error('Error loading token balances:', error);
            // Don't clear balances on error, keep previous state
            console.warn('Failed to load some token balances, but keeping existing data');
        } finally {
            setIsLoadingBalances(false);
        }
    }, [isConnected, address, allTokens]);

    // Fetch token balances when component mounts
    useEffect(() => {
        loadBalances();
    }, [loadBalances]);
    
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
                  {isTelegramMiniApp 
                    ? "Please connect your BSC wallet to view token balances" 
                    : "Please connect your wallet to view token balances"
                  }
                </p>
          {isTelegramMiniApp && (
            <p className="text-gray-500 text-sm mt-2">
              Welcome to Telegram Mini App! 👋
            </p>
          )}
              </div>
              {isTelegramMiniApp ? (
                <button 
                  onClick={() => setShowWalletModal(true)}
                  className="btn p-[15px] text-[18px] font-[600] rounded-[15px]"
                >
                  Connect BSC Wallet
                </button>
              ) : (
                <ReownConnectButton />
              )}
            </div>
          ) : (
          <div className="flex flex-col items-center justify-center w-full gap-[5px] px-[20px]">
            {allTokens.map((token) => {
              const isCustomToken = false; // Custom tokens not supported in Reown implementation
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
                            {hasBalance ? balance.toFixed(4) : '0.0000'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {hasBalance ? `≈ $${(balance * 1).toFixed(2)}` : '$0.00'}
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
          
          {/* Wallet Connect Modal for Telegram Mini Apps */}
          <WalletConnectModal 
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
          />
      </div>
    )
}

export default SelectToken