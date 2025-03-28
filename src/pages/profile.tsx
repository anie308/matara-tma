// import React from 'react'

import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Profile() {
  WebApp.BackButton.show();
  const navigate = useNavigate()
  useEffect(() => {
    WebApp.BackButton.onClick(() => navigate(-1))
  }, [WebApp])


  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-center space-x-[10px] mt-[20px]">
        <div className="h-[70px] w-[70px] rounded-full border-[#44F58E] border-[3px]"></div>
        <div>
          <p className="text-[30px] font-[900] gradient-text">Chris John</p>
          <div className="flex items-center space-x-[10px]">

            <p className="text-[#CDCBC8]">@thechrisjohn</p>
            <img src="./warrior.svg" className="h-[30px]" alt="" />
          </div>
        </div>


      </div>
      <div className="coin-bnt mt-[40px] font-[900]  border-[#44F58E] border p-[5px_15px] rounded-[8px] flex items-center space-x-[5px]">
        <p className="gradient-text text-[12px]">2500 MAT</p>
        <img src="./warrior.svg" className="h-[30px]" alt="" />
        <p className="gradient-text text-[12px]">WARRIOR</p>
      </div>

      <p className="text-[17px] my-[20px] font-[800] text-[#FFB948]">My Earnings</p>

      <div className="w-full mt-[40px] px-[10px]">
      <div className="relative w-full overflow-x-auto">
          <table className="w-full">
            <thead className="text-[14px] text-white border-b border-[#CDCBC8]">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">
                  Task Details
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Earnings
                </th> 
               
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <th scope="row" className="px-6 py-4 text-[14px] font-medium whitespace-nowrap text-center  text-[#CDCBC8]">
                New Referral
                </th>
                <td className="px-6 py-4 text-center text-[14px] text-[#CDCBC8]">
                0.02 $MAT
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Profile
