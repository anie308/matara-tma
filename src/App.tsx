import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import eruda from 'eruda';
import { setUsername, setProfilePicture } from './services/redux/user';
import MainRoutes from './routes/MainRoutes';
import Unsupported from './pages/unsupported';
import { RootState } from './services/store';

function App() {
  // Initialize Eruda for debugging
  eruda.init();

  const WebApp = window.Telegram.WebApp;

  // Configure Telegram WebApp
  WebApp.isClosingConfirmationEnabled = true;
  WebApp.isVerticalSwipesEnabled = false;

  const [isSupported, setIsSupported] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.profile);
  const savedUser = user?.username;
  const initUser = WebApp.initDataUnsafe?.user;

  useEffect(() => {
    if (!savedUser && initUser) {
      dispatch(setUsername(initUser?.username));
      dispatch(setProfilePicture(initUser?.photo_url));
    }
  }, [savedUser, initUser, dispatch]);

 useEffect(() => {
  WebApp.ready();

  // Allow only Android, iOS, and Telegram Desktop
  const allowedPlatforms = ["android", "ios", "tdesktop"];
  if (!allowedPlatforms.includes(WebApp.platform)) {
    // setIsSupported(false);
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