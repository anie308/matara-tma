import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, ArrowUp, ArrowDown, RefreshCw, Loader2 } from 'lucide-react';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { getAllTransactions, Transaction, getTransactionExplorerUrl } from '../services/transactions';
import TokenIcon from '../components/TokenIcon';

// Utility function to format numbers
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

// Format timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp) * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

// Format value
const formatValue = (value: string, decimals: number = 18): number => {
  return parseFloat(value) / Math.pow(10, decimals);
};

export default function Transactions() {
  const navigate = useNavigate();
  const { isConnected, address } = useBackendWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const txs = await getAllTransactions(address, 100);
      setTransactions(txs);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchTransactions();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchTransactions();
  };

  const handleViewOnExplorer = (txHash: string) => {
    const url = getTransactionExplorerUrl(txHash);
    window.open(url, '_blank');
  };

  if (!isConnected) {
    return (
      <div className="h-full p-[20px] flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center gap-4">
          <p className="text-white text-xl font-bold">Connect Your Wallet</p>
          <p className="text-gray-400 text-center">
            Please connect your wallet to view transactions
          </p>
          <button
            onClick={() => navigate('/trade')}
            className="bg-[#44F58E] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#3DE077] transition-colors"
          >
            Go to Trade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-[20px] flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-[5px] rounded-full z-20 border border-[#44F58E] bg-black hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft color="#44F58E" size={20} />
        </button>
        <p className="flex-1 text-center text-[25px] font-[600] gradient-text ml-[-30px]">
          Transactions
        </p>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-[5px] rounded-full border border-[#44F58E] bg-black hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw 
            color="#44F58E" 
            size={20} 
            className={isRefreshing ? 'animate-spin' : ''} 
          />
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <Loader2 className="text-[#44F58E] animate-spin" size={40} />
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p className="text-red-400 text-center">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-[#44F58E] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#3DE077] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p className="text-gray-400 text-center">No transactions found</p>
          <p className="text-gray-500 text-sm text-center">
            Your transaction history will appear here
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.map((tx) => {
            const isSent = tx.type === 'sent';
            const value = formatValue(tx.value, tx.tokenDecimal || 18);
            const symbol = tx.tokenSymbol || 'BNB';
            
            return (
              <div
                key={tx.hash}
                className="bg-gray-900 border border-[#44F58E] rounded-lg p-4 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      isSent ? 'bg-red-500/20' : 'bg-green-500/20'
                    }`}>
                      {isSent ? (
                        <ArrowUp className="text-red-400" size={20} />
                      ) : (
                        <ArrowDown className="text-green-400" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TokenIcon symbol={symbol} size={20} />
                        <p className="text-white font-medium">
                          {isSent ? 'Sent' : 'Received'} {symbol}
                        </p>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {formatTimestamp(tx.timeStamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      isSent ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {isSent ? '-' : '+'}{formatNumber(value)} {symbol}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Block #{tx.blockNumber}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-xs">
                      {isSent ? 'To' : 'From'}: {isSent ? tx.to.slice(0, 6) : tx.from.slice(0, 6)}...{isSent ? tx.to.slice(-4) : tx.from.slice(-4)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewOnExplorer(tx.hash)}
                    className="flex items-center gap-1 text-[#44F58E] hover:text-[#3DE077] text-xs transition-colors"
                  >
                    <ExternalLink size={14} />
                    View on BSCScan
                  </button>
                </div>
                
                {tx.isError === '1' && (
                  <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs">
                    Transaction failed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

