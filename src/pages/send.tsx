import { ChevronLeft, ArrowUp } from 'lucide-react'
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
function Send() {
    const navigate = useNavigate();
    const transaction = useSelector((state: RootState) => state.transaction);
    const dispatch = useDispatch();
    const [amount, setAmount] = useState("");
    const [recipientAddress, setRecipientAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [tokenPrice] = useState(1); // USD price per token
    
    // Get wallet state
    const { 
        isConnected, 
        address,
        getCustomTokens
    } = useBackendWallet();

    // Create token list for balance fetching
    const TOKENS = Object.values(POPULAR_BSC_TOKENS).map(token => ({
        symbol: token.symbol,
        name: token.name,
        logo: token.logo,
        address: token.address,
        decimals: 18
    }));
    const customTokens = getCustomTokens();
    const allTokens = [...TOKENS, ...customTokens];

    // Fetch token balance when component mounts or transaction changes
    useEffect(() => {
        const fetchTokenBalance = async () => {
            if (!isConnected || !address || !transaction.token) return;
            
            try {
                // For now, set balance to 0 - token balance fetching will be implemented later
                const balances = {};
                const balance = (balances as any)[transaction.token] || 0;
                setTokenBalance(balance);
            } catch (error) {
                console.error('Error fetching token balance:', error);
                setTokenBalance(0);
            }
        };

        fetchTokenBalance();
    }, [isConnected, address, transaction.token, allTokens]);

    const handleSend = async()=> {
        if (!isConnected) {
            toast.error("Please connect your wallet first");
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (parseFloat(amount) > tokenBalance) {
            toast.error("Insufficient balance");
            return;
        }
        if (!recipientAddress) {
            toast.error("Please enter recipient address");
            return;
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
        setAmount(tokenBalance.toString());
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
                            <p className="text-white font-[600]">Balance: {tokenBalance.toFixed(4)}</p>
                            <p className="text-gray-400 text-sm">≈ ${(tokenBalance * tokenPrice).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Amount Input */}
                <div className="border border-gray-600 rounded-[15px] p-[20px]">
                    <div className="flex items-center justify-between mb-[15px]">
                        <p className="text-white font-[600]">Amount</p>
                        <button 
                            onClick={handleMaxAmount}
                            className="text-[#44F58E] text-sm font-medium hover:text-[#44F58E]/80"
                        >
                            MAX
                        </button>
                    </div>
                    <div className="flex items-center gap-[10px]">
                        <input 
                            type="number" 
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-white text-2xl font-[600] border-none outline-none placeholder-gray-500"
                            value={amount}  
                            onChange={(e) => setAmount(e.target.value)} 
                            min={0}
                            max={tokenBalance.toString()}
                        />
                        <span className="text-gray-400 text-lg">{transaction.token}</span>
                    </div>
                    <div className="mt-[10px] text-gray-400 text-sm">
                        ≈ ${usdValue.toFixed(2)} USD
                    </div>
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
                    disabled={isLoading || !amount || !recipientAddress}
                    className="btn p-[15px] text-[18px] font-[600] w-full rounded-[15px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
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