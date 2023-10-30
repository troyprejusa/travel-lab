import React, { useEffect } from 'react';
import { signOutBeforeTripSelect } from '../utilities/stateHandlers';
import { useAuth0 } from '@auth0/auth0-react';
import { Flex, Box, Button, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxFetchUser } from '../redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import fetchHelpers from '../utilities/fetchHelpers';
import { UserModel } from '../utilities/Interfaces';
import { AppDispatch, RootState } from '../redux/Store';
import NewUserForm from '../Components/NewUserForm';
import Constants from '../utilities/Constants';

function Staging(): JSX.Element {
  /* The purpose of this page is to get the needed user data
    before proceeding to have the user select a trip */

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userRedux: UserModel = useSelector((state: RootState) => state.user);
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const toast = useToast();

  // Check user data and set state. Auth0 user may be fetched from
  // remote server, so it is asynchronous
  useEffect(() => {
    setUser(user);
  }, [user]);

  // If the redux user data changes...
  useEffect(() => {
    if (userRedux.first_name) {
      // If the user has already set their data, 
      // we can navigate onwards
      navigate(`/user/${userRedux.email}/trips`);
    }
  }, [userRedux]);

  return (
    <Box background={Constants.BACKROUND_GRADIENT} height={'100vh'}>
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
        {!userRedux.first_name && <NewUserForm />}
      </Flex>
    </Box>
  );

  async function setUser(user) {
    if (user && user.email) {
      try {
        const token: string = await fetchHelpers.getAuth0Token(
          getAccessTokenSilently
        );
        dispatch(reduxFetchUser({ email: user.email, token: token }));
      } catch (error) {
        console.error(error);
        toast({
          position: 'top',
          title: 'Unable to get user data :(',
          description: 'Something went wrong...',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
  }

  function handleSignOut() {
    signOutBeforeTripSelect(dispatch);
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }
}

export default Staging;
