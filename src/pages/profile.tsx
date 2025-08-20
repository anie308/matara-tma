import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../services/store";
import { useGetReferralsQuery } from "../services/routes";
import { setReferrals } from "../services/redux/user";
import { ranks } from "./matara-rank";

function Profile() {
  WebApp.BackButton.show();

  const referralList = useSelector((state: RootState) => state.user.referrals);
  const user = useSelector((state: RootState) => state.user.profile);
    const userPoints = user?.points || 0;
    console.log(user)
    const currentRank = ranks.find(
        (rank) => userPoints >= rank.min && userPoints <= rank.max
      ) || ranks[0];
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    WebApp.BackButton.onClick(() => navigate(-1));
  }, [WebApp, navigate]);

  const username = user?.username || "jurstadev";
  const { data, isSuccess, isLoading, isError } = useGetReferralsQuery({ username });
  const dispatch = useDispatch();
  const referrals = data?.data;

  useEffect(() => {
    if (isSuccess) {
      dispatch(setReferrals(referrals || []));
    }
  }, [isSuccess, referrals, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-x-[10px] mt-[20px]">
        <div className="h-[70px] w-[70px] rounded-full border-[#44F58E] overflow-hidden border-[3px]">
          <img
            src={user?.profilePicture || "https://avatar.iran.liara.run/public/boy"}
            className="h-full w-full object-cover"
            alt=""
          />
        </div>
        <div>
          <div className="flex items-center space-x-[10px]">
            <p className="text-[#CDCBC8]">@{username}</p>
            <img src="./warrior.svg" className="h-[30px]" alt="" />
          </div>
        </div>
      </div>

      {/* Rank / Points */}
      <div className="coin-bnt mt-[40px] font-[900]  border-[#44F58E] border p-[5px_15px] rounded-[8px] flex items-center space-x-[5px]">
        <p className="gradient-text text-[12px]">{user?.points} MAT</p>
        <img src="./warrior.svg" className="h-[30px]" alt="" />
        <p className="gradient-text text-[12px]">{currentRank.name}</p>
      </div>

      <p className="text-[17px] my-[20px] font-[800] text-[#FFB948]">
        My Earnings
      </p>

      {/* Referrals Section */}
      <div className="w-full mt-[40px] px-[20px]">
        <div className="relative overflow-x-auto">
          {isLoading ? (
            // 🔄 Loading state
            <p className="text-center text-gray-400 py-6 animate-pulse">
              Loading referrals...
            </p>
          ) : isError ? (
            // ❌ Error state
            <p className="text-center text-red-400 py-6">
              Failed to load referrals. Please try again.
            </p>
          ) : referralList.length === 0 ? (
            // ℹ️ Empty state
            <p className="text-center text-gray-400 py-6">
              You don’t have any referrals yet. <br /> Share your link to start earning!
            </p>
          ) : (
            // ✅ Data table
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
                    <td className="px-6 py-4 text-center">@{ref.username}</td>
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
    </div>
  );
}

export default Profile;
