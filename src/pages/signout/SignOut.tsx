import React, { ReactElement, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { auth } from '../../index';

const SignOut = (): ReactElement => {
  useEffect(() => {
    sessionStorage.removeItem('token');
    auth.signOut();
  }, []);

  return <Navigate to={'/'} />;
};

export default SignOut;
