import { useState, useEffect } from 'react';
import { ChevronLeft, ArrowUpDown, Settings, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReownWallet } from "../services/reownWallet";
import { POPULAR_BSC_TOKENS } from "../services/coinLogos";
import TokenIcon from "../components/TokenIcon";

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

interface Token {
  symbol: string;
  name: string;
  logo: string;
  address: string;
  decimals: number;
}

function Swap() {
  const navigate = useNavigate();
  const { isConnected, getAllTokenBalances, getCustomTokens } = useReownWallet();
  
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [showSlippage, setShowSlippage] = useState(false);

  // Initialize with BNB and USDT
  useEffect(() => {
    const bnbToken = Object.values(POPULAR_BSC_TOKENS).find(token => token.symbol === 'BNB');
    const usdtToken = Object.values(POPULAR_BSC_TOKENS).find(token => token.symbol === 'USDT');
    
    if (bnbToken && usdtToken) {
      setFromToken({ ...bnbToken, decimals: 18 });
      setToToken({ ...usdtToken, decimals: 18 });
    }
  }, []);

  // Load token balances
  useEffect(() => {
    const loadBalances = async () => {
      if (!isConnected) return;
      
      const allTokens = [
        ...Object.values(POPULAR_BSC_TOKENS),
        ...getCustomTokens()
      ];
      
      const balances = await getAllTokenBalances(allTokens);
      setTokenBalances(balances);
    };

    loadBalances();
  }, [isConnected, getAllTokenBalances, getCustomTokens]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simple 1:1 conversion for demo - in real app, you'd call a price API
    if (value && fromToken && toToken) {
      setToAmount(value);
    } else {
      setToAmount('');
    }
  };

  const handleMaxClick = () => {
    if (fromToken && tokenBalances[fromToken.symbol]) {
      setFromAmount(tokenBalances[fromToken.symbol].toString());
    }
  };

  const getTokenBalance = (token: Token | null) => {
    if (!token) return 0;
    return tokenBalances[token.symbol] || 0;
  };

  const canSwap = () => {
    return isConnected && fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0;
  };

  const handleSwap = async () => {
    if (!canSwap()) return;
    
    setIsLoading(true);
    try {
      // Simulate swap transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Swap executed:', { fromToken, toToken, fromAmount, toAmount });
      // Reset amounts after successful swap
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-[20px] flex-col items-center justify-center w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-[5px] rounded-full z-20 border border-[#44F58E] bg-black hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft color="#44F58E" size={20} />
        </button>
        <p className="flex-1 text-center text-[25px] font-[600] gradient-text ml-[-30px]">
          Swap
        </p>
        <button 
          onClick={() => setShowSlippage(!showSlippage)}
          className="p-[5px] rounded-full border border-[#44F58E] bg-black hover:bg-gray-800 transition-colors"
        >
          <Settings color="#44F58E" size={20} />
        </button>
      </div>

      {/* Slippage Settings */}
      {showSlippage && (
        <div className="bg-gray-900 border border-[#44F58E] rounded-lg p-4 mb-4">
          <h3 className="text-white font-medium mb-3">Slippage Tolerance</h3>
          <div className="flex gap-2">
            {[0.1, 0.5, 1.0, 2.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-3 py-1 rounded text-sm ${
                  slippage === value 
                    ? 'bg-[#44F58E] text-black' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Swap Interface */}
      <div className="bg-gray-900 border border-[#44F58E] rounded-xl p-4 mb-4">
        {/* From Token */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">From</label>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {fromToken && <TokenIcon symbol={fromToken.symbol} size={24} />}
                <span className="text-white font-medium">
                  {fromToken?.symbol || 'Select Token'}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                Balance: {formatNumber(getTokenBalance(fromToken))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-white text-xl font-medium outline-none"
              />
              <button
                onClick={handleMaxClick}
                className="bg-[#44F58E] text-black px-2 py-1 rounded text-xs font-medium hover:bg-[#3DE077] transition-colors"
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwapTokens}
            className="p-2 rounded-full bg-gray-800 border border-[#44F58E] hover:bg-gray-700 transition-colors"
          >
            <ArrowUpDown color="#44F58E" size={20} />
          </button>
        </div>

        {/* To Token */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">To</label>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {toToken && <TokenIcon symbol={toToken.symbol} size={24} />}
                <span className="text-white font-medium">
                  {toToken?.symbol || 'Select Token'}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                Balance: {formatNumber(getTokenBalance(toToken))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-white text-xl font-medium outline-none"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Price Info */}
        {fromAmount && toAmount && (
          <div className="text-center text-gray-400 text-sm mb-4">
            1 {fromToken?.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken?.symbol}
          </div>
        )}
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!canSwap() || isLoading}
        className={`w-full py-3 rounded-lg font-medium text-lg transition-colors ${
          canSwap() && !isLoading
            ? 'bg-[#44F58E] text-black hover:bg-[#3DE077]'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? 'Swapping...' : !isConnected ? 'Connect Wallet' : 'Swap'}
      </button>

      {/* Warning */}
      {!isConnected && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <AlertCircle color="#F59E0B" size={16} />
          <span className="text-yellow-400 text-sm">
            Please connect your wallet to start swapping
          </span>
        </div>
      )}
    </div>
  );
}

export default Swap