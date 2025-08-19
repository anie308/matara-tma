import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import eruda from 'eruda';
import { setUsername } from './services/redux/user';
import MainRoutes from './routes/MainRoutes';
import Unsupported from './pages/unsupported';

function App() {
  // Initialize Eruda for debugging
  eruda.init();

  const WebApp = window.Telegram.WebApp;

  // Configure Telegram WebApp
  WebApp.isClosingConfirmationEnabled = true;
  WebApp.isVerticalSwipesEnabled = false;

  const [isSupported, setIsSupported] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const savedUser = user?.username;

  useEffect(() => {
    const initUser = WebApp.initDataUnsafe?.user;
    if (!savedUser && initUser) {
      dispatch(setUsername(initUser));
    }
  }, [WebApp.initDataUnsafe, savedUser, dispatch]);

  useEffect(() => {
    WebApp.ready();

    // Check for supported platforms
    if (WebApp.platform !== 'android' && WebApp.platform !== 'ios') {
      setIsSupported(true);
    }

    // Expand the WebApp
    if (!WebApp.isExpanded) {
      WebApp.expand();
    }
  }, [WebApp]);

  return (
    <Routes>
      {isSupported ? (
        <Route path="/*" element={<MainRoutes />} />
      ) : (
        <Route path="/*" element={<Unsupported />} />
      )}
    </Routes>
  );
}

export default App;