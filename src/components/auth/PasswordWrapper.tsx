import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../services/store';
import { clearIsAuthenticated, clearJwtToken, setHasPassword, setIsAuthenticated, setJwtToken } from '../../services/redux/user';
import CreatePassword from './CreatePassword';
import LoginPassword from './LoginPassword';
import MainRoutes from '../../routes/MainRoutes';
import { useCheckPasswordStatusQuery, useLazyVerifyTokenQuery } from '../../services/auth';



const PasswordWrapper: React.FC = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.user.profile);
  const hasPassword = profile?.hasPassword || false;
  const isAuthenticated = profile?.isAuthenticated || false;
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

  useEffect(() => {
    if (jwtToken && !isAuthenticated) {
      triggerVerifyToken()
        .unwrap()
        .then(() => {
          dispatch(setIsAuthenticated(true));
          dispatch(setJwtToken(jwtToken));
        })
        .catch((err: any) => {
          console.log(err, "token-verify-error")
          dispatch(clearIsAuthenticated());
          dispatch(clearJwtToken());
        });
    }
  }, []);



  useEffect(() => {
    if (passwordStatus) {
      dispatch(setHasPassword(passwordStatus.hasPassword));
    }
  }, [passwordStatus, dispatch]);


  const isChecking = isCheckingPassword || isCheckingToken;

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-4 h-4 border-4 border-[#FFB948] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  console.log(isAuthenticated, "isAuthenticated")

  // If user is authenticated, show the app
  if (isAuthenticated) {
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
