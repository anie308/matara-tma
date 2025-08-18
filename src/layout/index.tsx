import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";

function Layout() {
  const location = useLocation();
  const { pathname } = location;

  // Determine whether to show the BottomNav based on the current path
  const showBottomNav = !["/profile", "/matara-ranks"].includes(pathname);

  return (
    <div className="min-h-screen font-montserrat root relative flex flex-col w-full">
      {/* TopBar is always visible */}
      <TopBar />

      {/* Main content area */}
      <div className="overflow-auto flex-grow pb-20">
        <Outlet />
      </div>

      {/* Conditionally render BottomNav */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default Layout;