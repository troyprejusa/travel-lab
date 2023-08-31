import React from 'react';
import splashphotoHero from '../assets/splashphoto_hero.jpg';

import { Flex, Box, Text, useBoolean } from '@chakra-ui/react';

import LoginMenu from '../Components/LoginMenu';
import SignupMenu from '../Components/SignupMenu';
import FeaturesSection from '../Components/FeaturesSection';

function Splash(): JSX.Element {
  const [wantsLogin, setWantsLogin] = useBoolean(true);
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
          {/* <Text color='#9BA17B' fontSize="6xl" fontFamily="monospace" fontWeight="bold"></Text> */}
        </Flex>
        {wantsLogin ? (
          <LoginMenu setWantsLogin={setWantsLogin} />
        ) : (
          <SignupMenu setWantsLogin={setWantsLogin} />
        )}
      </Flex>
      <FeaturesSection />
    </>
  );
}

export default Splash;
