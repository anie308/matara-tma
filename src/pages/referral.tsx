// import React from 'react'

import WebApp from "@twa-dev/sdk";
import { Copy } from "lucide-react"


function Referral() {
            WebApp.BackButton.hide();
    
  return (
    <div className="text-white flex px-[10px] items-center flex-col justify-center">
      <p className="text-[#FFB948] font-[900] text-[35px] mt-[20px]">Referrals</p>

      <div className="flex-col w-full mt-[20px] flex items-center justify-center space-y-[10px]">
        <button className="coin-btn border-[#44F58E] text-white border-[2px] rounded-[8px]  justify-center  p-[8px_25px] w-[55%] flex items-center space-x-[10px]">
          <span className="font-[900] text-[18px]">Invite Friends</span>
          <Copy />
        </button>

        <button className="btn  text-black  rounded-[8px]   p-[8px_25px] w-[55%] flex items-center space-x-[10px] justify-center">
          <span className="font-[900] text-[18px]">Share to story </span>
          
        </button>

        <p className="text-[15px] text-center text-white font-[500]">Share story to earn more Matara <br /> Tokens ($MAT)</p>
      </div>

<div className="w-full mt-[20px]">
  <div className="relative overflow-x-auto">
    <table className="w-full">
    <thead className="text-[14px] text-white border-b border-[#CDCBC8]">
            <tr>
                <th scope="col" className="px-6 py-3">
                    User Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Earnings
                </th>  
            </tr>
        </thead>
        <tbody>
            <tr className="">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-center ">
                    @jurstadev
                </th>
                <td className="px-6 py-4 text-center text-[#44F58E]">
                +$2.5 $MAT
                </td>
               
            </tr>
            
            
        </tbody>
    </table>
  </div>
</div>


{/* <div className="relative ">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
            </tr>
            
            
        </tbody>
    </table>
</div> */}

    </div>
  )
}

export default Referral
