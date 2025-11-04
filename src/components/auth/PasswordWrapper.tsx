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
  // console.log(username, "username")
  // console.log(hasPassword, "hasPassword")
  // console.log(isAuthenticated, "isAuthenticated")
  // console.log(jwtToken, "jwtToken")

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
    let isMounted = true;
    
    const initializeAuth = async () => {
      // Check if we have a token in localStorage but not in Redux
      const storedToken = localStorage.getItem('jwt_token');
      
      // If we have a token in localStorage but not in Redux, set it
      if (storedToken && !jwtToken && isMounted) {
        dispatch({ type: 'user/setJwtToken', payload: storedToken });
        // Wait a tick for Redux to update
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Re-check jwtToken from state after potential update
      const currentJwtToken = jwtToken || storedToken;
      
      // If we have a token, verify it (only if not authenticated and session not active)
      if (currentJwtToken && !isAuthenticated && !sessionActive && isMounted) {
        try {
          await triggerVerifyToken().unwrap();
          if (isMounted) {
            dispatch(setIsAuthenticated(true));
          }
        } catch (error) {
          console.log('Token verification failed:', error);
          // Clear invalid token from Redux (localStorage will be cleared by middleware)
          if (isMounted) {
            dispatch(clearJwtToken());
            dispatch(clearIsAuthenticated());
          }
        }
      }
      
      if (isMounted) {
        setIsInitialized(true);
      }
    };

    initializeAuth();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

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
    // const handleVisibilityChange = () => {
    //   if (document.hidden && sessionActive) {
    //     console.log('App lost focus, locking session');
    //     dispatch({ type: 'user/lockSession' });
    //   }
    // };

    const handleBeforeUnload = () => {
      if (sessionActive) {
        console.log('App closing, locking session');
        dispatch({ type: 'user/lockSession' });
      }
    };

    // Lock session after 10 minutes of inactivity (MetaMask-style)
    const inactivityTimeout = setTimeout(() => {
      if (sessionActive) {
        console.log('Session timeout, locking session');
        dispatch({ type: 'user/lockSession' });
      }
    }, 10 * 60 * 1000); // 10 minutes

    // document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(inactivityTimeout);
      // document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionActive, dispatch]);

  // Safety timeout - if initialization takes too long, show password screen anyway
  useEffect(() => {
    const initTimeout = setTimeout(() => {
      setIsInitialized(true);
      console.warn('Initialization timeout, proceeding anyway');
    }, 5000); // 5 second timeout

    return () => clearTimeout(initTimeout);
  }, []); // Only run once on mount

  if (!isInitialized || isCheckingPassword || isCheckingToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FFB948] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Debug logging for authentication state
  console.log('PasswordWrapper State:', {
    isAuthenticated,
    hasPassword,
    sessionActive,
    jwtToken: jwtToken ? 'Present' : 'Not present',
    username,
    isInitialized
  });

  // MetaMask-style security: Always require password to access the app
  // Only show app if user has password AND session is active
  if (hasPassword && !sessionActive) {
    console.log('Session not active, showing login password');
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
        dispatch(unlockSession()); // Also unlock session when password is created
      }}
    />
  );
};

export default PasswordWrapper;