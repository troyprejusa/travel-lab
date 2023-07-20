import React, { useState, SyntheticEvent, useRef } from 'react';
import { UserModel } from '../Models/Interfaces';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/UserSlice';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface ChakraSignupProps {
    setWantsLogin: any;
}
  
function ChakraSignup({ setWantsLogin }: ChakraSignupProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const password1Ref = useRef<HTMLInputElement>(null);
    const password2Ref = useRef<HTMLInputElement>(null);

    return (
      <Flex
        align={'center'}
        justify={'center'}
        // bg={useColorModeValue('gray.50', 'gray.800')}>
        >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign up for an account</Heading>
            </Stack>
            <form onSubmit={handleSubmit}>
                <Box rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                    <HStack>
                        <Box>
                            <FormControl id="firstName" isRequired>
                                <FormLabel>First Name</FormLabel>
                                <Input type="text" ref={firstNameRef}/>
                            </FormControl>
                            </Box>
                            <Box>
                            <FormControl id="lastName" isRequired>
                                <FormLabel>Last Name</FormLabel>
                                <Input type="text" ref={lastNameRef}/>
                            </FormControl>
                        </Box>
                    </HStack>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input type="email" ref={emailRef}/>
                    </FormControl>
                    <FormControl id="phone" isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input type="tel" ref={phoneRef}/>
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                        <Input type={showPassword ? 'text' : 'password'} ref={password1Ref}/>
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
                    <FormControl id="repassword" isRequired>
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup>
                        <Input type={showConfPassword ? 'text' : 'password'} ref={password2Ref}/>
                        <InputRightElement h={'full'}>
                            <Button
                            variant={'ghost'}
                            onClick={() =>
                                setShowConfPassword((showConfPassword) => !showConfPassword)
                            }>
                            {showConfPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                        </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <Stack spacing={10} pt={2}>
                        <Button
                        type='submit'
                        loadingText="Submitting"
                        size="lg"
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}>
                        Sign up
                        </Button>
                    </Stack>
                    <Stack pt={6}>
                        <Text align={'center'}>
                        Already a user? <Link color={'blue.400'} onClick={setWantsLogin.toggle}>Login</Link>
                        </Text>
                    </Stack>
                    </Stack>
                </Box>
            </form>
        </Stack>
      </Flex>
    );

    function handleSubmit(event: SyntheticEvent) {
        event.preventDefault(); // Prevent URL redirection
        
        if (
            firstNameRef.current !== null && 
            lastNameRef.current !== null && 
            emailRef.current !== null && 
            phoneRef.current !== null && 
            password1Ref.current !== null && 
            password2Ref.current !== null
        ) {
            const formData: URLSearchParams = new URLSearchParams();
            formData.append('first_name', firstNameRef.current.value);
            formData.append('last_name', lastNameRef.current.value);
            formData.append('email', emailRef.current.value);
            formData.append('phone', phoneRef.current.value);
            formData.append('password', password1Ref.current.value);
            signupUser(formData);
            
        } else {
            alert('Unable to sign up');
            throw new Error('Unable to access entered credentials');
        }
      }

      async function signupUser(formData: URLSearchParams) {
            try {
            const res: Response = await fetch('/auth/createuser', {
                method: 'POST',
                body: formData,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });

            const json = await res.json();
            if (res.ok) {
                // Sign in the person
                const user: UserModel = json.user;
                
                // Save token to localStorage
                localStorage.setItem("token", json.token);
    
                // Put user information into state
                dispatch(login(user));
    
                // Navigate to the next page
                navigate(`/user/${user.email}/trips`)
    
            } else {
                const message: any = await res.json();
                throw new Error(JSON.stringify(message));
            }
    
            } catch (e: any) {
                alert('Unable to sign up :(')
            }

      }
  }

export default ChakraSignup;