import TitleBar from '../Components/TitleBar';
import { Link } from 'react-router-dom';
import { ConfigurableButtonAndModal } from '../Components/Buttons';
import { useAuth0 } from '@auth0/auth0-react';
import fetchHelpers from '../utilities/fetchHelpers';
import { UserModel } from '../utilities/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { signOutBeforeTripSelect } from '../utilities/stateHandlers';
import {
  Text,
  Box,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
  Heading,
  Flex,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';
import Constants from '../utilities/Constants';

function UserSettings(): JSX.Element {
  const user: UserModel = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { getAccessTokenSilently, logout } = useAuth0();
  const toast = useToast();

  return (
    <Box
      background={Constants.BACKROUND_GRADIENT}
      height={'100vh'}
      overflowY={'scroll'}
      padding={'2rem'}
    >
      <TitleBar text="User Settings" />
      <Flex flexDirection={'column'} rowGap={'1rem'}>
        <Box>
          <Link to={'/'} style={{ color: 'blue' }}>
            Return to previous
          </Link>
        </Box>

        <Box>
          <Heading size={'md'}>User Photo</Heading>
          <Alert status="info" margin={'1rem'}>
            <AlertIcon />
            <AlertTitle>Photo upload feature in work</AlertTitle>
          </Alert>
        </Box>
        <Divider margin={'1rem'} />
        <Box>
          <Heading size={'md'}>Change Password</Heading>
          <Text>Here are the steps to change your password:</Text>
          <OrderedList>
            <ListItem>Sign out of the application</ListItem>
            <ListItem>
              From the landing page, click on the Log In button
            </ListItem>
            <ListItem>
              Click on the Forgot Password? | Reset Password link
            </ListItem>
            <ListItem>
              Follow the prompts with the authentication provider to change your
              password
            </ListItem>
          </OrderedList>
        </Box>
        <Divider margin={'1rem'} />
        <Box>
          <Heading size="md">Delete Account</Heading>
          <ConfigurableButtonAndModal
            modalHeader="Delete account"
            modalBody="Are you sure you want to delete your account? This action cannot be undone"
            onClick={() => handleDeleteAccount()}
            margin='1rem'
          >
            Delete Account
          </ConfigurableButtonAndModal>
        </Box>
      </Flex>
    </Box>
  );

  async function handleDeleteAccount() {
    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      const res: Response = await fetch(
        `${Constants.API_PREFIX}/user/${user.email}`,
        {
          method: 'DELETE',
          headers: fetchHelpers.getTokenHeader(token),
        }
      );

      if (res.ok) {
        toast({
          position: 'top',
          title: 'Account deleted :)',
          description: 'Come back any time! Logging you out...',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });

        // Sign out user and redirect
        setTimeout(() => {
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          });
        }, 4000);
        signOutBeforeTripSelect(dispatch);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to create delete account :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }
}

export default UserSettings;
