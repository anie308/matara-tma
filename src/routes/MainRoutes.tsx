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
import Swap from "../pages/swap";

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
        <Route path="swap" element={<Swap />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
