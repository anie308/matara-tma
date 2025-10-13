import WebApp from "@twa-dev/sdk";
import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Bell, ChevronRight, Eye, EyeOff, HelpCircle, ScanLine, TriangleAlert } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTransaction } from "../services/redux/transaction";
import { RootState } from "../services/store";

export default function Trade() {
  WebApp.BackButton.hide();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

 
  const transaction = useSelector((state: RootState) => state.transaction);

  const dispatch = useDispatch();
  

  

  const handleReceive = () => {
    dispatch(setTransaction({ ...transaction, type: "receive" }));
    navigate("/select-token");
  }

  const handleSend = () => {
    dispatch(setTransaction({ ...transaction, type: "send" }));
    navigate("/select-token");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full p-[20px]">
        <div className="w-full flex items-center justify-between mt-[10px]">
          <div></div>
          <div className="flex items-center gap-[10px]">
            <Bell className="text-white text-[20px]" />
            <ScanLine className="text-white text-[20px]" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-[20px]	">
           <div className="flex items-center gap-[10px]">
           <p className="font-[900] text-[32px] gradient-text">{ isVisible ? "$1.035" : "****" }</p>
           <button onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? <Eye className="text-white text-[20px]" /> : <EyeOff className="text-white text-[20px]" />}
           </button>
           </div>
           <p className="gradient-text">+$0.03856 (+2.87%) Today</p>

           <div className="flex items-center justify-center gap-[15px] mt-[20px]">
            <button onClick={handleSend} className="btn p-[8px] rounded-[10px]">
                <ArrowUp className=" text-[20px]" />
            </button>
            <button onClick={handleReceive} className="btn p-[8px] rounded-[10px]">
                <ArrowDown className=" text-[20px]" />
            </button>
            <button onClick={()=> navigate("/swap")} className="btn p-[8px] rounded-[10px] rotate-90">
                <ArrowUpDown className=" text-[20px]" />
            </button>
           </div>
           <div className="w-full mt-[30px]">
            <p className="text-white font-[600] flex items-center gap-[10px]">Secure your wallet <span><HelpCircle className="text-[10px]"/></span></p>
            <div className="border p-[20px] mt-[10px] border-[#FFB948] rounded-[10px] flex items-center gap-[10px]">
            <TriangleAlert size={35} className="text-[#9B393F] text-[20px]" />
            <p className="text-white font-[600] leading-[18px]">Click here to find your recovery phrase</p>
            <ChevronRight size={25} className="text-white text-[20px]" />
            </div>
           </div>

           <div className="w-full mt-[30px]">
            <div className="flex items-center text-white border-b pb-[10px] justify-between">
                <p className="font-[600] text-[18px]">Tokens</p>
                <p>Filters</p>
            </div>
            <div className="flex items-center justify-between mt-[20px]">
                <div className="flex items-center gap-[10px]">
                    <img src="/lion.jpg" alt="Lion" className="min-w-[40px] border border-[5px] rounded-full h-[40px]" />
                    <div>
                    <p className="text-white font-[600]">USDT <span className="text-[#44F58E]">+0.00%</span></p>
                    <p className="text-[#CDCBC8] text-[14px]">$1.00</p>
                    </div>
                </div>
                <div>
                    <p className="font-[600] text-white">0 USDT</p>
                    <p className="text-[#CDCBC8] text-[14px]">$0.00</p>
                </div>
                
                
            </div>
           </div>
        </div>
      </div>
      
    </>
  );
}
