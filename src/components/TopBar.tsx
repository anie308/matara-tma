// import React from 'react'
import MenuButton from './MenuButton'


function TopBar() {
  return (
    <div className='flex bg-[#000F15] items-center justify-between sticky top-0 w-full p-[10px_15px]'>
      <div className="flex items-center space-x-[10px]">
        <img src="./warrior.svg" alt="" />
        <button className="coin-btn border-[#44F58E] text-white border-[2px] rounded-[8px] font-[700] text-[14px] p-[4px_18px]  ">300 $MAT</button>
      </div>
      <div className="flex items-center space-x-[10px]">
        <button className="btn p-[5px_10px] font-[600] text-black text-[14px] rounded-[5px]">Connect</button>
        <MenuButton/>
      </div>
    </div>
  )
}

export default TopBar
