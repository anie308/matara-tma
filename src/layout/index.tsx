import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import {
  useGetLeaderBoardQuery,
  useGetReferralsQuery,
  useGetUserQuery,
  useGetUserTasksQuery,
} from "../services/routes";
import { RootState } from "../services/store";
import { useDispatch, useSelector } from "react-redux";
import { setLeaderboard, setReferrals, setTasks } from "../services/redux/user";
import { useEffect } from "react";
import { useTokenPrices } from "../hooks/useTokenPrices";

function Layout() {
  const location = useLocation();
  const { pathname } = location;
  const user = useSelector((state: RootState) => state.user.profile);
  const username = user?.username;
  const dispatch = useDispatch();
  
  // Initialize token price updates with automatic refresh
  useTokenPrices();

  const {
    data: userData,
    isSuccess: userSuccess,
  } = useGetUserQuery({ username }, { pollingInterval: 300000 });
  const {
    data: referralData,
    isSuccess: referralSuccess,
  } = useGetReferralsQuery({ username }, { pollingInterval: 300000 });
  const {
    data: taskData,
    isSuccess: taskSuccess,
  } = useGetUserTasksQuery({ username }, { pollingInterval: 300000 });

  const {
    data: leaderBoardData,
    isSuccess: leaderBoardSuccess,
    error
  } = useGetLeaderBoardQuery({ pollingInterval: 300000 });

        console.log(leaderBoardData, error, "leaderboard")

  useEffect(() => {
    if (userSuccess) {
      // console.log(userData);
    }
  }, [userSuccess, userData]);

  useEffect(() => {
    if (taskSuccess) {
      dispatch(setTasks(taskData?.data));
    }
  }, [taskData, taskSuccess, dispatch]);

  useEffect(() => {
    if (referralSuccess) {
      dispatch(setReferrals(referralData?.data));
    }
  }, [referralData, referralSuccess, dispatch]);

  useEffect(() => {
    if (leaderBoardSuccess) {
      dispatch(setLeaderboard(leaderBoardData?.data));
    }
  }, [leaderBoardData, leaderBoardSuccess, dispatch]);

  // const dataLoading = userLoading || referralLoading || taskLoading;
  // const dataSuccess = (userSuccess && referralSuccess) || taskSuccess;

  // Determine whether to show the BottomNav based on the current path
  const showBottomNav = !["/profile", "/matara-ranks"].includes(pathname);

  return (
    <div className="min-h-screen font-montserrat root relative flex flex-col w-full">
      {/* TopBar is always visible */}
      <TopBar />

      {/* Main content area */}
      <div className="overflow-auto flex-grow pb-20">
        <Outlet />
      </div>

      {/* Conditionally render BottomNav */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default Layout;
