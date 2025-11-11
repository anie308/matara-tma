import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, ArrowUp, ArrowDown, RefreshCw, Loader2, Filter, ArrowUpDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { 
  getUserTransactions, 
  getUserTransactionStats,
  getExplorerUrl,
  Transaction,
  TransactionStats
} from '../services/transactionService';
import { RootState } from '../services/store';
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
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
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

// Get transaction type label
const getTransactionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    swap: 'Swap',
    transfer: 'Transfer',
    approval: 'Approval',
    other: 'Other',
  };
  return labels[type] || type;
};

// Get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'text-green-400';
    case 'pending':
      return 'text-yellow-400';
    case 'failed':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export default function Transactions() {
  const navigate = useNavigate();
  const { isConnected } = useBackendWallet();
  const profile = useSelector((state: RootState) => state.user.profile);
  const username = profile?.username;
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchTransactions = async (page: number = 1) => {
    if (!username) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const params: any = {
        username,
        page,
        limit: 20, // Use fixed limit
      };

      if (filterType !== 'all') {
        params.type = filterType;
      }

      const response = await getUserTransactions(params);
      console.log(response, "response transactions");
      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchStats = async () => {
    if (!username) return;

    try {
      const statsData = await getUserTransactionStats(username);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    if (isConnected && username) {
      fetchTransactions(1);
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, username, filterType]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchTransactions(pagination.page);
    await fetchStats();
  };

  const handleViewOnExplorer = (chain: string, txHash: string) => {
    const url = getExplorerUrl(chain, txHash);
    window.open(url, '_blank');
  };

  const handlePageChange = (newPage: number) => {
    fetchTransactions(newPage);
  };

  if (!isConnected || !username) {
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

      {/* Statistics */}
      {stats && (
        <div className="bg-gray-900 border border-[#44F58E] rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total</p>
              <p className="text-white font-semibold">{stats.totalTransactions}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Deposits</p>
              <p className="text-green-400 font-semibold">{stats.byType.deposits}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Swaps</p>
              <p className="text-blue-400 font-semibold">{stats.byType.swaps}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-gray-400" size={16} />
        <div className="flex gap-2 flex-1 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#44F58E] text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('deposit')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              filterType === 'deposit'
                ? 'bg-[#44F58E] text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setFilterType('swap')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              filterType === 'swap'
                ? 'bg-[#44F58E] text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Swaps
          </button>
          <button
            onClick={() => setFilterType('withdrawal')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              filterType === 'withdrawal'
                ? 'bg-[#44F58E] text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Withdrawals
          </button>
        </div>
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
        <>
          <div className="flex flex-col gap-3 mb-4">
            {transactions.map((tx) => {
              const isDeposit = tx.type === 'deposit';
              const isSwap = tx.type === 'swap';
              const isWithdrawal = tx.type === 'withdrawal';
              
              // Get amount and symbol based on transaction type
              let amount = '';
              let symbol = '';
              
              if (isSwap) {
                amount = tx.amountOut || tx.amountIn || '0';
                symbol = tx.tokenOutSymbol || tx.tokenInSymbol || '';
              } else {
                amount = tx.amountFormatted || tx.amount || '0';
                symbol = tx.tokenSymbol || 'BNB';
              }
              
              return (
                <div
                  key={tx._id}
                  className="bg-gray-900 border border-[#44F58E] rounded-lg p-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        isDeposit ? 'bg-green-500/20' : 
                        isWithdrawal ? 'bg-red-500/20' : 
                        'bg-blue-500/20'
                      }`}>
                        {isDeposit ? (
                          <ArrowDown className="text-green-400" size={20} />
                        ) : isWithdrawal ? (
                          <ArrowUp className="text-red-400" size={20} />
                        ) : (
                          <ArrowUpDown className="text-blue-400" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {symbol && <TokenIcon symbol={symbol} size={20} />}
                          <p className="text-white font-medium">
                            {getTransactionTypeLabel(tx.type)}
                            {isSwap && tx.tokenInSymbol && tx.tokenOutSymbol && (
                              <span className="text-gray-400 text-sm ml-1">
                                ({tx.tokenInSymbol} → {tx.tokenOutSymbol})
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-400 text-sm">
                            {formatTimestamp(tx.createdAt)}
                          </p>
                          <span className={`text-xs ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        isDeposit ? 'text-green-400' : 
                        isWithdrawal ? 'text-red-400' : 
                        'text-blue-400'
                      }`}>
                        {isDeposit ? '+' : isWithdrawal ? '-' : ''}
                        {formatNumber(parseFloat(amount))} {symbol}
                      </p>
                      {tx.blockNumber && (
                        <p className="text-gray-500 text-xs">
                          Block #{tx.blockNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      {tx.from && tx.to && (
                        <p className="text-gray-400 text-xs">
                          {isDeposit ? 'From' : 'To'}: {(isDeposit ? tx.from : tx.to).slice(0, 6)}...{(isDeposit ? tx.from : tx.to).slice(-4)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewOnExplorer(tx.chain, tx.transactionHash)}
                      className="flex items-center gap-1 text-[#44F58E] hover:text-[#3DE077] text-xs transition-colors"
                    >
                      <ExternalLink size={14} />
                      View on Explorer
                    </button>
                  </div>
                  
                  {tx.status === 'failed' && (
                    <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs">
                      Transaction failed
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-400 text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

