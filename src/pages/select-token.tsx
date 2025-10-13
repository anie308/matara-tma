// import React from 'react'

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../services/store";
import { useDispatch, useSelector } from "react-redux";
import { setTransaction } from "../services/redux/transaction";

function SelectToken() {
    const navigate = useNavigate();
    const transaction = useSelector((state: RootState) => state.transaction);
    const dispatch = useDispatch();
    const mockTokens = [
        { name: "TON", icon: "/lion.jpg", address: "0x0000000000000000000000000000000000000000" },
        { name: "BTC", icon: "/scout.jpg", address: "0x0000000000000000000000000000000000000000" },
        { name: "USDT", icon: "/8.jpg", address: "0x0000000000000000000000000000000000000000" },
    ]
    const handleSelectToken = (token: string, address: string, icon: string) => {
        dispatch(setTransaction({ ...transaction, token, address, icon }));
        navigate(`${transaction.type === "send" ? "/send" : "/receive"}`);
    }
    return (
      <div className="h-full  flex-col items-center justify-center w-full py-[20px]">
          <div className="flex items-center justify-between border-b border-gray-500 px-[20px] pb-[20px]">
              <button onClick={()=> navigate(-1)} className="p-[5px] rounded-full z-20 border border-[#44F58E] bg-black">
                  <ChevronLeft color="#44F58E"/>
              </button>
              <p className="flex-1 text-center text-[25px] font-[600] gradient-text ml-[-30px]">Select Token</p>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-[10px] mt-[20px] p-[20px]">
            {mockTokens.map((token) => (
              <div key={token.name} onClick={() => handleSelectToken(token.name, token.address, token.icon)} className="flex items-center justify-between w-full border border-gray-500 p-[10px] rounded-[10px] cursor-pointer">
                <div className="flex items-center gap-[10px]">
                  <img src={token.icon} alt={token.name} className="w-[40px] h-[40px]  border-[5px] border-[#D9D9D91F] rounded-full" />
                  <p className="text-white font-[600]">{token.name}</p>
                </div>
                
              </div>
            ))}
          </div>
  
          
      </div>
    )
}

export default SelectToken