import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

function UserOutlet(): JSX.Element {
  return (
    <>
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

const ProtectedUserOutlet = withAuthenticationRequired(UserOutlet, {
  onRedirecting: () => (
    <div>Your session has expired, redirecting to login page...</div>
  ),
});

export default ProtectedUserOutlet;
