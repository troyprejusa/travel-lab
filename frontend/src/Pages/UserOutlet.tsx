import { Outlet } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import LoadingPage from '../Components/LoadingPage';
import { Box, Heading, Flex } from '@chakra-ui/react';

function UserOutlet(): JSX.Element {
  return (
    <Box id="user-outlet">
      <Outlet />
    </Box>
  );
}

const ProtectedUserOutlet = withAuthenticationRequired(UserOutlet, {
  onRedirecting: () => (
    <LoadingPage>
      <Flex justifyContent="center" marginBottom={'4rem'}>
        <Heading size={'lg'}>Verifying session...</Heading>
      </Flex>
    </LoadingPage>
  ),
});

export default ProtectedUserOutlet;
