import TitleBar from '../Components/TitleBar';
import { Heading, Text, Box } from '@chakra-ui/react';

function TermsAndConditions() {
  return (
    <Box padding={8}>
      <TitleBar text="Terms and Conditions" />
      <Heading>Disclaimer</Heading>
      <Text>
        During the alpha release, this application is intended for consumption
        only by users who have been invited to participate and have opted-in to
        participate. This application is not to be used by the general public at
        this time. All users of this application do so at their own risk.
      </Text>
      <Heading>Terms and Conditions</Heading>
      <Text>
        Due to the alpha-nature of this release, the author of this application
        reserves the right to remove and change website content at any time for
        any reason. This release is a closed release, and is not to be used by
        the general public. By creating an account and using this application,
        you are confirming that you are one of the users invited to use this
        application.
      </Text>
    </Box>
  );
}

export default TermsAndConditions;
