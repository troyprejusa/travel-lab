import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store';
import TitleBar from '../Components/TitleBar';
import Constants from '../utilities/Constants';
import NewUserForm from '../Components/NewUserForm';
import { Box, Flex, Button } from '@chakra-ui/react';
import { signOutBeforeTripSelect } from '../utilities/stateHandlers';
import { useAuth0 } from '@auth0/auth0-react';

function AccountSetup() {
  const { logout } = useAuth0();
  const dispatch = useDispatch<AppDispatch>();


  return (
    <Box background={Constants.BACKROUND_GRADIENT} height={'100vh'}>
      <Box paddingTop={6}>
      <TitleBar text="Account Setup" />

      </Box>
      <Flex justifyContent={'flex-end'}>
        <Button
          margin="20px"
          size="md"
          colorScheme="red"
          onClick={() => handleSignOut()}
        >
          Sign Out
        </Button>
      </Flex>
      <Flex justifyContent={'center'}>
        <NewUserForm />
      </Flex>
    </Box>
  );

  function handleSignOut() {
    signOutBeforeTripSelect(dispatch);
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }
}

export default AccountSetup;
