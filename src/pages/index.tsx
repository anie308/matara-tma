import WebApp from "@twa-dev/sdk";
import MiningStatus from "../components/home/MiningStatus";
import ClaimButton from "../components/home/ClaimButton";
import { useGetUserQuery } from "../services/routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/store";
import { useEffect } from "react";
import { setProfile } from "../services/redux/user";

function Home() {
  WebApp.BackButton.hide();
  const profile = useSelector((state: RootState) => state.user.profile);
  const savedUser = profile?.username || "jurstadev";
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetUserQuery({ username: savedUser });
  const user = data?.data;

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProfile(user));
    }
  }, [isSuccess, dispatch]);

  return (
    <div className="min-h-full">
      <MiningStatus />
      <ClaimButton />
    </div>
  );
}

export default Home;
