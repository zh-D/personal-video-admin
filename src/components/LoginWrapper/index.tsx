import React from 'react';
import { Redirect } from 'ice';
import store from '@/store';

const LoginWrapper = (WrappedComponent) => {
  const Wrapped = (props) => {
    const localUser = localStorage.getItem("user")
    const [userState, userDispatchers] = store.useModel('user');

    console.log(localUser);

    console.log(userState);

    return (
      <>
        {
          !userState.isAdmin ? <Redirect to="/user/login" /> : <WrappedComponent {...props} />
        }
      </>
    )
  };

  return Wrapped;
}

export default LoginWrapper;