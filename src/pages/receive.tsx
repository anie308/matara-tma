// import React from 'react'

import { ChevronLeft, Copy, TriangleAlert } from "lucide-react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { RootState } from "../services/store";
import { QRCodeSVG } from 'qrcode.react';
import { toast } from "react-hot-toast";
import { useBackendWallet } from "../hooks/useBackendWallet";

function Receive() {
    const navigate = useNavigate();
    const transaction = useSelector((state: RootState) => state.transaction);
    const { address } = useBackendWallet();
    
    // Use your actual wallet address instead of transaction.address
    const walletAddress = address || "0x29dA601410A3b7886F2D752098089b62f21202ab";
    
    console.log('Transaction:', transaction);
    console.log('Wallet Address:', walletAddress);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(walletAddress);
        toast.success("Address copied to clipboard");
    }

    const handleShare = async () => {
        await navigator.clipboard.writeText(walletAddress);
        toast.success("Address shared");
    }

    return (
        <div className="h-full p-[20px] flex-col  items-center justify-center w-full ">
            <div className="flex items-center justify-between border-b border-gray-500 pb-[20px]">
                <button onClick={() => navigate(-1)} className="p-[5px] z-20 rounded-full border border-[#44F58E] bg-black">
                    <ChevronLeft color="#44F58E" />
                </button>
                <p className="flex-1 text-center text-[25px] font-[600] gradient-text ml-[-30px]">Recieve {transaction.token}</p>
            </div>

            <div className="flex flex-col w-full  justify-center items-center mt-[20px] self-center gap-[20px]">
                <div className="border flex items-center p-[10px] space-x-[10px] bg-[#FFB94821] w-[90%]">
                    <TriangleAlert size={35} className="text-[#FFB948] text-[20px]" />

                    <p className="text-[#FFB948] font-[500] text-[14px]">This is your BSC wallet address. You can receive {transaction.token} and all other BSC tokens here</p>
                </div>
                <div className="w-[60%] bg-white h-[240px] flex items-center justify-center p-[10px] rounded-[10px]">
                    <QRCodeSVG value={walletAddress} size={200} />
                </div>
                <div className="flex items-center flex-col justify-center px-[20px] w-full">
                    <p className="gradient-text text-center text-wrap break-all">{walletAddress}</p>
                    <button className="mt-[10px]" onClick={handleCopy}>
                        <Copy className="text-white text-[20px]" />
                    </button>
                    <button className="w-full mt-[20px] btn p-[10px] font-[500] text-[18px] rounded-[10px]" onClick={handleShare}>
                        Share Address
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Receive