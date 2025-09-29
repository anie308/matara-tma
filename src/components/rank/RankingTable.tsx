import { useSelector } from "react-redux";
import { RootState } from "../../services/store";



export const ranks = [
  { name: "Cub Recruit", min: 0, max: 99, icon: "./recriut.png" },
  { name: "Scout", min: 100, max: 999, icon: "./scout.png" },
  { name: "Warrior", min: 1000, max: 9999, icon: "./warrior.png" },
  { name: "Sergeant", min: 10000, max: 99999, icon: "./sergeant.png" },
  { name: "Captain", min: 100000, max: 999999, icon: "./captain.png" },
  { name: "Lieutenant", min: 1000000, max: 9999999, icon: "./lutenantt.png" },
  { name: "Commander", min: 10000000, max: 99999999, icon: "./commander.png" },
  { name: "General", min: 100000000, max: 999999999, icon: "./general.png" },
  {
    name: "Field Marshal",
    min: 1000000000,
    max: 9999999999,
    icon: "./field.png",
  },
  {
    name: "Champion of Matara",
    min: 10000000000,
    max: Infinity,
    icon: "./champion.png",
  },
];

const RankingTable = () => {
  const leaderboard = useSelector((state: RootState) => state.user.leaderBoard);

  return (
    <div className="w-full mt-10">
      <div className="relative overflow-y-auto max-h-[500px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-[#1a1a1a] text-[14px] text-white border-b border-[#CDCBC8]">
            <tr>
              <th scope="col" className="px-3 text-[12px] py-3">
                User Name
              </th>
              <th scope="col" className="px-3 text-[12px] py-3">
                Rank
              </th>
              <th scope="col" className="px-3 text-[12px] py-3">
                Earnings
              </th>
            </tr>
          </thead>
          <tbody>
           {leaderboard.map((user, index) => {
              const currentRank =
                ranks.find(
                  (rank) => user.points >= rank.min && user.points <= rank.max
                ) || ranks[0];

              return (
                <tr key={index} className="text-sm">
                  <th
                    scope="row"
                    className="px-3 text-[12px] py-4 font-medium whitespace-nowrap text-center text-gray-300"
                  >
                    {user.user.username}
                  </th>
                  <td className="px-3 text-[12px] py-4 text-center text-gray-300 flex items-center justify-center gap-2">
                    <img src={currentRank.icon} alt={currentRank.name} className="w-4 h-4" />
                    {currentRank.name}
                  </td>
                  <td className="px-3 text-[12px] py-4 text-center text-green-400">
                  {Math.round(user.points)} MARS
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
