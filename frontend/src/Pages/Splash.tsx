import React from 'react';
import splashphoto from '../Photos/splashphoto.jpg';

import { 
    HStack,
    Image,
    useBoolean 
} from '@chakra-ui/react'

import ChakraLogin from '../Components/ChakraLogin';
import ChakraSignup from '../Components/ChakraSignup';
import ChakraFeatures from '../Components/ChakraFeatures';

function Splash(): JSX.Element {
    const [ wantsLogin, setWantsLogin ] = useBoolean(true);
    return (
        <>
            <HStack>
                <Image 
                src={splashphoto} 
                boxSize='50%'
                alt='Travel Photo' />
                {wantsLogin ? <ChakraLogin setWantsLogin={setWantsLogin} /> : <ChakraSignup setWantsLogin={setWantsLogin}/>}
            </HStack>
            <ChakraFeatures />
        </>
    )
}

export default Splash;

