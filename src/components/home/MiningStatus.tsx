

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { setMiningStatus, setMiningStartDate } from "../../services/redux/user";
import ClaimButton from "./ClaimButton";
import {
  useClaimMiningMutation,
  useGetMiningStateQuery,
  useStartMiningMutation,
} from "../../services/routes";

const MINING_RATE_PER_SECOND = 0.0002; // tokens per second
const MINING_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const MiningStatus = () => {
  const dispatch = useDispatch();
  const miningStatus = useSelector((state: RootState) => state?.user?.miningStatus);
  const miningStartDate = useSelector((state: RootState) => state?.user?.miningStartDate);
  const user = useSelector((state: RootState) => state.user.profile);
  const username = user?.username || "jurstadev";

  const { data, isSuccess } = useGetMiningStateQuery({ username });
  const [startMining, { isLoading }] = useStartMiningMutation();
  const [claimMine, { isLoading: claimLoad }] = useClaimMiningMutation();

  const [amountMined, setAmountMined] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>("24:00:00");
  const [canClaim, setCanClaim] = useState<boolean>(false);

  // ✅ Sync mining state from backend on load
  useEffect(() => {
    if (isSuccess) {
      const status = data?.isMining;
      if (status) {
        const miningStartedAt = data?.miningStartedAt;
        dispatch(setMiningStatus(status));
        dispatch(setMiningStartDate(new Date(miningStartedAt).toISOString()));
      }
    }
  }, [dispatch, isSuccess, data]);

  // ✅ Mining timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (miningStatus && miningStartDate) {
      const startDateTime = new Date(miningStartDate).getTime();

      const updateMining = () => {
        const now = new Date().getTime();
        const elapsedTimeMs = now - startDateTime;

        if (elapsedTimeMs >= MINING_DURATION_MS) {
          // Freeze mining rewards at max after 24 hrs
          const maxMined = (MINING_DURATION_MS / 1000) * MINING_RATE_PER_SECOND;
          setAmountMined(maxMined);
          setTimeLeft("00:00:00");
          setCanClaim(true);

          clearInterval(interval);
          dispatch(setMiningStatus(false)); // mark as stopped
          // ⚠️ Keep miningStartDate intact until claim!
          return;
        }

        // Still mining — keep updating
        const elapsedSeconds = elapsedTimeMs / 1000;
        setAmountMined(elapsedSeconds * MINING_RATE_PER_SECOND);

        // Countdown
        const remainingMs = MINING_DURATION_MS - elapsedTimeMs;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      };

      updateMining(); // run immediately
      interval = setInterval(updateMining, 1000);
    } else if (!miningStatus && amountMined > 0) {
      // Mining ended but rewards are preserved
      setCanClaim(true);
    } else {
      // Default state
      setAmountMined(0);
      setTimeLeft("24:00:00");
      setCanClaim(false);
    }

    return () => clearInterval(interval);
  }, [miningStatus, miningStartDate, dispatch]);

  // ✅ Start mining
  const toggleMining = async () => {
    try {
      const res = await startMining({ username }).unwrap();
      const miningDate = res?.data?.miningStartedAt;
      dispatch(setMiningStartDate(new Date(miningDate).toISOString()));
      dispatch(setMiningStatus(true));
      setAmountMined(0);
      setCanClaim(false);
    } catch (error) {
      console.log(error, "start error");
    }
  };

  // ✅ Claim mining rewards
  const claimMining = async () => {
    try {
      console.log(`Claiming ${amountMined.toFixed(3)} $MARS for ${username}...`);
      const data = {
        username,
        mineCount : amountMined
      }

      console.log(data)

      const res = await claimMine({data}).unwrap();
      console.log(res, "claim response")
      // TODO: Call your backend claim endpoint here

      // Reset local + redux state after claim
      setAmountMined(0);
      setCanClaim(false);
      // dispatch(setMiningStatus(false));
      dispatch(setMiningStartDate(null));
    } catch (err) {
      console.log("Claim failed", err);
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
              $MARS
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
            <p className="text-white font-semibold text-sm">$MARS/Sec</p>
          </div>
        </div>
        {miningStatus && (
          <p className="mt-4 text-white">
            <span className="text-yellow-500">Mining Resets</span> in {timeLeft}
          </p>
        )}
        {!miningStatus && canClaim && (
          <p className="mt-4 text-yellow-400 font-semibold">
            Rewards ready to claim!
          </p>
        )}
      </div>
      <ClaimButton
      canClaim={canClaim}
        loading={isLoading || claimLoad}
        // disabled={!canClaim && !miningStatus && isLoading} // can only press if mining OR rewards ready
        miningStatus={miningStatus}
        action={claimMining}
        start={toggleMining}
      />
    </div>
  );
};

export default MiningStatus;

