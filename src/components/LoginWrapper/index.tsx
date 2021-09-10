import React, { useEffect } from 'react';
import { Redirect } from 'ice';
import store from '@/store';
import { useAuth } from 'ice';
import { logger } from 'ice';

const LoginWrapper = (WrappedComponent) => {
  const Wrapped = (props) => {
    const localUser = localStorage.getItem("user")
    const [userState, userDispatchers] = store.useModel('user');
    const [auth, setAuth] = useAuth();
    useEffect(() => { setAuth({ isAdmin: userState.isAdmin }); }, [])


    logger.info(localUser);

    logger.info(userState);

    return (
      <>
        {
          !userState.username ? <Redirect to="/user/login" /> : <WrappedComponent {...props} />
        }
      </>
    )
  };

  return Wrapped;
}

export default LoginWrapper;