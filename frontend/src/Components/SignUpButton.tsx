
import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

function SignUpButton() {
  const { isLoading, error, loginWithRedirect } = useAuth0();

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
        <AlertTitle>Unable to sign up:</AlertTitle>
        <AlertDescription>
          {`It's not your fault, there's is an issue on our end :(`}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: {
            screen_hint: 'signup',
          },
        })
      }
      cursor={'pointer'}
    >
      Sign up
    </Button>
  );
}

export default SignUpButton;
