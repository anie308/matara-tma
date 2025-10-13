import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../services/store'
import { useState } from 'react';
import { clearTransaction } from '../services/redux/transaction';
import { toast } from 'react-hot-toast';

function Send() {
    const navigate = useNavigate();
    const transaction = useSelector((state: RootState) => state.transaction);
    const dispatch = useDispatch();
    const [amount, setAmount] = useState("0");
    const handleSend = async()=> {
        const data = {
            token: transaction.token,
            address: transaction.address,
            amount: parseFloat(amount),
            network: transaction.network,
            icon: transaction.icon
        }
        console.log(data);
        dispatch(clearTransaction())
        navigate("/")
        toast.success("Transaction sent successfully")
    }
    return (
        <div className="h-full  flex-col items-center justify-center w-full py-[20px]">
            <div className="flex items-center justify-between border-b border-gray-500 px-[20px] pb-[20px]">
                <button onClick={() => navigate(-1)} className="p-[5px] rounded-full z-20 border border-[#44F58E] bg-black">
                    <ChevronLeft color="#44F58E" />
                </button>
                <p className="flex-1 text-center text-[25px] font-[600] gradient-text ml-[-30px]">Send</p>
            </div>
            <div className="flex flex-col items-center justify-center w-full gap-[10px] mt-[20px] p-[20px]">

                <div className="flex items-center justify-between w-full border border-gray-500 p-[10px] rounded-[10px]">
                    <div className="flex items-center gap-[10px]">
                        <img src={transaction.icon} alt={transaction.token} className="w-[40px] h-[40px]  border-[5px] border-[#D9D9D91F] rounded-full" />
                        <p className="text-white font-[600]">{transaction.token}</p>
                    </div>
                </div>
                <div className="flex flex-col w-full gap-[10px]">
                    <p className="text-white font-[600]">Amount</p>
                    <input type="number" className="w-full border border-gray-500 bg-transparent text-white p-[15px_10px] rounded-[10px]" value={amount} onChange={(e)=> setAmount(e.target.value)} />
                </div>

                <button onClick={handleSend} className="btn p-[13px_10px] text-[18px] font-[600] w-full mt-[20px] rounded-[10px]">
                    Send
                </button>


            </div>
        </div>
    )
}

export default Send