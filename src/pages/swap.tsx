// import React from 'react'

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Swap() {
    const navigate = useNavigate();
  return (
    <div className="h-full p-[20px] flex-col items-center justify-center w-full ">
        <div className="flex items-center justify-between">
            <button onClick={()=> navigate(-1)} className="p-[5px] rounded-full z-20 border border-[#44F58E] bg-black">
                <ChevronLeft color="#44F58E"/>
            </button>
            <p className="flex-1 text-center text-[25px] font-[600] gradient-text ml-[-30px]">Swap</p>
        </div>

        <div className="flex flex-col mt-[50px] gap-[20px]">
            <div className="border p-[20px] border-[#44F58E]"></div>
            <div className="border p-[20px] border-[#44F58E]"></div>
        </div>
        <button className="btn p-[10px] mt-[20px] w-full rounded-[10px] font-[500] text-[18px]">
            Preview Swap
        </button>
    </div>
  )
}

export default Swap