import { Route, Routes } from "react-router-dom";
import Layout from "../layout";
import Home from "../pages";
import Referral from "../pages/referral";
import Rank from "../pages/rank";
import Game from "../pages/game";
import Profile from "../pages/profile";
import MataraRank from "../pages/matara-rank";
import Task from "../pages/task";
import Singletask from "../pages/task/[slug]";
import Trade from "../pages/trade";
import TokenDetails from "../pages/token-details";
import Swap from "../pages/swap";
import Receive from "../pages/receive";
import SelectToken from "../pages/select-token";
import Send from "../pages/send";

const MainRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="ref" element={<Referral />} />
        <Route path="rank" element={<Rank />} />
        <Route path="tasks" element={<Task />} />
        <Route path="tasks/:slug" element={<Singletask />} />
        <Route path="game" element={<Game />} />
        <Route path="profile" element={<Profile />} />
        <Route path="matara-ranks" element={<MataraRank />} />
        <Route path="trade" element={<Trade />} />
        <Route path="token/:symbol/:address" element={<TokenDetails />} />
        <Route path="swap" element={<Swap />} />
        <Route path="receive" element={<Receive />} />
        <Route path="select-token" element={<SelectToken />} />
        <Route path="send" element={<Send />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
