import { useAppAuth } from '../auth/AppAuth';
import DevAuthChoices from './DevAuthChoices';
import {
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

function LoginButton() {
  const { isLoading, error, loginWithRedirect, isDevAuth } = useAppAuth();

  if (isDevAuth) return <DevAuthChoices />;

  if (isLoading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Unable to log in:</AlertTitle>
        <AlertDescription>
          {`It's not your fault, there's is an issue on our end :(`}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Button colorScheme="orange" onClick={() => loginWithRedirect()} cursor={'pointer'}>
      Log in
    </Button>
  );
}

export default LoginButton;
