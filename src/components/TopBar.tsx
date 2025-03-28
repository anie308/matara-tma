// import React from 'react'
import { useLocation } from 'react-router-dom';
import MenuButton from './MenuButton'
import { useTonConnectUI } from '@tonconnect/ui-react';


function TopBar() {
  const location = useLocation();
  const path = location.pathname;
  const [tonConnectUI, setOptions] = useTonConnectUI();


  const handleRender = () => {
    if (path === "/profile") {
      return <p className='text-start text-[#FFB948] leading-[20px] font-[900] text-[18px]'>User <br /> Profile</p>
    } else if (path === '/matara-ranks') {
      return <p className='text-start text-[#FFB948] leading-[20px] font-[900] text-[17px]'>Matara <br /> Ranks</p>

    } else {
      return <button className="coin-btn border-[#44F58E] text-white border-[2px] rounded-[8px] font-[700] text-[14px] p-[4px_18px]  ">300 $MAT</button>

    }
  }
  return (
    <div className='flex bg-[#000F15] items-center justify-between sticky top-0 w-full p-[10px_15px]'>
      <div className="flex items-center space-x-[10px]">
        <img src="./warrior.svg" alt="" />
        {handleRender()}
      </div>
      <div className="flex items-center space-x-[10px]">
        <button className="btn p-[5px_10px] font-[600] text-black text-[14px] rounded-[5px]" onClick={() => tonConnectUI.openModal()}>Connect</button>
        <MenuButton />
      </div>
    </div>
  )
}

export default TopBar
