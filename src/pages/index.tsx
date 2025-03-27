// import React from 'react'

import { useState } from "react"

function Home() {
  const [porfolioStatus, setPortfolioStatus] = useState(false)
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
            {porfolioStatus ? <img src="/earn-up.svg" alt="" /> : <img src="/earn-down.svg" alt="" />}
          </div>
          <div>
            <p className="text-[#FFBF49] text-[9px]">Earning Rate</p>
            <p className="font-[900] text-[21px] text-white leading-[23px]">0.0002 </p>
            <p className=" text-white  font-[600] text-[12px]">$MAT/Sec</p>

          </div>
        </div>
        <p className="mt-[15px] text-white"><span className="text-[#FFB948]">Mining Resets</span> in 23hrs:23mins</p>
      </div>

      <div className="flex flex-col mt-[20px] relative items-center justify-center">
        <img src="/lion.jpg" alt="" />
        <div className="grad-con absolute top-[-20px] flex items-start justify-center w-full p-[5px] ">
          <button className="btn font-[900] text-[18px] mt-[-20px] p-[12px_30px] rounded-[8px]">Claim Matara Daily</button>
        </div>
      </div>

      <div>

      </div>
    </div>
  )
}

export default Home
