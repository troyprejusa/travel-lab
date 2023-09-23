import { UserModel } from '../utilities/Interfaces';
import Constants from '../utilities/Constants';
import {
  Heading,
  Box,
  Center,
  Text,
  Stack,
  Link,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { AvatarWrapper } from './AvatarWrapper';

interface ContactCardProps {
  userData: UserModel;
}

export default function ContactCard(props: ContactCardProps) {
  return (
    <Center py={6}>
      <Box
        maxW={'320px'}
        w={'full'}
        background={'transparent'}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}
      >
        <AvatarWrapper
          userData={props.userData}
          size={'xl'}
          mb={4}
          pos={'relative'}
          // _after={{
          //   content: '""',
          //   w: 4,
          //   h: 4,
          //   bg: 'green.300',
          //   border: '2px solid white',
          //   rounded: 'full',
          //   pos: 'absolute',
          //   bottom: 0,
          //   right: 3,
          // }}
        />
        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {`${props.userData.first_name} ${props.userData.last_name}`}
        </Heading>
        {/* <Text fontWeight={600} color={'gray.500'} mb={4}>
            {`${props.userData.email}`}
          </Text> */}

        <Stack
          align={'flex-start'}
          justify={'flex-start'}
          direction={'column'}
          mt={6}
        >
          <Badge
            px={2}
            py={1}  
            background={'transparent'}
            fontWeight={'400'}
          >
            {`Email: ${props.userData.email}`}
          </Badge>
          <Badge
            px={2}
            py={1}
            background={'transparent'}
            fontWeight={'400'}
          >
            {`Phone: ${props.userData.phone}`}
          </Badge>
        </Stack>

        {/* <Stack mt={8} direction={'row'} spacing={4}>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              _focus={{
                bg: 'gray.200',
              }}>
              Message
            </Button>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500',
              }}
              _focus={{
                bg: 'blue.500',
              }}>
              Follow
            </Button>
          </Stack> */}
      </Box>
    </Center>
  );
}
