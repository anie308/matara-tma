import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Bell, Eye, EyeOff, ScanLine, TriangleAlert, Plus, Wallet, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTransaction } from "../services/redux/transaction";
import { RootState } from "../services/store";
import { useReownWallet } from "../services/reownWallet";
import ImportTokenModal from "../components/modal/ImportTokenModal";
import { POPULAR_BSC_TOKENS } from "../services/coinLogos";
import TokenLogo from "../components/TokenLogo";
import { getTokenVariant } from "../utils/tokenUtils";

export default function Trade() {
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [showImportModal, setShowImportModal] = useState(false);
  
  WebApp.BackButton.hide();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  const { 
    isConnected, 
    address, 
    balance, 
    chainId,
    error, 
    connect, 
    getAllTokenBalances,
    importToken,
    getCustomTokens,
    removeCustomToken,
  } = useReownWallet();

  const TOKENS = Object.values(POPULAR_BSC_TOKENS).map(token => ({
    symbol: token.symbol,
    name: token.name,
    logo: token.logo,
    address: token.address,
    decimals: 18
  }));

  useEffect(() => {
    const loadBalances = async () => {
      if (isConnected && address) {
        const customTokens = getCustomTokens();
        const allTokens = [...TOKENS, ...customTokens];
        const result = await getAllTokenBalances(allTokens);
        setBalances(result);
      }
    };
    loadBalances();
  }, [isConnected, address, getAllTokenBalances, getCustomTokens]);

  const transaction = useSelector((state: RootState) => state.transaction);

  const dispatch = useDispatch();




  const handleReceive = () => {
    dispatch(setTransaction({ ...transaction, type: "receive" }));
    navigate("/select-token");
  }

  const handleSend = () => {
    dispatch(setTransaction({ ...transaction, type: "send" }));
    navigate("/select-token");
  }

  const handleImportToken = async (token: any) => {
    return await importToken(token);
  }

  const customTokens = getCustomTokens();
  const allTokens = [...TOKENS, ...customTokens];

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full p-[20px]">
        <div className="w-full flex items-center justify-between mt-[10px]">
          <div></div>
          <div className="flex items-center gap-[10px]">
           
            <Bell className="text-white text-[20px]" />
            <ScanLine className="text-white text-[20px]" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-[20px]	">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-4">
              <Wallet className="text-[#FFB948] text-6xl" />
              <h2 className="text-white text-xl font-bold">Connect Your Wallet</h2>
              <p className="text-gray-400 text-center">
                Use the "Connect" button in the top bar to connect your wallet
              </p>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-[10px]">
                <p className="font-[900] text-[32px] gradient-text">
                  {isVisible ? `$${parseFloat(balance).toFixed(4)}` : "****"}
                </p>
                <button onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? <Eye className="text-white text-[20px]" /> : <EyeOff className="text-white text-[20px]" />}
                </button>
              </div>
              <p className="gradient-text">+$0.03856 (+2.87%) Today</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-gray-400 text-sm">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
                </p>
              </div>
            </>
          )}

          {isConnected && chainId !== 56 && (
            <div className="w-full mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <TriangleAlert size={16} />
                <span className="text-sm font-medium">Wrong Network</span>
              </div>
              <p className="text-red-300 text-xs mt-1">
                Please switch to Binance Smart Chain (BSC) to view your tokens.
              </p>
              <button
                onClick={connect}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
              >
                Switch to BSC
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-[15px] mt-[20px]">
            <button onClick={handleSend} className="btn p-[8px] rounded-[10px]">
              <ArrowUp className=" text-[20px]" />
            </button>
            <button onClick={handleReceive} className="btn p-[8px] rounded-[10px]">
              <ArrowDown className=" text-[20px]" />
            </button>
            <button onClick={() => navigate("/swap")} className="btn p-[8px] rounded-[10px] rotate-90">
              <ArrowUpDown className=" text-[20px]" />
            </button>
          </div>
          {/* <div className="w-full mt-[30px]">
            <p className="text-white font-[600] flex items-center gap-[10px]">Secure your wallet <span><HelpCircle className="text-[10px]" /></span></p>
            <div className="border p-[20px] mt-[10px] border-[#FFB948] rounded-[10px] flex items-center gap-[10px]">
              <TriangleAlert size={35} className="text-[#9B393F] text-[20px]" />
              <p className="text-white font-[600] leading-[18px]">Click here to find your recovery phrase</p>
              <ChevronRight size={25} className="text-white text-[20px]" />
            </div>
          </div> */}

          {isConnected && (
            <div className="w-full mt-[30px]">
              <div className="flex items-center text-white border-b pb-[10px] justify-between">
                <p className="font-[600] text-[18px]">Tokens</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="text-[#FFB948] text-sm flex items-center gap-1 hover:text-[#FFA500]"
                  >
                    <Plus size={16} />
                    Import
                  </button>
                  {/* <p className="text-gray-400 text-sm">Filters</p> */}
                </div>
              </div>

              {allTokens.map((token) => {
                const isCustomToken = customTokens.some((ct: any) => ct.address === token.address);
                return (
                  <div key={`${token.symbol}-${token.address}`} className="flex items-center justify-between mt-[20px]">
                    <div className="flex items-center gap-[10px]">
                      <TokenLogo
                        symbol={token.symbol}
                        address={token.address}
                        size={40}
                        variant={getTokenVariant(token.symbol, token.name)}
                        className=""
                      />
                      <div>
                        <p className="text-white font-[600]">
                          {token.symbol} <span className="text-[#44F58E]">+0.00%</span>
                        </p>
                        <p className="text-[#CDCBC8] text-[14px]">{token.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-[600] text-white">
                          {balances[token.symbol] ? balances[token.symbol].toFixed(2) : "0.00"} {token.symbol}
                        </p>
                        <p className="text-[#CDCBC8] text-[14px]">$0.00</p>
                      </div>
                      {isCustomToken && (
                        <button
                          onClick={() => removeCustomToken(token.address)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Remove token"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ImportTokenModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportToken}
      />
    </>
  );
}
