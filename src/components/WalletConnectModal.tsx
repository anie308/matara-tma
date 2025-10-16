import React, { useState } from 'react';
import { X, Copy, Check, QrCode } from 'lucide-react';
import { useBSCWallet } from '../hooks/useBSCWallet';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { connectWithAddress, isConnecting, error } = useBSCWallet();
  const [address, setAddress] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    if (!address.trim()) {
      return;
    }
    
    try {
      await connectWithAddress(address.trim());
      onClose();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('0x1234567890123456789012345678901234567890'); // Example address
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Connect BSC Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter your BSC wallet address:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#44F58E]"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleConnect}
              disabled={!address.trim() || isConnecting}
              className="flex-1 bg-[#44F58E] text-black font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3dd47a] transition-colors"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-3">
              Don't have a BSC wallet? Here are some options:
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <QrCode size={20} className="text-[#44F58E]" />
                  <span className="text-white text-sm">MetaMask</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-[#44F58E] text-sm hover:text-[#3dd47a]"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <QrCode size={20} className="text-[#44F58E]" />
                  <span className="text-white text-sm">Trust Wallet</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-[#44F58E] text-sm hover:text-[#3dd47a]"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Make sure your wallet is connected to Binance Smart Chain (BSC) network</p>
          </div>
        </div>
      </div>
    </div>
  );
};
