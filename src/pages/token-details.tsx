import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, Send, ArrowDown, ArrowUpDown } from "lucide-react";
import { useBackendWallet } from "../hooks/useBackendWallet";
import TokenLogo from "../components/TokenLogo";
import TradingViewChart from "../components/TradingViewChart";
import { getTokenVariant } from "../utils/tokenUtils";
import { useDispatch } from "react-redux";
import { setTransaction } from "../services/redux/transaction";
import { getTokenMarketData, getHistoricalPriceData } from "../services/cryptoPrice";

export default function TokenDetails() {
  const { symbol, address } = useParams<{ symbol: string; address: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [priceData, setPriceData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('24h');
  
  const { getAvailableTokens } = useBackendWallet();

  WebApp.BackButton.show();

  useEffect(() => {
    WebApp.BackButton.onClick(() => navigate(-1));
  }, [navigate]);

  // Fetch real price data
  useEffect(() => {
    const fetchPriceData = async () => {
      if (!symbol) return;
      
      setIsLoadingPrice(true);
      setPriceError(null);
      
      try {
        const data = await getTokenMarketData(symbol);
        if (data) {
          setPriceData({
            price: data.price,
            change: data.change24h,
            changePercent: data.changePercent24h,
            volume24h: data.volume24h,
            marketCap: data.marketCap,
            high24h: data.high24h,
            low24h: data.low24h,
          });
        } else {
          setPriceError('Price data not available');
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
        setPriceError('Failed to load price data');
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchPriceData();
  }, [symbol]);

  // Fetch real chart data
  useEffect(() => {
    const fetchChartData = async () => {
      if (!symbol) return;
      
      setIsLoadingChart(true);
      
      try {
        // Map timeframe to days for API
        const daysMap: Record<string, number> = {
          '1h': 1,
          '24h': 1,
          '7d': 7,
          '30d': 30,
        };
        
        const days = daysMap[timeframe] || 7;
        const data = await getHistoricalPriceData(symbol, days);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    fetchChartData();
  }, [symbol, timeframe]);

  const availableTokens = getAvailableTokens();
  const token = availableTokens.find(t => t.symbol === symbol && t.address === address);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-white text-xl font-bold mb-2">Token Not Found</h2>
          <p className="text-gray-400">The requested token could not be found.</p>
          <button
            onClick={() => navigate('/trade')}
            className="mt-4 px-4 py-2 bg-[#FFB948] text-black rounded-lg font-semibold"
          >
            Back to Trade
          </button>
        </div>
      </div>
    );
  }

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

  const formatCurrency = (num: number): string => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const handleSend = () => {
    if (!token) {
      console.error('Token not found');
      return;
    }
    
    // Set complete transaction state with all token details
    dispatch(setTransaction({
      type: "send",
      token: token.symbol,
      address: token.address,
      network: "bsc",
      icon: token.logoURI || "",
      name: token.name
    }));
    
    console.log('Transaction state set for send:', {
      type: "send",
      token: token.symbol,
      address: token.address,
      network: "bsc",
      icon: token.logoURI || "",
      name: token.name
    });
    
    navigate("/send");
  };

  const handleReceive = () => {
    if (!token) {
      console.error('Token not found');
      return;
    }
    
    // Set complete transaction state with all token details
    dispatch(setTransaction({
      type: "receive",
      token: token.symbol,
      address: token.address,
      network: "bsc",
      icon: token.logoURI || "",
      name: token.name
    }));
    
    console.log('Transaction state set for receive:', {
      type: "receive",
      token: token.symbol,
      address: token.address,
      network: "bsc",
      icon: token.logoURI || "",
      name: token.name
    });
    
    navigate("/receive");
  };

  const handleSwap = () => {
    if (!token) {
      console.error('Token not found');
      return;
    }
    
    // Set complete transaction state with all token details
    dispatch(setTransaction({
      type: "swap",
      token: token.symbol,
      address: token.address,
      network: "bsc",
      icon: token.logoURI || "",
      name: token.name
    }));
    
    console.log('Transaction state set for swap:', {
      type: "swap",
      token: token.symbol,
      address: token.address,
      network: "bsc",
      icon: token.logoURI || "",
      name: token.name
    });
    
    navigate("/swap");
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-[#FFB948] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-white font-bold text-lg">Token Details</h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      {/* Token Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <TokenLogo
            symbol={token.symbol}
            address={token.address}
            size={50}
            variant={getTokenVariant(token.symbol, token.name)}
          />
          <div>
            <h2 className="text-white font-bold text-xl">{token.symbol}</h2>
            <p className="text-gray-400">{token.name}</p>
          </div>
        </div>

        {isLoadingPrice ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#FFB948] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400">Loading price...</span>
          </div>
        ) : priceError ? (
          <div className="text-red-400 text-sm">{priceError}</div>
        ) : priceData ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white text-2xl font-bold">
                ${formatNumber(priceData.price)}
              </span>
              <div className={`flex items-center gap-1 ${
                priceData.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceData.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {priceData.changePercent >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Chart Section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Price Chart</h3>
          <div className="flex gap-2">
            {['1h', '24h', '7d', '30d'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-[#FFB948] text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        {/* TradingView Chart */}
        {isLoadingChart ? (
          <div className="h-[300px] flex items-center justify-center bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#FFB948] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white">Loading chart data...</span>
            </div>
          </div>
        ) : chartData.length > 0 && token ? (
          <TradingViewChart
            data={chartData}
            symbol={token.symbol}
            timeframe={timeframe}
            height={300}
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center bg-gray-900 rounded-lg">
            <span className="text-gray-400">Chart data not available</span>
          </div>
        )}
      </div>

      {/* Price Statistics */}
      {priceData && (
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-white font-semibold mb-4">Price Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">24h High</p>
              <p className="text-white font-semibold">${formatNumber(priceData.high24h)}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">24h Low</p>
              <p className="text-white font-semibold">${formatNumber(priceData.low24h)}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">24h Volume</p>
              <p className="text-white font-semibold">{formatCurrency(priceData.volume24h)}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Market Cap</p>
              <p className="text-white font-semibold">{formatCurrency(priceData.marketCap)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Token Information */}
      <div className="p-4">
        <h3 className="text-white font-semibold mb-4">Token Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Symbol</span>
            <span className="text-white font-medium">{token.symbol}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Name</span>
            <span className="text-white font-medium">{token.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Contract Address</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">
                {token.address.slice(0, 6)}...{token.address.slice(-4)}
              </span>
              <button className="text-[#FFB948] hover:text-[#FFA500]">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Your Balance</span>
            <span className="text-white font-medium">
              {formatNumber(token.balance || 0)} {token.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Network</span>
            <span className="text-white font-medium">BSC (Binance Smart Chain)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleSend}
            className="flex flex-col items-center gap-2 bg-[#FFB948] text-black font-semibold py-4 px-3 rounded-lg hover:bg-[#FFA500] transition-colors"
          >
            <Send className="w-5 h-5" />
            <span className="text-sm">Send</span>
          </button>
          <button
            onClick={handleReceive}
            className="flex flex-col items-center gap-2 bg-gray-700 text-white font-semibold py-4 px-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ArrowDown className="w-5 h-5" />
            <span className="text-sm">Receive</span>
          </button>
          <button
            onClick={handleSwap}
            className="flex flex-col items-center gap-2 bg-gray-700 text-white font-semibold py-4 px-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ArrowUpDown className="w-5 h-5" />
            <span className="text-sm">Swap</span>
          </button>
        </div>
      </div>
    </div>
  );
}
