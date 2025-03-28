// import React from 'react'

import { CircleChevronLeft, CircleChevronRight } from "lucide-react"
import { useState } from "react";
import { motion } from "framer-motion";

function MataraRank() {

  const ranks = [
    { name: "Cub Recruit", mat: "0 - 99", icon: "./recriut.png" },
    { name: "Scout", mat: '100 - 999', icon: "./scout.png" },
    { name: "Warrior", mat: '1,000 - 9,999', icon: "./warrior.png" },
    { name: "Sergeant", mat: '10,000 - 99,999', icon: "./sergeant.png" },
    { name: "Captain", mat: '100,000 - 999,999', icon: "./captain.png" },
    { name: "Lieutenant", mat: '1,000,000 - 9,999,999', icon: "./lutenantt.png" },
    { name: "Commander", mat: '10,000,000 - 99,999,999', icon: "./commander.png" },
    { name: "General", mat: '100,000,000+', icon: "./general.png" },
    { name: "Field Marshal", mat: '1,000,000,000+', icon: "./field.png" },
    { name: "Champion of Matara", mat: '10,000,000,000+', icon: "./champion.png" },
  ];

  const [index, setIndex] = useState(1); // Default to Warrior
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

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
    <div className="flex flex-col items-center justify-between min-h-full  w-full px-[10px]">
      <div className="flex min-h-full items-center justify-center mt-[100px] space-x-[10px] w-full">
        <div  onClick={prevRank}><CircleChevronLeft size={40} className="text-[#44F58E]" /></div>
        <motion.div
          key={ranks[index].name} // This ensures Framer Motion detects changes
          initial={{ x: direction === 1 ? "100%" : "-100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: direction === 1 ? "-100%" : "100%", opacity: 0 }}
              transition={{ duration: 0.6 }}
          className="font-[900] w-[70%] flex-col  justify-center  rounded-[8px] flex items-center space-x-[5px]"
        >
          <div className="flex flex-col items-center justify-center w-full">
            <img className="h-[150px]" src={ranks[index].icon} alt="" />

            <div className="mt-[20px] flex flex-col items-center justify-center w-full">
              <p className="font-[900] text-[30px] gradient-text text-center leading-[35px]">{ranks[index].name}</p>
              <p className="text-[#CDCBC8] text-[22px] text-center leading-[26px] mt-[5px] font-[400]  w-[70%]">{ranks[index].mat}  $MAT</p>
            </div>

          </div>
         
        </motion.div>
        <div  onClick={nextRank}><CircleChevronRight size={40} className="text-[#44F58E]" /></div>
      </div>

      <div className="w-full flex mt-[40%] items-center flex-col justify-center space-y-[10px]">
        <p className="text-[#CDCBC8] text-[14px]">Your Current $MAT and Rank</p>
        <div className="coin-bnt  font-[900] w-[70%] justify-center border-[#44F58E] border p-[5px_15px] rounded-[8px] flex items-center space-x-[5px]">
          <p className="gradient-text text-[14px]">0 MAT</p>
          <img src="./warrior.svg" className="h-[30px]" alt="" />
          <p className="gradient-text text-[14px]">CUB RECRUIT</p>
        </div>
      </div>

    </div>
  )
}

export default MataraRank
