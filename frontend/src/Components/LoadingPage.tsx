import { ReactNode } from 'react';
import Constants from '../utilities/Constants';
import { Box, Flex, Spinner } from '@chakra-ui/react';

interface LoadingPageProps {
    children?: ReactNode
}
function LoadingPage(props: LoadingPageProps) {
  return (
    <Box background={Constants.BACKROUND_GRADIENT} height={'100vh'}>
        {props.children}
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
}

export default LoadingPage;
