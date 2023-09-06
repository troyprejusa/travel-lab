import React, { useEffect } from 'react';
import { signOutBeforeTripSelect } from '../utilities/stateResets';
import { useAuth0 } from '@auth0/auth0-react';
import { Flex, Text, Button } from '@chakra-ui/react';
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
  useEffect(() => {setUser(user.email)}, []);

  return (
    <>
      <Flex justifyContent={'flex-end'}>
        <Button
          margin="20px"
          size="md"
          colorScheme="red"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Flex>
      <Flex justifyContent={'center'}>
        <Text fontSize={'xl'} fontWeight={'bold'}>
          Staging
        </Text>
      </Flex>
    </>
  );

  async function setUser(email: string) {
    if (email) {
      try {
        const token: string = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
        dispatch(reduxFetchUser({email: email, token: token}));
        navigate(`user/${email}/trips`);
      } catch (error: any) {
        console.error('Unable to retrieve user data:\n', error);
      }
    }
  }

  function handleSignOut(event: SyntheticEvent) {
    signOutBeforeTripSelect(dispatch);
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }
}

export default Staging;
