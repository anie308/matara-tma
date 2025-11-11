import { useState, useEffect } from 'react';
import { ChevronLeft, ArrowUpDown, Settings, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useBackendWallet } from "../hooks/useBackendWallet";
import { POPULAR_BSC_TOKENS } from "../services/coinLogos";
import TokenIcon from "../components/TokenIcon";
import TokenSelectModal from "../components/modal/TokenSelectModal";
import { RootState } from "../services/store";
import { toast } from "react-hot-toast";
import { 
  executeSwap, 
  getTokenAddress, 
  calculateDeadline,
  SwapRequest 
} from "../services/swap";

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
  const { isConnected, balances, isLoadingBalances, getTokenBalances } = useBackendWallet();
  const profile = useSelector((state: RootState) => state.user.profile);
  const username = profile?.username;
  
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [showSlippage, setShowSlippage] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'from' | 'to'>('from');
  const [swapError, setSwapError] = useState<string | null>(null);
  const [lastSwapResult, setLastSwapResult] = useState<any>(null);

  // Initialize with tBNB and USDT (testnet tokens)
  useEffect(() => {
    const bnbToken = Object.values(POPULAR_BSC_TOKENS).find(token => token.symbol === 'BNB');
    const usdtToken = Object.values(POPULAR_BSC_TOKENS).find(token => token.symbol === 'USDT');
    
    if (bnbToken && usdtToken) {
      setFromToken({ ...bnbToken, decimals: 18 });
      setToToken({ ...usdtToken, decimals: 18 });
    }
  }, []);

  // Fetch balances when wallet is connected or tokens change
  useEffect(() => {
    if (isConnected && getTokenBalances) {
      getTokenBalances();
    }
  }, [isConnected, fromToken?.symbol, toToken?.symbol]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    // Clear any previous errors or success messages
    setSwapError(null);
    setLastSwapResult(null);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setSwapError(null);
    // For now, we'll let the backend calculate the output amount
    // In a real implementation, you'd call a price quote API here
    if (value && fromToken && toToken) {
      // Simple estimation - backend will provide actual amountOut
      setToAmount(value);
    } else {
      setToAmount('');
    }
  };

  const handleMaxClick = () => {
    if (fromToken) {
      const balance = getTokenBalance(fromToken);
      if (balance > 0) {
        // Use 99.9% of balance to account for gas fees
        const maxAmount = balance * 0.999;
        setFromAmount(maxAmount.toString());
      } else {
        toast.error(`No ${fromToken.symbol} balance available`);
      }
    }
  };

  const getTokenBalance = (token: Token | null) => {
    if (!token) return 0;
    return balances[token.symbol] || 0;
  };

  const hasInsufficientBalance = () => {
    if (!fromToken || !fromAmount) return false;
    const balance = getTokenBalance(fromToken);
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) return false;
    return amount > balance;
  };

  const getBalancePercentage = () => {
    if (!fromToken || !fromAmount) return 0;
    const balance = getTokenBalance(fromToken);
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0 || balance === 0) return 0;
    return Math.min((amount / balance) * 100, 100);
  };

  const getRemainingBalance = () => {
    if (!fromToken || !fromAmount) return getTokenBalance(fromToken);
    const balance = getTokenBalance(fromToken);
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) return balance;
    return Math.max(0, balance - amount);
  };

  const canSwap = () => {
    if (!isConnected || !fromToken || !toToken || !fromAmount) return false;
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) return false;
    if (hasInsufficientBalance()) return false;
    return true;
  };

  const handleSwap = async () => {
    if (!canSwap() || !username) {
      if (!username) {
        toast.error('Username not found. Please ensure you are logged in.');
      }
      return;
    }

    // Final balance validation before swap
    if (hasInsufficientBalance()) {
      toast.error(`Insufficient balance. You have ${formatNumber(getTokenBalance(fromToken!))} ${fromToken!.symbol}`);
      return;
    }

    // Warn if using more than 95% of balance (might not have enough for gas)
    const balancePercentage = getBalancePercentage();
    if (balancePercentage > 95) {
      const confirmed = window.confirm(
        `You are using ${balancePercentage.toFixed(1)}% of your ${fromToken!.symbol} balance. ` +
        `This might not leave enough for gas fees. Do you want to continue?`
      );
      if (!confirmed) {
        return;
      }
    }
    
    setIsLoading(true);
    setSwapError(null);
    setLastSwapResult(null);
    
    try {
      // Get token addresses, converting BNB to WBNB if needed
      const tokenInAddress = getTokenAddress(fromToken!.address);
      const tokenOutAddress = getTokenAddress(toToken!.address);
      
      // Calculate deadline (5 minutes from now)
      const deadline = calculateDeadline(5);
      
      // Prepare swap request
      const swapRequest: SwapRequest = {
        username: username,
        tokenIn: tokenInAddress,
        tokenOut: tokenOutAddress,
        tokenInSymbol: fromToken!.symbol,
        tokenOutSymbol: toToken!.symbol,
        amountIn: fromAmount, // Send as string, backend will handle conversion to wei
        slippageTolerance: slippage,
        deadline: deadline,
      };
      
      // Execute swap
      const result = await executeSwap(swapRequest);
      setLastSwapResult(result);
      
      // Check swap status
      if (result.data.status === 'completed' && result.data.transactionHash) {
        toast.success(
          `Swap successful! Transaction: ${result.data.transactionHash.slice(0, 10)}...`,
          { duration: 5000 }
        );
        
        // Reset amounts after successful swap
        setFromAmount('');
        setToAmount('');
        
        // Refresh balances
        if (getTokenBalances) {
          await getTokenBalances();
        }
      } else if (result.data.status === 'failed') {
        const errorMsg = result.data.errorMessage || 'Swap execution failed';
        setSwapError(errorMsg);
        toast.error(`Swap failed: ${errorMsg}`, { duration: 5000 });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSwapError(errorMessage);
      toast.error(`Swap failed: ${errorMessage}`, { duration: 5000 });
      console.error('Swap failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSelect = (tokenSymbol: string) => {
    const token = Object.values(POPULAR_BSC_TOKENS).find(t => t.symbol === tokenSymbol);
    if (token) {
      const tokenData = { ...token, decimals: 18 };
      if (selectingFor === 'from') {
        setFromToken(tokenData);
        // Clear amount when changing token
        setFromAmount('');
        setToAmount('');
      } else {
        setToToken(tokenData);
        // Clear output amount when changing output token
        setToAmount('');
      }
      // Clear any previous errors or success messages
      setSwapError(null);
      setLastSwapResult(null);
      
      // Refresh balances when token changes
      if (isConnected && getTokenBalances) {
        getTokenBalances();
      }
    }
    setShowTokenModal(false);
  };

  const openTokenModal = (type: 'from' | 'to') => {
    setSelectingFor(type);
    setShowTokenModal(true);
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
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-400 text-sm block">From</label>
            <div className="flex items-center gap-2">
              {isLoadingBalances ? (
                <span className="text-gray-500 text-xs">Loading balance...</span>
              ) : fromToken ? (
                <>
                  <span className="text-gray-400 text-xs">
                    Available: <span className="text-white font-medium">{formatNumber(getTokenBalance(fromToken))} {fromToken.symbol}</span>
                  </span>
                  {fromAmount && parseFloat(fromAmount) > 0 && (
                    <span className="text-gray-500 text-xs">
                      ({getBalancePercentage().toFixed(1)}%)
                    </span>
                  )}
                </>
              ) : null}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => openTokenModal('from')}
                className="flex items-center gap-2 hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                {fromToken && <TokenIcon symbol={fromToken.symbol} size={24} />}
                <span className="text-white font-medium">
                  {fromToken?.symbol || 'Select Token'}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                step="any"
                min="0"
                className="flex-1 bg-transparent text-white text-xl font-medium outline-none"
              />
              <button
                onClick={handleMaxClick}
                disabled={!fromToken || getTokenBalance(fromToken) === 0}
                className="bg-[#44F58E] text-black px-2 py-1 rounded text-xs font-medium hover:bg-[#3DE077] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                MAX
              </button>
            </div>
            {/* Balance indicator bar */}
            {fromAmount && parseFloat(fromAmount) > 0 && fromToken && (
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      getBalancePercentage() > 100
                        ? 'bg-red-500'
                        : getBalancePercentage() > 80
                        ? 'bg-yellow-500'
                        : 'bg-[#44F58E]'
                    }`}
                    style={{ width: `${Math.min(getBalancePercentage(), 100)}%` }}
                  />
                </div>
                {fromAmount && parseFloat(fromAmount) > 0 && (
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-gray-500">
                      Remaining: {formatNumber(getRemainingBalance())} {fromToken.symbol}
                    </span>
                    {hasInsufficientBalance() && (
                      <span className="text-red-400">Insufficient</span>
                    )}
                  </div>
                )}
              </div>
            )}
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
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-400 text-sm block">To</label>
            {isLoadingBalances ? (
              <span className="text-gray-500 text-xs">Loading balance...</span>
            ) : toToken ? (
              <span className="text-gray-400 text-xs">
                Balance: <span className="text-white font-medium">{formatNumber(getTokenBalance(toToken))} {toToken.symbol}</span>
              </span>
            ) : null}
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => openTokenModal('to')}
                className="flex items-center gap-2 hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                {toToken && <TokenIcon symbol={toToken.symbol} size={24} />}
                <span className="text-white font-medium">
                  {toToken?.symbol || 'Select Token'}
                </span>
              </button>
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
            {/* Show estimated balance after swap */}
            {toAmount && parseFloat(toAmount) > 0 && toToken && (
              <div className="mt-2 text-xs text-gray-500">
                You will receive ~{formatNumber(parseFloat(toAmount))} {toToken.symbol}
              </div>
            )}
          </div>
        </div>

        {/* Price Info */}
        {fromAmount && toAmount && (
          <div className="text-center text-gray-400 text-sm mb-4">
            1 {fromToken?.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken?.symbol}
          </div>
        )}

        {/* Insufficient Balance Error */}
        {hasInsufficientBalance() && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
            <AlertCircle color="#EF4444" size={16} />
            <span className="text-red-400 text-sm">
              Insufficient {fromToken?.symbol} balance. You have {formatNumber(getTokenBalance(fromToken))} {fromToken?.symbol}
            </span>
          </div>
        )}

        {/* Swap Error */}
        {swapError && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
            <XCircle color="#EF4444" size={16} />
            <span className="text-red-400 text-sm">{swapError}</span>
          </div>
        )}

        {/* Swap Success */}
        {lastSwapResult?.data?.status === 'completed' && lastSwapResult?.data?.transactionHash && (
          <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg mb-4">
            <CheckCircle color="#10B981" size={16} />
            <div className="flex-1">
              <span className="text-green-400 text-sm block">
                Swap completed successfully!
              </span>
              <button
                onClick={() => {
                  const url = `https://bscscan.com/tx/${lastSwapResult.data.transactionHash}`;
                  window.open(url, '_blank');
                }}
                className="text-green-300 text-xs underline mt-1 hover:text-green-200"
              >
                View on BSCScan
              </button>
            </div>
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
        {isLoading 
          ? 'Swapping...' 
          : !isConnected 
            ? 'Connect Wallet' 
            : hasInsufficientBalance()
              ? 'Insufficient Balance'
              : 'Swap'
        }
      </button>

      {/* Warning */}
      {!isConnected && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <AlertCircle color="#F59E0B" size={16} />
          <span className="text-yellow-400 text-sm">
            {!profile?.walletAddress 
              ? 'Please ensure your wallet is set up in your profile to start swapping'
              : 'Please connect your wallet to start swapping'
            }
          </span>
        </div>
      )}

      {/* Token Selection Modal */}
      <TokenSelectModal 
        isOpen={showTokenModal}
        setIsOpen={setShowTokenModal}
        onSelectToken={handleTokenSelect}
      />
    </div>
  );
}

export default Swap