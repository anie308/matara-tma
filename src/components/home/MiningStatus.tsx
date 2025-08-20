import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { setMiningStatus, setMiningStartDate } from "../../services/redux/user";
import ClaimButton from "./ClaimButton";
import {
  useGetMiningStateQuery,
  useStartMiningMutation,
} from "../../services/routes";

const MINING_RATE_PER_SECOND = 0.0002; // Accurate mining rate
const MINING_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in ms

const MiningStatus = () => {
  const dispatch = useDispatch();
  const miningStatus = useSelector(
    (state: RootState) => state.user.miningStatus
  );
  const miningStartDate = useSelector(
    (state: RootState) => state.user.miningStartDate
  );
  const user = useSelector((state: RootState) => state.user.profile);
  const username = user?.username || "jurstadev";

  const { data, isSuccess } = useGetMiningStateQuery({ username });
  const [startMining, { isLoading }] = useStartMiningMutation();
  // console.log(data, "mining");

  useEffect(() => {
    if (isSuccess) {
      const status = data?.isMining;
      dispatch(setMiningStatus(status));
    }
  }, [dispatch, miningStatus]);

  const [amountMined, setAmountMined] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>("24:00:00");
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const claimMining = async () => {};

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (miningStatus && miningStartDate) {
      const startDateTime = new Date(miningStartDate).getTime();

      const updateMining = () => {
        const now = new Date().getTime();
        const elapsedTimeInSeconds = (now - startDateTime) / 1000;

        // Amount mined based on elapsed time * rate
        const mined = elapsedTimeInSeconds * MINING_RATE_PER_SECOND;
        setAmountMined(mined);

        // Countdown
        const remainingMs = Math.max(
          MINING_DURATION_MS - (now - startDateTime),
          0
        );
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );

        // Stop after 24 hrs
        if (remainingMs <= 0) {
          setCanClaim(true);
          clearInterval(interval);
          dispatch(setMiningStatus(false));
          dispatch(setMiningStartDate(null));
        }
      };

      updateMining(); // run immediately
      interval = setInterval(updateMining, 1000);
    } else {
      setAmountMined(0);
      setTimeLeft("24:00:00");
    }

    return () => clearInterval(interval);
  }, [miningStatus, miningStartDate, dispatch]);

  const toggleMining = async () => {
    try {
      const res = await startMining({ username }).unwrap();
      const miningDate = res?.data?.miningStartedAt;
      const isMining = res?.data?.isMining;
      console.log(miningDate, isMining);
      dispatch(setMiningStartDate(new Date(miningDate).toISOString()));
      dispatch(setMiningStatus(true));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-full">
      <div className="flex flex-col items-center py-8">
        <div className="flex items-center justify-center space-x-5">
          <div>
            <p className="text-green-400 text-xs">Mining Mode</p>
            <p className="font-black text-2xl text-white leading-tight">
              {amountMined.toFixed(3)} <br />
              $MAT
            </p>
          </div>
          <div>
            {miningStatus ? (
              <img src="/earn-up.svg" alt="Earning up" />
            ) : (
              <img src="/earn-down.svg" alt="Earning down" />
            )}
          </div>
          <div>
            <p className="text-yellow-400 text-xs">Earning Rate</p>
            <p className="font-black text-2xl text-white leading-tight">
              {MINING_RATE_PER_SECOND}
            </p>
            <p className="text-white font-semibold text-sm">$MAT/Sec</p>
          </div>
        </div>
        {miningStatus && (
          <p className="mt-4 text-white">
            <span className="text-yellow-500">Mining Resets</span> in {timeLeft}
          </p>
        )}
      </div>
      <ClaimButton
        loading={isLoading}
        disabled={canClaim} // true = ready to claim
        miningStatus={miningStatus}
        action={claimMining} // claim action
        start={toggleMining} // start action
      />
    </div>
  );
};

export default MiningStatus;
