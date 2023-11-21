import { UserModel } from '../utilities/Interfaces';
import { AvatarWrapper } from './AvatarWrapper';
import {
  Heading,
  Box,
  Center,
  Stack,
  Badge,
} from '@chakra-ui/react';

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
        />
        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {`${props.userData.first_name} ${props.userData.last_name}`}
        </Heading>

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
      </Box>
    </Center>
  );
}
