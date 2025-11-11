/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { GoPlus } from "react-icons/go";
import { addSpacesToNumber } from "../../utils";
// import smcoin from "../../assets/img/sm-coin.png";
// import onion from "../../assets/img/onion.png";
import { useCompleteTaskMutation } from "../../services/routes";
import { useDispatch, useSelector } from "react-redux";
import { updateMissionStatus } from "../../services/redux/user";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type MyModalProps = {
  setIsOpen: (string: boolean) => void;
  isOpen: boolean;
  data: any;
};

function TaskModal({ setIsOpen, isOpen, data }: MyModalProps) {
  const navigate = useNavigate();
  const [completeTask, { isLoading }] = useCompleteTaskMutation();
  const dispatch = useDispatch();
  const { username } = useSelector((state: any) => state.user.profile);
  const missions = useSelector((state: any) => state.user.missions);
  const singleMission = missions.find((m: any) => m.slug === data?.slug);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [error, setError] = useState("");

//   console.log(singleMission, "modalmission");
  const handleAction = async () => {
    // Validate URL
    if (!submissionUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(submissionUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    try {
      const reqData = {
        username,
        proofUrl: submissionUrl.trim()
      };
      const slug = data?.slug;
      console.log(slug, reqData);
      const res = await completeTask({ slug, reqData }).unwrap();
      console.log(res);
      dispatch(updateMissionStatus({ ...singleMission, status: "reviewing" }));
      setIsOpen(!isOpen);
      navigate("/tasks");
    } catch (error) {
      console.log(error);
      setIsOpen(!isOpen);
    }
  };
  function close() {
    setIsOpen(false);
    setSubmissionUrl("");
    setError("");
  }
  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={close}
          __demoMode
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full  rounded-[15px] bg-[#131721] p-[20px_20px] ">
                  <div className="w-full items-center justify-end flex mb-[5px]">
                    <button
                      className="flex items-center justify-center"
                      onClick={close}
                    >
                      <GoPlus className="text-white rotate-45 text-[40px]" />
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-[88px] h-[88px]  flex items-center justify-center  rounded-[16px]">
                      <img src={"/circle.png"} alt="" />
                    </div>
                    <p className="text-white font-inter font-[600] text-[24px] mt-[10px]">
                      Submit for Review
                    </p>
                    <p className="text-[#FFFFFF99] font-inter font-[500] text-center text-[12px] mt-[5px]">
                      Submit your task completion URL for admin review
                    </p>
                    <p className="text-[#FFFFFF] font-inter  font-[500] text-center text-[20px] mt-[15px] flex items-center">
                      {/* <img className="h-[36px]" src={smcoin} alt="" /> */}
                      Reward: {addSpacesToNumber(data?.points)} MARP
                    </p>
                  </div>

                  <div className="mt-4 w-full">
                    <div className="mb-4">
                      <input
                        type="url"
                        value={submissionUrl}
                        onChange={(e) => {
                          setSubmissionUrl(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter completion URL (e.g., https://...)"
                        className="w-full h-[50px] rounded-[10px] bg-[#27334E80] text-white font-inter font-[500] text-[14px] px-4 border border-[#27334E] focus:outline-none focus:border-[#4A90E2]"
                      />
                      {error && (
                        <p className="text-red-500 text-[12px] mt-2 font-inter">
                          {error}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleAction}
                      disabled={isLoading || !submissionUrl.trim()}
                      className="btn w-full h-[50px] rounded-[10px] text-[20px] items-center justify-center flex font-[600] text-white font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <svg
                          aria-hidden="true"
                          className="w-[25px] h-[25px] text-gray-200 animate-spin  fill-white"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      ) : (
                        "Submit for Review"
                      )}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default TaskModal;