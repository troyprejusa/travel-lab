import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useAppAuth } from '../auth/AppAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import LandingHero from '../Components/LandingHero';
import FeaturesSection from '../Components/FeaturesSection';
import LandingStatistics from '../Components/LandingStatistics';
import FeatureGallery from '../Components/FeatureGallery';

function Landing(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppAuth();

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
