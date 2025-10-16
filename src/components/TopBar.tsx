import { useLocation } from "react-router-dom";
import MenuButton from "./MenuButton";
// import { useTonConnectUI } from "@tonconnect/ui-react";
import { useSelector } from "react-redux";
import { RootState } from "../services/store";
import { useReownWallet } from "../services/reownWallet";
import { Wallet } from "lucide-react";
import { ReownConnectButton } from "./ReownConnectButton";
import { WalletConnectModal } from "./WalletConnectModal";
import { useState } from "react";

const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  // const [tonConnectUI] = useTonConnectUI();
  const user = useSelector((state: RootState) => state.user.profile);
  const userPoints = user?.points || 0;
  const [showWalletModal, setShowWalletModal] = useState(false);

  const {
    isConnected,
    chainId,
    isTelegramMiniApp,
    address,
    disconnect
  } = useReownWallet();

  // Debug logging
  console.log('TopBar State:', { isConnected, chainId, address, isTelegramMiniApp });

  // Render different content based on the current path
  const renderContent = () => {
    switch (currentPath) {
      case "/profile":
        return (
          <p className="text-start text-yellow-500 leading-tight font-black text-lg">
            User <br /> Profile
          </p>
        );
      case "/matara-ranks":
        return (
          <p className="text-start text-yellow-500 leading-tight font-black text-lg">
            Matara <br /> Ranks
          </p>
        );
      default:
        return (
          <button className="coin-btn border-green-400 text-white border-2 rounded-lg font-bold text-sm py-1 px-4">
            {userPoints.toFixed(2)} $MARP
          </button>
        );
    }
  };

  return (
    <div className="flex flex-col bg-[#000F15] items-center justify-between sticky top-0 z-20 w-full p-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <img src="/warrior.svg" alt="Warrior Icon" />
          {renderContent()}
        </div>
        <div className="flex items-center space-x-3">
          {!isConnected && (
            isTelegramMiniApp ? (
              <button
                onClick={() => setShowWalletModal(true)}
                className="bg-[#FFB948] text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FFA500] transition-colors flex items-center gap-2"
              >
                <Wallet size={16} />
                Connect Wallet
              </button>
            ) : (
              <ReownConnectButton />
            )
          )}



          <MenuButton />
        </div>
      </div>

      {isConnected && (
        <div className="flex items-center gap-3 mt-[10px]">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${chainId === 97 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs ${chainId === 97 ? 'text-green-400' : 'text-red-400'}`}>
                    {chainId === 97 ? 'BSC Testnet' : 'Wrong Network'}
                  </span>
                </div>
          {address && (
            <span className="text-xs text-gray-400">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          )}
          <button
            onClick={() => {
              console.log('Disconnect button clicked');
              disconnect();
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Wallet Connect Modal for Telegram Mini Apps */}
      {isTelegramMiniApp && (
        <WalletConnectModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </div>
  );
};

export default TopBar;



