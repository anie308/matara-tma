// import React from 'react'

import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav"
import TopBar from "../components/TopBar";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const handleRender = () => {
    if (path === "/profile" || path === '/matara-ranks' ) {
      return 
    }  else {
      return <BottomNav />
    }
  }
  return (
      <div className="min-h-screen h-screen font-montserrat root relative flex flex-col  w-full">
        <div className="min-h-full  ">
          <TopBar/>
         <div className="overflow-auto min-h-full pb-[80px]">
         <Outlet />
         </div>
        </div>
        {handleRender()}
    </div>
  )
}

export default Layout
