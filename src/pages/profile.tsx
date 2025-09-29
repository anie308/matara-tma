import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../services/store";
import { ranks } from "./matara-rank";

function Profile() {
  WebApp.BackButton.show();

  const referralList = useSelector((state: RootState) => state.user.referrals);
  const user = useSelector((state: RootState) => state.user.profile);
  const userPoints = user?.points || 0;
  const currentRank =
    ranks.find((rank) => userPoints >= rank.min && userPoints <= rank.max) ||
    ranks[0];
  const navigate = useNavigate();

  useEffect(() => {
    WebApp.BackButton.onClick(() => navigate(-1));
  }, [WebApp, navigate]);

  const username = user?.username;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-x-[10px] mt-[20px]">
        <div className="h-[70px] w-[70px] rounded-full border-[#44F58E] overflow-hidden border-[3px]">
          <img
            src={user?.profilePicture || "/circle.png"}
            className="h-full w-full object-cover"
            alt=""
          />
        </div>
        <div>
          <div className="flex items-center space-x-[10px]">
            <p className="text-[#CDCBC8]">@{username}</p>
            <img src={"./warrior.svg"} className="h-[30px]" alt="" />
          </div>
        </div>
      </div>

      {/* Rank / Points */}
      <div className="coin-bnt mt-[40px] font-[900]  border-[#44F58E] border p-[5px_15px] rounded-[8px] flex items-center space-x-[5px]">
        <p className="gradient-text text-[12px]">{user?.points} MARS</p>
        <img src="./warrior.svg" className="h-[30px]" alt="" />
        <p className="gradient-text text-[12px]">{currentRank.name}</p>
      </div>

      <p className="text-[17px] my-[20px] font-[800] text-[#FFB948]">
        My Earnings
      </p>

      {/* Referrals Section */}
      <div className="w-full mt-[20px] px-[20px]">
        <div className="relative overflow-y-auto max-h-[400px]">
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
                <tr key={idx} className="text-[14px] border-b border-[#2A2A2A]">
                  <td className="px-6 py-4 text-center text-white">
                    @{ref.username}
                  </td>
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

export default Profile;
