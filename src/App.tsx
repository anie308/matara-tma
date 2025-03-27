import { useEffect, useState } from 'react'
import WebApp from "@twa-dev/sdk";
import {  useDispatch, useSelector } from 'react-redux';
import { setUsername } from './services/redux/user';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout';
import Home from './pages';
import eruda from "eruda";
import Referral from './pages/referral';
import Rank from './pages/rank';
import Task from './pages/task';

function App() {
  eruda.init();
  WebApp.isClosingConfirmationEnabled = true;
  WebApp.isVerticalSwipesEnabled = false;
  const [supported, setSupported] = useState(true);
  const initUser = WebApp.initDataUnsafe.user?.username;
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const savedUser = user.username;

  useEffect(() => {
    if (!savedUser && initUser) {
      dispatch(setUsername(initUser));
    }
  }, [initUser, savedUser, dispatch]);

  useEffect(() => {
    WebApp.ready();

    // if (WebApp.platform !== "android" && WebApp.platform !== "ios") {
    //   setSupported(false);
    // }
  }, []);

  if (!WebApp.isExpanded) {
    WebApp.expand();
  }


  return (
      <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="" element={<Home />} />
        <Route path="ref" element={<Referral />} />
        <Route path="rank" element={<Rank />} />
        <Route path="tasks" element={<Task />} />
      </Route>
    </Routes>
  )
}

export default App
