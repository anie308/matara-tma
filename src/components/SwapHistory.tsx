import { useEffect } from 'react';
import { useGetUserSwapHistoryQuery } from '../services/routes';
import { SwapHistoryItem } from '../services/swap';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface SwapHistoryProps {
  username: string;
}

const formatNumber = (num: number | string): string => {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) return '0.00';
  if (numValue === 0) return "0.00";
  if (numValue < 0.01) return numValue.toFixed(6);
  if (numValue < 1) return numValue.toFixed(4);
  if (numValue < 1000) return numValue.toFixed(2);
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-400';
    case 'failed':
      return 'text-red-400';
    case 'processing':
      return 'text-blue-400';
    case 'pending':
      return 'text-yellow-400';
    default:
      return 'text-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="text-green-400" size={16} />;
    case 'failed':
      return <XCircle className="text-red-400" size={16} />;
    case 'processing':
    case 'pending':
      return <Clock className="text-blue-400" size={16} />;
    default:
      return null;
  }
};

export default function SwapHistory({ username }: SwapHistoryProps) {
  const { data, isLoading, error, refetch } = useGetUserSwapHistoryQuery(
    { username },
    { skip: !username }
  );

  useEffect(() => {
    // Refetch history periodically
    const interval = setInterval(() => {
      if (username) {
        refetch();
      }
    }, 10000); // Refetch every 10 seconds

    return () => clearInterval(interval);
  }, [username, refetch]);

  if (!username) {
    return (
      <div className="text-center text-gray-400 py-8">
        Please log in to view swap history
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 py-8">
        Loading swap history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        Error loading swap history. Please try again.
      </div>
    );
  }

  const history: SwapHistoryItem[] = data?.data || [];

  if (history.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No swap history found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((swap) => (
        <div
          key={swap._id}
          className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-[#44F58E]/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(swap.status)}
              <span className={`font-medium ${getStatusColor(swap.status)}`}>
                {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
              </span>
            </div>
            <span className="text-gray-400 text-xs">
              {new Date(swap.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">
                {formatNumber(swap.amountIn)} {swap.tokenInSymbol || 'Unknown'}
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-white font-medium">
                {swap.amountOut ? `${formatNumber(swap.amountOut)} ${swap.tokenOutSymbol || 'Unknown'}` : 'N/A'}
              </span>
            </div>
          </div>

          {swap.errorMessage && (
            <div className="text-red-400 text-xs mt-2">
              Error: {swap.errorMessage}
            </div>
          )}

          {swap.transactionHash && (
            <div className="flex items-center gap-2 mt-2">
              <a
                href={`https://bscscan.com/tx/${swap.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#44F58E] text-xs hover:text-[#3DE077] flex items-center gap-1"
              >
                View on BSCScan
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

