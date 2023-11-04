import { Outlet } from 'react-router-dom';
import LandingHeader from '../Components/LandingHeader';
import LandingFooter from '../Components/LandingFooter';
import { Box } from '@chakra-ui/react';

function HomeOutlet(): JSX.Element {
  return (
    <Box id='home-outlet' minHeight={'100vh'} position={'relative'} paddingBottom={'5rem'}>
        <LandingHeader />
        <Outlet />
        <LandingFooter />
    </Box>
  );
}

export default HomeOutlet;