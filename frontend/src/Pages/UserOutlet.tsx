import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

function UserOutletUnprotected(): JSX.Element {
  return (
    <>
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

const UserOutlet = withAuthenticationRequired(UserOutletUnprotected, {
  onRedirecting: () => (
    <div>Your session has expired, redirecting to login page...</div>
  ),
});
export default UserOutlet;
