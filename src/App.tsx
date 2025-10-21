import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { setUsername, setProfilePicture } from './services/redux/user';
import Unsupported from './pages/unsupported';
// import PasswordWrapper from './components/auth/PasswordWrapper';
import { RootState } from './services/store';
import MainRoutes from './routes/MainRoutes';
import PasswordWrapper from './components/auth/PasswordWrapper';

function App() {
  // Initialize Eruda for debugging

  const WebApp = window.Telegram.WebApp;

  // Configure Telegram WebApp
  WebApp.isClosingConfirmationEnabled = true;
  WebApp.isVerticalSwipesEnabled = false;

  const [isSupported, setIsSupported] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.profile);
  const savedUser = user?.username;
  const initUser = WebApp.initDataUnsafe?.user ;

  useEffect(() => {
    if (!savedUser && initUser) {
      dispatch(setUsername(initUser?.username || "jurstadev"));
      dispatch(setProfilePicture(initUser?.photo_url));
    }
  }, [savedUser, initUser, dispatch]);

  useEffect(() => {
    WebApp.ready();

    // Allow only Android, iOS, and Telegram Desktop
    const allowedPlatforms = ["android", "ios", "tdesktop"];
    if (!allowedPlatforms.includes(WebApp.platform)) {
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
        <Route path="/*" element={<PasswordWrapper />} />
      ) : (
        <Route path="/*" element={<Unsupported />} />
      )}
    </Routes>
  );
}

export default App;