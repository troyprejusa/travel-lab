import TitleBar from '../Components/TitleBar';
import { ConfigurableButtonAndModal } from '../Components/Buttons';
import { useAuth0 } from '@auth0/auth0-react';
import fetchHelpers from '../utilities/fetchHelpers';
import { UserModel } from '../utilities/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { signOutBeforeTripSelect } from '../utilities/stateHandlers';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Box,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
  Heading,
  Flex
} from '@chakra-ui/react';
import Constants from '../utilities/Constants';

function UserSettings(): JSX.Element {
  const navigate = useNavigate();
  const user: UserModel = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { getAccessTokenSilently, logout } = useAuth0();
  const toast = useToast();

  return (
    <Box background={Constants.BACKROUND_GRADIENT} height={'100vh'} overflowY={'scroll'}>
      <TitleBar text="User Settings" />
      <Flex flexDirection={'column'} rowGap={'1rem'}>
        <Text color={'blue'} cursor={'pointer'} onClick={() => navigate('/')}>
          Return to previous
        </Text>
        <Box>
          <Heading size={'md'}>User Photo</Heading>
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Photo upload feature in work</AlertTitle>
          </Alert>
        </Box>
        <Divider margin={'1rem'} />
        <Box>
          <Heading size="md">Delete Account</Heading>
          <ConfigurableButtonAndModal
            modalHeader="Delete account"
            modalBody="Are you sure you want to delete your account? This action cannot be undone"
            onClick={() => handleDeleteAccount()}
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
      const res: Response = await fetch(`/user/${user.email}`, {
        method: 'DELETE',
        headers: fetchHelpers.getTokenHeader(token),
      });

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
