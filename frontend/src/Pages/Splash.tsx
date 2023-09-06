import React, { useEffect } from 'react';
import splashphotoHero from '../assets/splashphoto_hero.jpg';
import { Flex } from '@chakra-ui/react';
import LoginButton from '../Components/LoginButton';
import FeaturesSection from '../Components/FeaturesSection';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';


function Splash(): JSX.Element {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  // If authentication status changes, check if
  // we are logged in an navigate pages if so
  useEffect(checkForLogin, [isAuthenticated]);

  return (
    <>
      <Flex
        minWidth={'40%'}
        backgroundImage={splashphotoHero}
        backgroundSize={'cover'}
        backgroundRepeat={'no-repeat'}
        justifyContent={'space-between'}
      >
        <Flex alignItems={'center'}>
          <LoginButton />
        </Flex>
      </Flex>
      <FeaturesSection />
    </>
  );

  function checkForLogin() {
    if (isAuthenticated && user) {
      navigate(`/user/${user.email}`);
    }
  }
}

export default Splash;
