import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LandingHero from '../Components/LandingHero';
import FeaturesSection from '../Components/FeaturesSection';
import LandingStatistics from '../Components/LandingStatistics';
import FeatureGallery from '../Components/FeatureGallery';

function Landing(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth0();

  // If authentication status changes, check if
  // we are logged in an navigate pages if so
  useEffect(checkForLogin, [isAuthenticated]);

  return (
    <Box>
      <LandingHero />
      <FeaturesSection />
      <LandingStatistics />
      <FeatureGallery />
    </Box>
  );

  function checkForLogin() {
    if (isAuthenticated && user && location.pathname === '/') {
      navigate(`/user/${user.email}`);
    }
  }
}

export default Landing;
