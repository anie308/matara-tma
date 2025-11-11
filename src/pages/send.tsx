import { ChevronLeft, ArrowUp, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../services/store'
import { clearTransaction } from '../services/redux/transaction';
import { toast } from 'react-hot-toast';
import TokenLogo from '../components/TokenLogo';
import { getTokenVariant } from '../utils/tokenUtils';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { useState, useEffect } from 'react';
import { POPULAR_BSC_TOKENS } from '../services/coinLogos';

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

function Send() {
    const navigate = useNavigate();
    const transaction = useSelector((state: RootState) => state.transaction);
    const dispatch = useDispatch();
    const [amount, setAmount] = useState("");
    const [recipientAddress, setRecipientAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tokenPrice] = useState(1); // USD price per token
    
    // Get wallet state with balances
    const { 
        isConnected, 
        address,
        balances,
        isLoadingBalances,
        getTokenBalances,
        getCustomTokens
    } = useBackendWallet();

    // Get token balance from wallet balances
    const getTokenBalance = () => {
        if (!transaction.token) return 0;
        return balances[transaction.token] || 0;
    };

    const tokenBalance = getTokenBalance();

    // Fetch balances when component mounts or transaction changes
    useEffect(() => {
        if (isConnected && getTokenBalances && transaction.token) {
            getTokenBalances();
        }
    }, [isConnected, transaction.token]);

    // Check if amount exceeds balance
    const hasInsufficientBalance = () => {
        if (!amount || !transaction.token) return false;
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) return false;
        return amountNum > tokenBalance;
    };

    // Get remaining balance after transaction
    const getRemainingBalance = () => {
        if (!amount) return tokenBalance;
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) return tokenBalance;
        return Math.max(0, tokenBalance - amountNum);
    };

    // Get balance percentage used
    const getBalancePercentage = () => {
        if (!amount || !transaction.token) return 0;
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0 || tokenBalance === 0) return 0;
        return Math.min((amountNum / tokenBalance) * 100, 100);
    };

    const handleSend = async()=> {
        if (!isConnected) {
            toast.error("Please connect your wallet first");
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (hasInsufficientBalance()) {
            toast.error(`Insufficient balance. You have ${formatNumber(tokenBalance)} ${transaction.token}`);
            return;
        }
        if (!recipientAddress) {
            toast.error("Please enter recipient address");
            return;
        }
        // Validate recipient address format
        if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            toast.error("Please enter a valid wallet address");
            return;
        }
        // Warn if using more than 95% of balance
        const balancePercentage = getBalancePercentage();
        if (balancePercentage > 95) {
            const confirmed = window.confirm(
                `You are using ${balancePercentage.toFixed(1)}% of your ${transaction.token} balance. ` +
                `This might not leave enough for gas fees. Do you want to continue?`
            );
            if (!confirmed) {
                return;
            }
        }
        
        setIsLoading(true);
        
        try {
            const data = {
                token: transaction.token,
                address: transaction.address,
                amount: parseFloat(amount),
                network: transaction.network,
                icon: transaction.icon,
                recipient: recipientAddress
            }
            console.log(data);
            
            // Simulate transaction processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Refresh balances after successful send
            if (getTokenBalances) {
                await getTokenBalances();
            }
            
            dispatch(clearTransaction())
            navigate("/")
            toast.success("Transaction sent successfully")
        } catch (error) {
            toast.error("Transaction failed");
        } finally {
            setIsLoading(false);
        }
    }

    const handleMaxAmount = () => {
        if (tokenBalance > 0) {
            // Use 99.9% of balance to account for gas fees
            const maxAmount = tokenBalance * 0.999;
            setAmount(maxAmount.toString());
        } else {
            toast.error(`No ${transaction.token} balance available`);
        }
    }

    // Calculate USD value
    const usdValue = parseFloat(amount) * tokenPrice;
    return (
        <div className="h-full flex-col items-center justify-center w-full py-[20px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-500 px-[20px] pb-[20px]">
                <button onClick={() => navigate(-1)} className="p-[5px] rounded-full z-20 border border-[#44F58E] bg-black">
                    <ChevronLeft color="#44F58E" />
                </button>
                <p className="flex-1 text-center text-[25px] font-[600] gradient-text ml-[-30px]">Send</p>
            </div>

            {!isConnected ? (
                <div className="flex flex-col items-center justify-center w-full px-[20px] mt-[40px] gap-[20px]">
                    <div className="text-center">
                        <h2 className="text-white text-xl font-bold mb-2">Wallet Not Connected</h2>
                        <p className="text-gray-400">Please connect your wallet to send tokens</p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn p-[15px] text-[18px] font-[600] rounded-[15px]"
                    >
                        Go to Home
                    </button>
                </div>
            ) : (
            <div className="flex flex-col w-full px-[20px] mt-[20px] gap-[20px]">
                {/* Selected Token */}
                <div className=" border border-gray-600 rounded-[15px] p-[20px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[15px]">
                            <TokenLogo
                                symbol={transaction.token}
                                address={transaction.address}
                                size={50}
                                variant={getTokenVariant(transaction.token, transaction.name || transaction.token)}
                                className=" border-gray-300"
                            />
                            <div>
                                <p className="text-white font-[600] text-lg">{transaction.token}</p>
                                <p className="text-gray-400 text-sm">{transaction.name || 'Token'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {isLoadingBalances ? (
                                <p className="text-gray-500 text-sm">Loading...</p>
                            ) : (
                                <>
                                    <p className="text-white font-[600]">Balance: {formatNumber(tokenBalance)} {transaction.token}</p>
                                    <p className="text-gray-400 text-sm">≈ ${(tokenBalance * tokenPrice).toFixed(2)}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Amount Input */}
                <div className="border border-gray-600 rounded-[15px] p-[20px]">
                    <div className="flex items-center justify-between mb-[15px]">
                        <div>
                            <p className="text-white font-[600]">Amount</p>
                            {amount && parseFloat(amount) > 0 && (
                                <p className="text-gray-400 text-xs mt-1">
                                    {getBalancePercentage().toFixed(1)}% of balance
                                </p>
                            )}
                        </div>
                        <button 
                            onClick={handleMaxAmount}
                            disabled={tokenBalance === 0}
                            className="text-[#44F58E] text-sm font-medium hover:text-[#44F58E]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            MAX
                        </button>
                    </div>
                    <div className="flex items-center gap-[10px]">
                        <input 
                            type="number" 
                            placeholder="0.00"
                            step="any"
                            className="flex-1 bg-transparent text-white text-2xl font-[600] border-none outline-none placeholder-gray-500"
                            value={amount}  
                            onChange={(e) => setAmount(e.target.value)} 
                            min={0}
                        />
                        <span className="text-gray-400 text-lg">{transaction.token}</span>
                    </div>
                    <div className="mt-[10px] flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                            ≈ ${usdValue.toFixed(2)} USD
                        </span>
                        {amount && parseFloat(amount) > 0 && (
                            <span className="text-gray-500 text-xs">
                                Remaining: {formatNumber(getRemainingBalance())} {transaction.token}
                            </span>
                        )}
                    </div>
                    {/* Balance indicator bar */}
                    {amount && parseFloat(amount) > 0 && (
                        <div className="mt-3">
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
                        </div>
                    )}
                    {/* Insufficient Balance Warning */}
                    {hasInsufficientBalance() && (
                        <div className="flex items-center gap-2 mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs">
                            <AlertCircle size={14} />
                            <span>
                                Insufficient {transaction.token} balance. You have {formatNumber(tokenBalance)} {transaction.token}
                            </span>
                        </div>
                    )}
                </div>

                {/* Recipient Address */}
                <div className=" border border-gray-600 rounded-[15px] p-[20px]">
                    <p className="text-white font-[600] mb-[15px]">Recipient Address</p>
                    <div className="flex items-center gap-[10px]">
                        <input 
                            type="text" 
                            placeholder="Enter wallet address"
                            className="flex-1 bg-transparent text-white border-none outline-none placeholder-gray-500"
                            value={recipientAddress} 
                            onChange={(e) => setRecipientAddress(e.target.value)} 
                        />
                        
                    </div>
                </div>

                {/* Transaction Summary */}
                {amount && recipientAddress && (
                    <div className="bg-[#0a0a0a] border border-[#44F58E]/30 rounded-[15px] p-[20px]">
                        <p className="text-white font-[600] mb-[15px]">Transaction Summary</p>
                        <div className="space-y-[10px]">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Amount</span>
                                <span className="text-white">{amount} {transaction.token}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Network Fee</span>
                                <span className="text-white">~0.001 BNB</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total</span>
                                <span className="text-[#44F58E] font-[600]">{parseFloat(amount) + 0.001} {transaction.token}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Send Button */}
                <button 
                    onClick={handleSend} 
                    disabled={isLoading || !amount || !recipientAddress || hasInsufficientBalance()}
                    className="btn p-[15px] text-[18px] font-[600] w-full rounded-[15px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : hasInsufficientBalance() ? (
                        <>
                            <AlertCircle size={20} />
                            Insufficient Balance
                        </>
                    ) : (
                        <>
                            <ArrowUp size={20} />
                            Send {amount} {transaction.token}
                        </>
                    )}
                </button>
            </div>
            )}
        </div>
    )
}

export default Send