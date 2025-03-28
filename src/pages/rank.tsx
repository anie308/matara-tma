// import React from 'react'

import WebApp from "@twa-dev/sdk";

function Rank() {
          WebApp.BackButton.hide();
  
  return (
    <div className="text-white flex w-full px-[10px] items-center flex-col justify-center">
      <p className="text-[#FFB948] font-[900] text-[35px] mt-[20px]">Ranking</p>
      <p className="text-[15px] text-center text-white font-[500] w-[90%]">Strive to be among Top 100,000 members to be eligible for Matara Community Airdrop.</p>

      

<div className="w-full mt-[40px]">
  <div className="relative overflow-x-auto">
    <table className="w-full">
    <thead className="text-[14px] text-white border-b border-[#CDCBC8]">
            <tr>
                <th scope="col" className="px-6 py-3">
                    User Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Rank
                </th> 
                <th scope="col" className="px-6 py-3">
                    Earnings
                </th>  
            </tr>
        </thead>
        <tbody>
            <tr className="">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-center  text-[#CDCBC8]">
                    @jurstadev
                </th>
                <td className="px-6 py-4 text-center text-[#CDCBC8]">
                Sergeant
                </td>
                <td className="px-6 py-4 text-center text-[#44F58E]">
                50,022 $MAT
                </td>
               
            </tr>
            
            
        </tbody>
    </table>
  </div>
</div>



    </div>
  )
}

export default Rank
