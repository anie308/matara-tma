


import WebApp from "@twa-dev/sdk";
import { Copy } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../services/store";
import { useState } from "react";
import toast from "react-hot-toast";

function Referral() {
  WebApp.BackButton.hide();
  const user = useSelector((state: RootState) => state.user.profile);
  const referralList = useSelector((state: RootState) => state.user.referrals);

  const referralLink = `https://t.me/MataraComBot?start=${user?.referralCode}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copied successfully");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="text-white flex px-[10px] items-center flex-col justify-center">
      <p className="text-[#FFB948] font-[900] text-[35px] mt-[20px]">
        Referrals
      </p>

      {/* Invite button */}
      <div className="flex-col w-full mt-[20px] flex items-center justify-center space-y-[10px]">
        <button
          onClick={handleCopy}
          className="coin-btn border-[#44F58E] text-white border-[2px] rounded-[8px] justify-center p-[8px_25px] w-[80%] flex items-center space-x-[10px]"
        >
          <span className="font-[900] text-[18px]">
            {copied ? "Copied!" : "Invite Friends"}
          </span>
          <Copy />
        </button>
      </div>

      {/* Referrals Table */}
      <div className="w-full mt-[20px] px-[10px]">
        <div className="relative overflow-y-auto max-h-[300px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#1a1a1a] text-[14px] text-white border-b border-[#CDCBC8]">
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
              {referralList.map((ref: any, idx: number) => (
                <tr
                  key={idx}
                  className="text-[14px] border-b border-[#2A2A2A]"
                >
                  <td className="px-6 py-4 text-center">@{ref.username}</td>
                  <td className="px-6 py-4 text-center text-[#44F58E]">
                    +50 $MARS
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Referral;
