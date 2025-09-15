// import React from 'react'
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../services/store";
import { startMission, updateMissionStatus } from "../../services/redux/user";
import TaskModal from "../../components/modal/TaskModal";
import { IoChevronBackOutline } from "react-icons/io5";

function Singletask() {
  const navigate = useNavigate();
  WebApp.BackButton.show();
  WebApp.BackButton.onClick(() => navigate(-1));
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const slug = params.slug;
  const tasks = useSelector((state: RootState) => state.user.tasks);
  const singleTask = tasks.find((task: any) => task.slug === slug);
  const missions = useSelector((state: any) => state.user.missions);
  const singleMission = missions.find((m: any) => m.slug === slug);
  const [checkFinished, setCheckFinished] = useState(false);
  const [countdown, setCountdown] = useState(30);


  useEffect(() => {
    let timer: any;

    if (countdown > 0 && checkFinished) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      dispatch(updateMissionStatus({ ...singleMission, status: "done" }));
      setCheckFinished(false);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [countdown, checkFinished, dispatch, singleMission]);

  const handleStartMission = () => {
    console.log("tarted");
    WebApp.HapticFeedback.impactOccurred("medium");
    dispatch(startMission({ ...singleTask, status: "progress" }));
    setCheckFinished(false); // Reset countdown to 20 seconds
    WebApp.openLink(singleTask.link);
  };

  const handleEndMission = () => {
    WebApp.HapticFeedback.impactOccurred("medium");
    setOpen(true);
    // dispatch(removeActiveMission(singleMission));
  };

  const showCountdownText = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleCheckTask = () => {
    WebApp.HapticFeedback.impactOccurred("medium");
    setCountdown(30);
    setCheckFinished(true);
  };

  const renderButton = () => {
    if (
      singleMission?.status === "progress" ||
      singleMission?.status === "done"
    ) {
      return (
        <button
          disabled={singleMission && singleMission?.status === "progress"}
          // onClick={()=> dispatch(clearMission())}
          onClick={handleEndMission}
          className="btn w-full text-[#131721] font-[600] text-[18px] p-[16px_16px] rounded-[10px] "
        >
          Complete Mission
        </button>
      );
    } else if (
      singleMission?.status !== "done" &&
      singleMission?.status !== "progress" &&
      singleMission?.status !== "ended"
    ) {
      return (
        <button
          disabled={singleMission && singleMission?.status === "progress"}
          // onClick={()=> dispatch(clearMission())}
          onClick={handleStartMission}
          className="btn w-full text-[#131721] font-[600] text-[18px] p-[16px_16px] rounded-[10px] "
        >
          {singleMission && singleMission?.status === "done"
            ? "Mission Completed"
            : "Start Mission"}
        </button>
      );
    } else if (singleMission?.status === "ended") {
      return (
        <p className="flex items-center justify-center text-green-500">
          Mission Completed!
        </p>
      );
    }
  };

  return (
    <div className="font-inter w-full p-[20px]">
      <div className="flex  items-center justify-between w-full">
        <button onClick={() => navigate(-1)} className="z-20 text-white">
          <IoChevronBackOutline className="text-white text-[20px]" />
        </button>
        <p className="text-white  font-[600] text-[24px] grow ml-[-10%] text-center">
          Task
        </p>
      </div>
      <div className="mt-[20px] w-full flex flex-col items-start space-y-[10px]">
        <p className="font-[600] text-white text-[23px]">{singleTask?.title}</p>
        <p className="text-[#FFFFFF99] text-[12px] font-[600]">
          {singleTask?.description}
        </p>
      </div>

      <div className="task-card bg-[#27334E80] flex items-center p-[10px] rounded-[16px] space-x-[5px] mt-[20px]">
        <img className="w-[56px] h-[50px]" src={singleTask?.icon?.url} alt="" />
        <div>
          <p className="font-[500] text-white">Reward</p>
          <p className="text-[#FFFFFF99] text-[12px]">
            ${singleTask?.points} MARS
          </p>
        </div>
      </div>

      {singleMission && singleMission.status === "progress" && (
        <div className="bg-[#27334E80] p-[15px_10px] rounded-[16px] mt-[40px] flex items-center justify-between">
          {checkFinished ? (
            <p className="font-[500] text-red-500 text-[14px]">
              Are you sure you've done the task?
            </p>
          ) : (
            <p className="font-[500] text-white">{singleTask?.title}</p>
          )}

          <button
            disabled={checkFinished}
            onClick={handleCheckTask}
            className="btn  text-[#131721] font-[600] text-[14px] p-[5px_10px]  rounded-full disabled:bg-[#27334E80] "
          >
            {checkFinished ? showCountdownText() : "Check"}
          </button>
        </div>
      )}

      <div className="w-full mt-[40px]">{renderButton()}</div>
      <TaskModal isOpen={open} setIsOpen={setOpen} data={singleTask} />
    </div>
  );
}

export default Singletask;
