// import React from 'react'

import { useState } from "react"

function Home() {
  const [porfolioStatus, setPortfolioStatus] = useState(true)
  return (
    <div className="min-h-full">
     <div className="flex flex-col items-center py-[30px]">
     <div className="h-[50%] flex items-center  justify-center space-x-[20px] border-white">
        <div>
          <p className="text-[#4BF693] text-[9px]">Mining Mode</p>
          <p className="font-[900] text-[21px] text-white leading-[23px]">2.023 <br />
            $MAT</p>
        </div>
        <div>
         {porfolioStatus ?  <img src="/earn-up.svg" alt=""  /> :  <img src="/earn-down.svg" alt="" />}
        </div>
        <div>
          <p className="text-[#FFBF49] text-[9px]">Earning Rate</p>
          <p className="font-[900] text-[21px] text-white leading-[23px]">0.0002 </p>
            <p className=" text-white  font-[600] text-[12px]">$MAT/Sec</p>
          
        </div>
      </div>
      <p className="mt-[15px]">Mining Resets in 23hrs:23mins</p>
     </div>

     <div>

     </div>
    </div>
  )
}

export default Home
