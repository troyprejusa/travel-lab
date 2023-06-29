import React, { SyntheticEvent, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/Store';
import { UserModel } from '../Models/Interfaces';

// TODO: DEV ONLY
import fakeLogin from '../etc/FakeLogin';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface ChakraLoginProps {
  setWantsLogin: any;
}
  
function ChakraLogin({ setWantsLogin }: ChakraLoginProps) {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user: UserModel = useSelector((state: RootState) => state.user);


  // DEV ONLY    
  useEffect(()=> fakeLogin(dispatch), []);   // Login on first render

  return (
    <Flex
      align={'center'}
      justify={'center'}
      // bg={useColorModeValue('gray.50', 'gray.800')}
      // bgColor={'rgba(255, 255, 255, .25)'}
      >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Log in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
              <Button
                onClick={(e: SyntheticEvent) => navigate(`/user/${user.first_name}${user.last_name}/trips`)}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                DEV BYPASS
              </Button>
            </Stack>
            <Text align={'center'}>
                    Need an account? <Link color={'blue.400'} onClick={setWantsLogin.toggle}>Sign Up</Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default ChakraLogin