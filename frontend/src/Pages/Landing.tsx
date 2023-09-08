import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../Components/LandingHeader';
import LandingHero from '../Components/LandingHero';
import FeaturesSection from '../Components/FeaturesSection';
import LandingStatistics from '../Components/LandingStatistics';
import LandingFooter from '../Components/LandingFooter';

function Landing(): JSX.Element {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  // If authentication status changes, check if
  // we are logged in an navigate pages if so
  useEffect(checkForLogin, [isAuthenticated]);

  return (
    <Box>
      <LandingHeader />
      <LandingHero />
      <FeaturesSection />
      <LandingStatistics />
      <br />
      <br />
      <br />
      <br />
      <LandingFooter />
    </Box>
  );

  function checkForLogin() {
    if (isAuthenticated && user) {
      navigate(`/user/${user.email}`);
    }
  }
}

export default Landing;
