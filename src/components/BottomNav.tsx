// import React from 'react'

import { Link, useLocation } from "react-router-dom"

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  console.log(path)

  const links = [
    {
      title: "Ref",
      link: "ref"
    },
    {
      title: "Rank",
      link: "rank"
    },
    {
      title: "Tasks",
      link: "tasks"
    },
    {
      title: "Game",
      link: "game"
    },

  ]
  return (
    <div className="fixed  text-white border-white w-full flex bottom-0 items-center justify-center ">
      <div className="h-[80px] absolute w-[80px] z-20 bg-white border bottom-[35px]  rounded-full"></div>
      <div className="grid grid-cols-4 w-full">
        {links.map((l: any, index) =>
          <Link key={index} to={l.link} className={`${path === `/${l.link}` ? "active-nav" : "nav-btn"} p-[20px] border-[3px] border-[#02354C] font-[700] flex items-center justify-center`}>{l.title}</Link>
        )}
      </div>
    </div>
  )
}

export default BottomNav
