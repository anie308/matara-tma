
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../services/store";

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

function MataraRank() {
  const user = useSelector((state: RootState) => state.user.profile);
  const userPoints = user?.points || 0;

  // find current rank
  const currentRank =
    ranks.find((rank) => userPoints >= rank.min && userPoints <= rank.max) ||
    ranks[0];

  // find index of current rank in ranks array (for carousel starting point)
  const currentRankIndex = ranks.findIndex(
    (rank) => rank.name === currentRank.name
  );

  const [index, setIndex] = useState(currentRankIndex);
  const [direction, setDirection] = useState(0);

  const nextRank = () => {
    if (index < ranks.length - 1) {
      setDirection(1);
      setIndex((prev) => prev + 1);
    }
  };

  const prevRank = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-full w-full px-[10px]">
      <div className="flex min-h-full items-center justify-center mt-[100px] space-x-[10px] w-full">
        {index > 0 && ( // Show previous button only if not the first item
          <div onClick={prevRank}>
            <CircleChevronLeft size={40} className="text-[#44F58E]" />
          </div>
        )}
        <motion.div
          key={ranks[index].name}
          initial={{ x: direction === 1 ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: direction === 1 ? "-100%" : "100%", opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="font-[900] w-[70%] flex-col justify-center rounded-[8px] flex items-center"
        >
          <div className="flex flex-col items-center justify-center w-full">
            <img
              className="h-[150px]"
              src={ranks[index].icon}
              alt={ranks[index].name}
            />

            <div className="mt-[20px] flex flex-col items-center justify-center w-full">
              <p className="font-[900] text-[30px] gradient-text text-center leading-[35px]">
                {ranks[index].name}
              </p>
              <p className="text-[#CDCBC8] text-[22px] text-center leading-[26px] mt-[5px] font-[400] w-[70%]">
                {ranks[index].min.toLocaleString()} -{" "}
                {ranks[index].max === Infinity
                  ? "+"
                  : ranks[index].max.toLocaleString()}{" "}
                $MARP
              </p>
            </div>
          </div>
        </motion.div>
        {index < ranks.length - 1 && ( // Show next button only if not the last item
          <div onClick={nextRank}>
            <CircleChevronRight size={40} className="text-[#44F58E]" />
          </div>
        )}
      </div>

      <div className="w-full flex mt-[40%] items-center flex-col justify-center space-y-[10px]">
        <p className="text-[#CDCBC8] text-[14px]">
          Your Current $MARP and Rank
        </p>
        <div className="coin-bnt font-[900] w-[70%] justify-center border-[#44F58E] border p-[5px_15px] rounded-[8px] flex items-center space-x-[5px]">
          <p className="gradient-text text-[14px]">
            {userPoints.toLocaleString()} MARP
          </p>
          <img src={currentRank.icon} className="h-[30px]" alt="" />
          <p className="gradient-text text-[14px]">{currentRank.name}</p>
        </div>
      </div>
    </div>
  );
}

export default MataraRank;
