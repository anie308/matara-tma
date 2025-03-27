// import React from 'react'

import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav"
import TopBar from "../components/TopBar";

function Layout() {
  return (
      <div className="min-h-screen h-screen root relative flex flex-col  w-full">
        <div className="min-h-full  ">
          <TopBar/>
         <div className="overflow-auto min-h-full    pb-[80px]">
         <Outlet />
         </div>
        </div>
        <BottomNav />
    </div>
  )
}

export default Layout
