import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../services/store';
import { clearIsAuthenticated, clearJwtToken, setHasPassword, setIsAuthenticated } from '../../services/redux/user';
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
  const username = profile?.username;

  // Check if user has password set
  const {
    data: passwordStatus,
    isLoading: isCheckingPassword
  } = useCheckPasswordStatusQuery(username || '', {
    skip: !username,
  });

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
      jwtToken: jwtToken ? 'Present' : 'Not present'
    });
  }, [isAuthenticated, hasPassword, jwtToken]);

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

  // If user is authenticated, show the app
  if (isAuthenticated) {
    console.log('User is authenticated, showing MainRoutes');
    return <MainRoutes />;
  }

  // If user has password but is not authenticated, show login
  if (hasPassword) {
    return (
      <LoginPassword
        onSuccess={() => {
          dispatch(setIsAuthenticated(true));
        }}
      />
    );
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