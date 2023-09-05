import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';


function Auth0Wrapper({ children }) {

  const { isLoading, error } = useAuth0();

  if (!isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Unable to sign in</div>;
  }

  return <>{children}</>;
}

export default Auth0Wrapper;
