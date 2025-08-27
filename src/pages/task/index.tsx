// import React from 'react'

import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
function Task() {
  WebApp.BackButton.hide();
  const navigate = useNavigate()

  return (
    <div className="text-white flex w-full px-[10px] items-center flex-col justify-center">
      <p className="text-[#FFB948] font-[900] text-[35px] mt-[20px]">
        Social Task
      </p>
      <p className="text-[15px] text-center text-white font-[500] w-[90%]">
        Perform Social Tasks to earn more Matara Tokens ($MAT) and grow your
        rank.
      </p>

      <div className="w-full mt-[40px]">
        <div className="relative w-full p-[10px]">
          <p className="text-[20px] font-[600] text-white">Tasks</p>
          <div className="mt-[20px] grid grid-cols-1">
            <button onClick={()=> navigate(`/tasks/${"123"}`)} className="border-[#FFD683] border p-[15px] rounded-[10px] w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-[10px]">
                <div className="h-[50px] w-[50px] rounded-full  border"></div>
                <p className="text-[18px] font-[500]">Task title</p>
              </div>
              <div className="flex items-center space-x-[10px]">
                <p>10 $MAT</p>
                 <FaCircleCheck size={20}  className="text-[#40D8A1] "/>
                 {/* {task.completed && (
                  <FaCircleCheck  className="text-[#40D8A1] mr-[10px]"/>
                )} */}
              </div>
              </div>
              <div className="text-start text-white text-[14px] mt-[10px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
                reiciendis nisi ratione vero suscipit maxime ipsum
                exercitationem repudiandae
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
