import React from 'react';
import TitleBar from '../Components/TitleBar';
import {
  Text,
  Box,
  Divider,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';

function UserSettings(): JSX.Element {
  return (
    <>
      <TitleBar text="User Settings" />
      <Box>
        <Text>User Photo</Text>
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Photo upload feature in work</AlertTitle>
        </Alert>
      </Box>
      <Divider margin={'1rem'} />
      <Box>
        <Text>Delete Account</Text>
        <Button>Delete Account</Button>
      </Box>
    </>
  );
}

export default UserSettings;
