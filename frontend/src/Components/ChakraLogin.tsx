import React, { SyntheticEvent } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/Store';
import { UserModel } from '../Models/Interfaces';
import { login } from '../redux/UserSlice';

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
            <form onSubmit={handleLogin}>
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
                  type='submit'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign in
                </Button>
              </Stack>
            </form>
            <Stack>
              <Button
                  onClick={handleFakeLogin}
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

  function handleLogin(event: SyntheticEvent) {
    console.log("Handling login!")
  }

  function handleFakeLogin(event: SyntheticEvent) {
      const formData: URLSearchParams = new URLSearchParams();
      formData.append('username', 'troy@test.com');
      formData.append('password', 'abcd');
      loginUser(formData);
  }

  function loginUser(formData: any) {
    (async function() {
      try {
        const res: Response = await fetch('/auth/signin', {
            method: 'POST',
            body: formData,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        });
        if (res.ok) {
            const json = await res.json();
            const user: UserModel = json.user;
            
            // Save token to localStorage
            localStorage.setItem("token", json.token);

            // Put user information into state
            dispatch(login(user));

            // Navigate to the next page
            navigate(`/user/${user.email}/trips`)

        } else {
            const json = await res.json();
            throw new Error(JSON.stringify(json));
        }

      } catch (e: any) {
          console.error(`No developing today :(\n${e.message}`)
      }
    })()
  }
}

export default ChakraLogin