import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../services/store';
import { clearIsAuthenticated, clearJwtToken, setHasPassword, setIsAuthenticated, unlockSession } from '../../services/redux/user';
import CreatePassword from './CreatePassword';
import LoginPassword from './LoginPassword';
import MainRoutes from '../../routes/MainRoutes';
import { useCheckPasswordStatusQuery, useLazyVerifyTokenQuery } from '../../services/auth';

const PasswordWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get all state from Redux
  const profile = useSelector((state: RootState) => state.user.profile);
  const hasPassword = profile?.hasPassword || false;
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const jwtToken = useSelector((state: RootState) => state.user.jwtToken);
  const sessionActive = useSelector((state: RootState) => state.user.sessionActive);
  const username = profile?.username;
  console.log(username, "username")
  console.log(hasPassword, "hasPassword")
  console.log(isAuthenticated, "isAuthenticated")
  console.log(jwtToken, "jwtToken")

  // Check if user has password set
  const {
    data: passwordStatus,
    isLoading: isCheckingPassword
  } = useCheckPasswordStatusQuery(username || '', {
    skip: !username,
  });

  useEffect(() => {
    console.log(passwordStatus, "passwordStatus")
  }, [passwordStatus])

  // Verify JWT token
  const [triggerVerifyToken, { isLoading: isCheckingToken }] = useLazyVerifyTokenQuery();

  // Initialize authentication state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      // If we have a token in Redux state, verify it
      if (jwtToken && !isAuthenticated) {
        try {
          await triggerVerifyToken().unwrap();
          dispatch(setIsAuthenticated(true));
        } catch (error) {
          console.log('Token verification failed:', error);
          // Clear invalid token from Redux (localStorage will be cleared by middleware)
          dispatch(clearJwtToken());
          dispatch(clearIsAuthenticated());
        }
      }
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, jwtToken, isAuthenticated, triggerVerifyToken]);

  // Update password status when API returns
  useEffect(() => {
    if (passwordStatus) {
      dispatch(setHasPassword(passwordStatus.hasPassword));
    }
  }, [passwordStatus, dispatch]);

  // Monitor authentication state changes
  useEffect(() => {
    console.log('Authentication state changed:', {
      isAuthenticated,
      hasPassword,
      sessionActive,
      jwtToken: jwtToken ? 'Present' : 'Not present'
    });
  }, [isAuthenticated, hasPassword, sessionActive, jwtToken]);

  // MetaMask-style: Lock session when app loses focus or after timeout
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && sessionActive) {
        console.log('App lost focus, locking session');
        dispatch({ type: 'user/lockSession' });
      }
    };

    const handleBeforeUnload = () => {
      if (sessionActive) {
        console.log('App closing, locking session');
        dispatch({ type: 'user/lockSession' });
      }
    };

    // Lock session after 5 minutes of inactivity (MetaMask-style)
    const inactivityTimeout = setTimeout(() => {
      if (sessionActive) {
        console.log('Session timeout, locking session');
        dispatch({ type: 'user/lockSession' });
      }
    }, 5 * 60 * 1000); // 5 minutes

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(inactivityTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionActive, dispatch]);

  // Show loading while initializing or checking
  if (!isInitialized || isCheckingPassword || isCheckingToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFB948] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Debug logging for authentication state
  console.log('PasswordWrapper State:', {
    isAuthenticated,
    hasPassword,
    jwtToken: jwtToken ? 'Present' : 'Not present',
    username,
    isInitialized
  });

  // MetaMask-style security: Always require password to access the app
  // Only show app if user has password AND session is active
  if (hasPassword && !sessionActive) {
    return (
      <LoginPassword
        onSuccess={() => {
          dispatch(setIsAuthenticated(true));
          dispatch(unlockSession()); // Unlock the session
        }}
      />
    );
  }

  // If user has password and session is active, show the app
  if (hasPassword && sessionActive) {
    console.log('Session is active, showing MainRoutes');
    return <MainRoutes />;
  }

  // If user doesn't have password, show create password
  return (
    <CreatePassword
      onSuccess={() => {
        dispatch(setHasPassword(true));
        dispatch(setIsAuthenticated(true));
      }}
    />
  );
};

export default PasswordWrapper;