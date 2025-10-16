import { useState } from "react";
import { X, Plus, AlertCircle } from "lucide-react";
import { Token } from "../../services/wallet";

interface ImportTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (token: Token) => Promise<boolean>;
}

export default function ImportTokenModal({ isOpen, onClose, onImport }: ImportTokenModalProps) {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!tokenAddress || !tokenSymbol || !tokenName) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token: Token = {
        symbol: tokenSymbol.toUpperCase(),
        name: tokenName,
        logo: "/tokens/default.png",
        address: tokenAddress,
        decimals: tokenDecimals,
      };

      const success = await onImport(token);
      if (success) {
        onClose();
        setTokenAddress("");
        setTokenSymbol("");
        setTokenName("");
        setTokenDecimals(18);
      } else {
        setError("Failed to import token");
      }
    } catch (err: any) {
      setError(err.message || "Failed to import token");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-[20px] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Import Token</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Token Contract Address *
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FFB948] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Symbol *
              </label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                placeholder="USDT"
                className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FFB948] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Decimals
              </label>
              <input
                type="number"
                value={tokenDecimals}
                onChange={(e) => setTokenDecimals(Number(e.target.value))}
                min="0"
                max="18"
                className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FFB948] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Token Name *
            </label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="Tether USD"
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#FFB948] focus:outline-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={isLoading}
              className="flex-1 bg-[#FFB948] text-black py-3 rounded-lg font-medium hover:bg-[#FFA500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={16} />
                  Import Token
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
