// import React from 'react'

import { CircleChevronLeft, CircleChevronRight } from "lucide-react"
import { useState } from "react";
import { motion } from "framer-motion";

function MataraRank() {

  const ranks = [
    { name: "Cub Recruit", mat: "0 - 99", icon: "./recriut.png" },
    { name: "Scout", mat: '100 - 999', icon: "./warrior.svg" },
    { name: "MASTER", mat: 5000, icon: "./master.svg" },
  ];

  const [index, setIndex] = useState(1); // Default to Warrior
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextRank = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % ranks.length);
  };

  const prevRank = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + ranks.length) % ranks.length);
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
              transition={{ duration: 0.5 }}
          className="font-[900] w-[70%] flex-col  justify-center  rounded-[8px] flex items-center space-x-[5px]"
        >
          <div className="flex flex-col items-center justify-center">
            <img className="h-[150px]" src={ranks[index].icon} alt="" />

            <div className="mt-[20px] flex flex-col items-center justify-center">
              <p className="font-[900] text-[28px] gradient-text">{ranks[index].name}</p>
              <p className="text-[#CDCBC8] text-[22px] font-[400]">{ranks[index].mat} $MAT</p>
            </div>

          </div>
          {/* <p className="gradient-text text-[14px]">{ranks[index].mat} MAT</p>
          <img src={ranks[index].icon} className="h-[30px]" alt={ranks[index].name} />
          <p className="gradient-text text-[14px]">{ranks[index].name}</p> */}
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
