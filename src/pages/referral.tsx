// import React from 'react'

import WebApp from "@twa-dev/sdk";
import { Copy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/store";
import { useGetReferralsQuery } from "../services/routes";
import { useEffect, useState } from "react";
import { setReferrals } from "../services/redux/user";
import toast from "react-hot-toast";

function Referral() {
  WebApp.BackButton.hide();
  const user = useSelector((state: RootState) => state.user.profile);
  const referralList = useSelector((state: RootState) => state.user.referrals);

  const referralLink = `https://example.com/ref/${user?.referralCode}`;

  const [copied, setCopied] = useState(false);

  const username = user?.username || "jurstadev";
  const { data, isSuccess } = useGetReferralsQuery({ username });
  const dispatch = useDispatch();
  const referrals = data?.data;

  useEffect(() => {
    if (isSuccess) {
      dispatch(setReferrals(referrals || []));
    }
  }, [isSuccess, referrals, dispatch]);

   const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copied successfully")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="text-white flex px-[10px] items-center flex-col justify-center">
      <p className="text-[#FFB948] font-[900] text-[35px] mt-[20px]">
        Referrals
      </p>

      <div className="flex-col w-full mt-[20px] flex items-center justify-center space-y-[10px]">
        <button
          onClick={handleCopy}
          className="coin-btn border-[#44F58E] text-white border-[2px] rounded-[8px]  justify-center  p-[8px_25px] w-[80%] flex items-center space-x-[10px]"
        >
          <span className="font-[900] text-[18px]"> {copied ? "Copied!" : "Invite Friends"}</span>
          <Copy />
        </button>

        {/* <button className="btn  text-black  rounded-[8px]  p-[8px_25px] w-[80%] flex items-center space-x-[10px] justify-center">
          <span className="font-[900] text-[18px]">Share to story </span>
        </button>

        <p className="text-[15px] text-center text-white font-[500]">
          Share story to earn more Matara <br /> Tokens ($MAT)
        </p> */}
      </div>

       <div className="w-full mt-[20px]">
        <div className="relative overflow-x-auto">
          {referralList.length === 0 ? (
            <p className="text-center text-gray-400 py-6">
              You don’t have any referrals yet. <br /> Share your link to start earning!
            </p>
          ) : (
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
                {referralList.map((ref: any, idx: number) => (
                  <tr
                    key={idx}
                    className="text-[14px] border-b border-[#2A2A2A]"
                  >
                    <td className="px-6 py-4 text-center">
                      @{ref.username}
                    </td>
                    <td className="px-6 py-4 text-center text-[#44F58E]">
                      +${ref.earnings} $MAT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>

      {/* <div className="w-full mt-[20px]">
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
              <tr className="text-[14px]">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap text-center "
                >
                  @jurstadev
                </th>
                <td className="px-6 py-4 text-center text-[#44F58E]">
                  +$2.5 $MAT
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}


    </div>
  );
}

export default Referral;
