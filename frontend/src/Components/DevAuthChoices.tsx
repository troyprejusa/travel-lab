import { Button, ButtonGroup } from '@chakra-ui/react';
import { DEV_USERS, useAppAuth } from '../auth/AppAuth';

export default function DevAuthChoices() {
  const { selectDevUser } = useAppAuth();

  return (
    <ButtonGroup spacing={3}>
      {DEV_USERS.map((email) => {
        const name = email === 'troy@test.com' ? 'Troy' : 'Joe';
        return (
          <Button key={email} colorScheme="orange" onClick={() => selectDevUser(email)}>
            Continue as {name}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
