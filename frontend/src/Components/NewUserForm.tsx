import React, {
  MutableRefObject,
  ReactNode,
  SyntheticEvent,
  useRef,
  useState,
} from 'react';
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormHelperText,
  InputLeftElement,
  List,
  ListItem,
  ListIcon,
  useToast,
  Text,
} from '@chakra-ui/react';
import { FiPhone, FiUser } from 'react-icons/fi';
import { PhoneIcon } from '@chakra-ui/icons';
import { reduxUpdateUserData } from '../redux/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import fetchHelpers from '../utilities/fetchHelpers';
import { UserModel } from '../utilities/Interfaces';
import { AppDispatch, RootState } from '../redux/Store';
import { useAuth0 } from '@auth0/auth0-react';

interface UserFormData {
  first_name: string;
  last_name: string;
  phone: string;
}

interface UserFormProps {
  formData: MutableRefObject<UserFormData>;
  updateForm: (currForm: UserFormData, newForm: FormData) => void;
  incrementStep?: () => void;
  decrementStep?: () => void;
}

export default function NewUserForm() {
  const forms: Array<React.FunctionComponent<UserFormProps>> = [Form1, Form2];
  const [step, setStep] = useState(0);

  // Create persistent object
  const userForm = useRef<UserFormData>({} as UserFormData);

  // Alias the component
  const ThisForm: React.FunctionComponent<UserFormProps> = forms[step];

  return (
    <Box
      backgroundColor={'white'}
      borderWidth="1px"
      rounded="lg"
      shadow="1px 1px 3px rgba(0,0,0,0.3)"
      maxWidth={800}
      p={6}
      m="10px auto"
    >
      <Progress
        hasStripe
        value={100 * (step + 1) / forms.length}
        mb="5%"
        mx="5%"
        isAnimated
      ></Progress>
      {
        <ThisForm
          formData={userForm}
          updateForm={appendFormData}
          incrementStep={incrementStep}
          decrementStep={decrementStep}
        />
      }
    </Box>
  );

  function appendFormData(currForm: UserFormData, newForm: FormData) {
    for (const [key, val] of newForm) {
      currForm[key] = val;
    }
  }

  function incrementStep() {
    setStep((step) => step + 1);
  }

  function decrementStep() {
    setStep((step) => step - 1);
  }
}

const Form1 = (props: UserFormProps) => {
  const newForm = useRef<HTMLFormElement>(null);
  const toast = useToast();

  return (
    <form ref={newForm} onSubmit={handleNext}>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        New User Registration
      </Heading>
      <Flex>
        <FormControl mr="5%" isRequired>
          <FormLabel htmlFor="first-name" fontWeight={'normal'}>
            First name
          </FormLabel>
          <Input id="first-name" placeholder="First name" name="first_name" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="last-name" fontWeight={'normal'}>
            Last name
          </FormLabel>
          <Input id="last-name" placeholder="First name" name="last_name" />
        </FormControl>
      </Flex>
      <FormControl mt="2%" isRequired>
        <FormLabel htmlFor="phone" fontWeight={'normal'}>
          Phone number: xxx-yyy-zzzz
        </FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <PhoneIcon color="gray.300" />
          </InputLeftElement>
          <Input id="phone" type="tel" name="phone" />
        </InputGroup>
        <FormHelperText>
          {"This isn't for us, this is to share with your travel companions"}
        </FormHelperText>
      </FormControl>
      <ButtonGroup mt="5%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            <Button type="submit" w="7rem" colorScheme="teal" variant="solid">
              Next
            </Button>
          </Flex>
        </Flex>
      </ButtonGroup>
    </form>
  );

  function handleNext(event: SyntheticEvent) {
    // Stop redirect
    event.preventDefault();

    if (newForm.current === null) return;

    const thisForm: FormData = new FormData(newForm.current);

    // Check the values
    const first_name = thisForm.get('first_name');
    if (!first_name) {
      toast({
        position: 'top',
        title: 'First name error',
        description: 'First name cannot be empty :(',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const last_name = thisForm.get('last_name');
    if (!last_name) {
      toast({
        position: 'top',
        title: 'Last name error',
        description: 'Last name cannot be empty :(',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const phone = thisForm.get('phone');
    if (!phone) {
      toast({
        position: 'top',
        title: 'Phone number error',
        description: 'Phone number must be 10 numbers long :(',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    let phoneFormatted: string = String(phone);
    phoneFormatted = phoneFormatted.replace(/\D/g, '');

    if (phoneFormatted.length !== 10) {
      toast({
        position: 'top',
        title: 'Phone number error',
        description: 'Phone number must be 10 numbers long :(',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Replace the formatted phone number into the form
    thisForm.set('phone', phoneFormatted);

    // Merge the form data
    props.updateForm(props.formData.current, thisForm);

    // Advance
    if (props.incrementStep) {
      props.incrementStep();
    }
  }
};

const Form2 = (props: UserFormProps) => {
  const user: UserModel = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();

  const listItems: Array<ReactNode> = [] as Array<ReactNode>;
  let i = 0;
  for (const [key, val] of Object.entries(props.formData.current)) {
    let icon;
    if (key === 'phone') {
        icon = FiPhone;
    } else {
        icon = FiUser;
    }

    listItems.push(
      <ListItem key={i}>
        <ListIcon as={icon} fontSize='24px' color="green.500" />
        <Text as="span" fontSize={'18px'} fontWeight={'bold'}>
          {key.replace('_', ' ')}:{' '}
        </Text>
        <Text as="span" fontSize={'18px'}>{val}</Text>
      </ListItem>
    );
    i += 1;
  }

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal">
        Is this right?
      </Heading>
      <List spacing={3} margin={4}>
        {listItems}
      </List>
      <ButtonGroup mt="5%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            <Button
              onClick={props.decrementStep}
              colorScheme="teal"
              variant="outline"
              w="7rem"
              mr="5%"
            >
              Back
            </Button>
          </Flex>
          <Button
            w="7rem"
            colorScheme="orange"
            variant="solid"
            onClick={() => handleSubmit(props.formData.current)}
          >
            Submit
          </Button>
        </Flex>
      </ButtonGroup>
    </>
  );

  async function handleSubmit(userFormData: UserFormData) {
    const formData = new FormData();
    for (const [key, val] of Object.entries(userFormData)) {
      formData.set(key, val);
    }

    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      dispatch(
        reduxUpdateUserData({
          email: user.email,
          formData: formData,
          token: token,
        })
      );
    } catch (error) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to set user data :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }
};
