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
    isTelegramMiniApp
  } = useReownWallet();

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
    <div className="flex bg-[#000F15] items-center justify-between sticky top-0 z-20 w-full p-3">
      <div className="flex items-center space-x-3">
        <img src="/warrior.svg" alt="Warrior Icon" />
        {renderContent()}
      </div>
      <div className="flex items-center space-x-3">
      {!isConnected ? (
              isTelegramMiniApp ? (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="bg-[#FFB948] text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FFA500] transition-colors flex items-center gap-2"
                >
                  <Wallet size={16} />
                  Connect BSC Wallet
                </button>
              ) : (
                <ReownConnectButton />
              )
            ) : (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${chainId === 56 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-xs ${chainId === 56 ? 'text-green-400' : 'text-red-400'}`}>
                  {chainId === 56 ? 'BSC' : 'Wrong Network'}
                </span>
              </div>
            )}
       
        <MenuButton />
      </div>
      
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
