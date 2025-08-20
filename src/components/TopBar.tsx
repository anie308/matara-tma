import { useLocation } from "react-router-dom";
import MenuButton from "./MenuButton";
// import { useTonConnectUI } from "@tonconnect/ui-react";
import { useSelector } from "react-redux";
import { RootState } from "../services/store";

const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  // const [tonConnectUI] = useTonConnectUI();
  const user = useSelector((state: RootState) => state.user.profile);
  const userPoints = user?.points || 0;

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
            {userPoints} $MAT
          </button>
        );
    }
  };

  return (
    <div className="flex bg-[#000F15] items-center justify-between sticky top-0 w-full p-3">
      <div className="flex items-center space-x-3">
        <img src="./warrior.svg" alt="Warrior Icon" />
        {renderContent()}
      </div>
      <div className="flex items-center space-x-3">
        {/* <button
          className="btn py-1 px-3 font-semibold text-black text-sm rounded-md"
          onClick={() => tonConnectUI.openModal()}
        >
          Connect
        </button> */}
        <MenuButton />
      </div>
    </div>
  );
};

export default TopBar;
