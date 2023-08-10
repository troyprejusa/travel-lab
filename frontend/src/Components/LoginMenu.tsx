import React, { useState, SyntheticEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { UserModel } from '../Models/Interfaces';
import { reduxUserLogin } from '../redux/UserSlice';

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
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


interface LoginMenuProps {
  setWantsLogin: any;
}

function LoginMenu({ setWantsLogin }: LoginMenuProps) {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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
                <Input type="email" ref={usernameRef} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} ref={passwordRef} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
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
    event.preventDefault();   // Prevent URL redirection

    // Check if null to avoid TypeScript error
    if (usernameRef.current !== null && passwordRef.current !== null) {
      const formData: URLSearchParams = new URLSearchParams();
      formData.append('username', usernameRef.current.value);
      formData.append('password', passwordRef.current.value);
      loginUser(formData);

    } else {
      alert('Unable to sign in')
      throw new Error('Unable to access entered credentials');
    }
  }

  function handleFakeLogin(event: SyntheticEvent) {
    const formData: URLSearchParams = new URLSearchParams();
    formData.append('username', 'troy@test.com');
    formData.append('password', 'abcd');
    loginUser(formData);
  }

  async function loginUser(formData: URLSearchParams) {
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

        const auth_token: string = json.token;

        // Save token to localStorage
        localStorage.setItem("token", auth_token);

        // Put user information into state
        dispatch(reduxUserLogin(user));

        // Navigate to the next page
        navigate(`/user/${user.email}/trips`)

      } else {
        const json = await res.json();
        throw new Error(JSON.stringify(json));
      }

    } catch (e: any) {
      console.error(`No developing today :(\n${e.message}`)
    }

  }
}

export default LoginMenu