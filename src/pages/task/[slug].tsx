// import React from 'react'
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// import { RootState } from "../../services/store";
// import { startMission, updateMissionStatus } from "../../services/redux/user";

function Singletask() {
     const navigate = useNavigate();
  WebApp.BackButton.show();
  WebApp.BackButton.onClick(()=> navigate(-1));
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const slug = params.slug;
  //  const tasks = useSelector((state: RootState) => state.user.tasks);
  // const singleTask = tasks.find((task: any) => task.slug === slug);
  const missions = useSelector((state: any) => state.user.missions);
  const singleMission = missions.find((m: any) => m.slug === slug);
  const [checkFinished, setCheckFinished] = useState(false);
  const [countdown, setCountdown] = useState(30);

  console.log(singleMission);

  useEffect(() => {
    let timer: any;

    if (countdown > 0 && checkFinished) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // dispatch(updateMissionStatus({ ...singleMission, status: "done" }));
      setCheckFinished(false);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [countdown, checkFinished, dispatch, singleMission]);

  // const handleStartMission = () => {
  //   console.log("tarted");
  //   WebApp.HapticFeedback.impactOccurred("medium");
  //   dispatch(startMission({ ...singleTask, status: "progress" }));
  //   setCheckFinished(false); // Reset countdown to 20 seconds
  //   WebApp.openLink(singleTask.link);
  // };

  // const handleEndMission = () => {
  //   WebApp.HapticFeedback.impactOccurred("medium");
  //   setOpen(true);
  //   // dispatch(removeActiveMission(singleMission));
  // };

  // const showCountdownText = () => {
  //   const minutes = Math.floor(countdown / 60);
  //   const seconds = countdown % 60;
  //   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  // };

  // const handleCheckTask = () => {
  //   WebApp.HapticFeedback.impactOccurred("medium");
  //   setCountdown(30);
  //   setCheckFinished(true);
  // };




  return (
    <div className="text-white flex w-full px-[10px] items-center flex-col justify-center">Singletask</div>
  )
}

export default Singletask