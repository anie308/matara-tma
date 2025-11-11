// import React from 'react'
import WebApp from "@twa-dev/sdk";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../services/store";
import { startMission } from "../../services/redux/user";
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

  const handleStartMission = () => {
    console.log("started");
    WebApp.HapticFeedback.impactOccurred("medium");
    // Create or update mission with progress status
    const missionData = {
      ...singleTask,
      status: "progress",
      _id: singleTask._id || singleTask.slug,
      slug: singleTask.slug,
    };
    dispatch(startMission(missionData));
    if (singleTask.link) {
      WebApp.openLink(singleTask.link);
    }
  };

  const handleEndMission = () => {
    WebApp.HapticFeedback.impactOccurred("medium");
    setOpen(true);
  };

  const renderButton = () => {
    // Rejected status - allow resubmission
    if (singleMission?.status === "rejected") {
      return (
        <button
          onClick={handleEndMission}
          className="btn w-full text-[#131721] font-[600] text-[18px] p-[16px_16px] rounded-[10px]"
        >
          Resubmit Task
        </button>
      );
    }
    
    // Approved status - disable button
    if (singleMission?.status === "approved") {
      return (
        <button
          disabled
          className="btn w-full text-[#131721] font-[600] text-[18px] p-[16px_16px] rounded-[10px] opacity-50 cursor-not-allowed"
        >
          Task Approved
        </button>
      );
    }

    // Reviewing status - disable button
    if (singleMission?.status === "reviewing") {
      return (
        <button
          disabled
          className="btn w-full text-[#131721] font-[600] text-[18px] p-[16px_16px] rounded-[10px] opacity-50 cursor-not-allowed"
        >
          Under Review
        </button>
      );
    }

    // Progress or done status - show complete button (opens modal)
    if (
      singleMission?.status === "progress" ||
      singleMission?.status === "complete"
    ) {
      return (
        <button
          onClick={handleEndMission}
          className="btn w-full text-[#131721] font-[600] text-[18px] p-[16px_16px] rounded-[10px]"
        >
          Complete Mission
        </button>
      );
    }

    // Pending status - show message
    if (singleMission?.status === "pending") {
      return (
        <p className="flex items-center justify-center text-yellow-500">
          Submitted for Review - Awaiting Admin Approval
        </p>
      );
    }

    // Ended status - show message
    if (singleMission?.status === "ended") {
      return (
        <p className="flex items-center justify-center text-green-500">
          Mission Completed!
        </p>
      );
    }

    // Default: No mission started yet - show start button
    // Disable if there's a mission with progress status (shouldn't happen, but safety check)
    return (
      <button
        disabled={singleMission?.status === "progress"}
        onClick={handleStartMission}
        className="btn w-full text-[#131721] font-[600] text-[18px] p-[16px_16px] rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Mission
      </button>
    );
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
        <p className="font-[600] text-white text-[20px]">{singleTask?.title}</p>
        <p className="text-[#FFFFFF99] text-[12px] font-[600]">
          {singleTask?.description}
        </p>
      </div>

      <div className="task-card bg-[#27334E80] flex items-center p-[10px] rounded-[16px] space-x-[5px] mt-[20px]">
        <img className="w-[56px] h-[56px] rounded-full object-cover" src={singleTask?.icon?.url} alt="" />
        <div>
          <p className="font-[500] text-white">Reward</p>
          <p className="text-[#FFFFFF99] text-[12px]">
            ${singleTask?.points} MARP
          </p>
        </div>
      </div>

      {/* Rejection Status and Reason */}
      {singleMission?.status === "rejected" && (
        <div className="bg-[#FF4444]/20 border border-[#FF4444] rounded-[16px] p-[15px] mt-[20px]">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[#FF4444] font-[600] text-[16px]">Task Rejected</p>
            <span className="px-2 py-1 rounded-full text-xs font-[500] bg-[#FF4444]/30 text-[#FF4444] border border-[#FF4444]">
              Rejected
            </span>
          </div>
          {singleMission?.rejectionReason && (
            <div className="mt-2">
              <p className="text-[#FFFFFF99] text-[12px] font-[500] mb-1">Reason:</p>
              <p className="text-white text-[14px] font-[500]">
                {singleMission.rejectionReason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Approved Status */}
      {singleMission?.status === "approved" && (
        <div className="bg-[#40D8A1]/20 border border-[#40D8A1] rounded-[16px] p-[15px] mt-[20px]">
          <div className="flex items-center gap-2">
            <p className="text-[#40D8A1] font-[600] text-[16px]">Task Approved</p>
            <span className="px-2 py-1 rounded-full text-xs font-[500] bg-[#40D8A1]/30 text-[#40D8A1] border border-[#40D8A1]">
              Approved
            </span>
          </div>
        </div>
      )}

      {/* Reviewing Status */}
      {singleMission?.status === "reviewing" && (
        <div className="bg-[#FFB948]/20 border border-[#FFB948] rounded-[16px] p-[15px] mt-[20px]">
          <div className="flex items-center gap-2">
            <p className="text-[#FFB948] font-[600] text-[16px]">Under Review</p>
            <span className="px-2 py-1 rounded-full text-xs font-[500] bg-[#FFB948]/30 text-[#FFB948] border border-[#FFB948]">
              Reviewing
            </span>
          </div>
        </div>
      )}

      <div className="w-full mt-[40px]">{renderButton()}</div>
      <TaskModal isOpen={open} setIsOpen={setOpen} data={singleTask} />
    </div>
  );
}

export default Singletask;
