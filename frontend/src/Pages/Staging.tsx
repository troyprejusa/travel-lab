import { useEffect } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';
import { Flex, Box, Spinner, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxFetchUser } from '../redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import fetchHelpers from '../utilities/fetchHelpers';
import { UserModel } from '../utilities/Interfaces';
import { AppDispatch, RootState } from '../redux/Store';
import Constants from '../utilities/Constants';

function Staging(): JSX.Element {
  /* The purpose of this page is to get the needed user data
    before proceeding to have the user select a trip */

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userRedux: UserModel = useSelector((state: RootState) => state.user);
  const { user, getAccessTokenSilently } = useAuth0();
  const toast = useToast();

  // NOTE: Remember that useEffect is always run once on first render,
  // so do not allow for the callbacks to be executed if values are 
  // default/dummy values

  // Check user data and set into state. Auth0 user may be fetched from
  // remote server, so it is asynchronous
  useEffect(() => {
    if (user && user.email) setUser(user);
  }, [user]);

  // If the redux user data changes
  useEffect(() => {
    if (userRedux.email) {
      if (userRedux.first_name) {
        navigate(`/user/${userRedux.email}/trips`);
      } else {
        navigate(`/user/${userRedux.email}/setup`);
      }
    }
  }, [userRedux]);

  return (
    <Box background={Constants.BACKROUND_GRADIENT} height={'100vh'}>
      <Flex justifyContent={'center'} alignItems={'center'}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    </Box>
  );

  async function setUser(user: User) {
    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      dispatch(reduxFetchUser({ email: user.email!, token: token }));
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

export default Staging;
