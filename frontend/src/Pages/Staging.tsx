import React, { useEffect } from 'react';
import { signOutBeforeTripSelect } from '../utilities/stateHandlers';
import { useAuth0 } from '@auth0/auth0-react';
import { Flex, Text, Button, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { reduxFetchUser } from '../redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import fetchHelpers from '../utilities/fetchHelpers';

function Staging(): JSX.Element {
  /* The purpose of this page is to get the needed user data
    before proceeding to have the user select a trip. If you cannot
    get the user data, we need to show an error page */

  // React
  const navigate = useNavigate();

  // Redux
  const dispatch = useDispatch();

  // Auth
  const { user, getAccessTokenSilently, logout } = useAuth0();

  // Fetch user data and set state
  useEffect(() => {
    setUser(user);
  }, [user]);

  const toast = useToast();

  return (
    <>
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
        <Text fontSize={'xl'} fontWeight={'bold'}>
          Loading...
        </Text>
      </Flex>
    </>
  );

  async function setUser(user: any) {
    if (user && user.email) {
      try {
        const token: string = await fetchHelpers.getAuth0Token(
          getAccessTokenSilently
        );
        dispatch(reduxFetchUser({ email: user.email, token: token }));
        navigate(`user/${user.email}/trips`);
      } catch (error: any) {
        console.error(error);
        toast({
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
