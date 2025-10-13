import WebApp from "@twa-dev/sdk";
import MiningStatus from "../components/home/MiningStatus";
import { useGetUserQuery } from "../services/routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/store";
import { useEffect } from "react";
import { setProfile } from "../services/redux/user";

function Home() {
  WebApp.BackButton.hide();
  const profile = useSelector((state: RootState) => state.user.profile);
  const savedUser = profile?.username;
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetUserQuery({ username: savedUser }, {pollingInterval: 50000});
  const user = data?.data;

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProfile(user));
    }
  }, [isSuccess, dispatch]);


  return (
    <div >
      <MiningStatus />
    </div>
  );
}

export default Home;
