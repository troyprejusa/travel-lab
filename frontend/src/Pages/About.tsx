import { ReactElement } from 'react';
import TroyPortrait from '../assets/troy-prejusa-portrait.jpeg';
import {
  Text,
  Container,
  SimpleGrid,
  Flex,
  Heading,
  Stack,
  Icon,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import { IoLogoGithub, IoLogoLinkedin, IoMail } from 'react-icons/io5';

interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
}

function About() {
  return (
    <Container maxW={'5xl'} py={8}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Heading size={'lg'}>About Troy's Travel Lab</Heading>
          <Heading size={'md'} fontWeight={'normal'}>
            Created by Troy Prejusa
          </Heading>
          <Text color={'gray.500'} fontSize={'lg'}>
            Troy's Travel Lab was created out of a frustration with the process
            of planning trips with friends. Time and time again, we would create
            shared calendars to track events, spreadsheets to jot down important
            details, and message threads to stay in communcation regarding the
            details. Troy's Travel Lab is my way of bringing these resources
            together to plan a trip all in one place.
          </Text>
          <Text color={'gray.500'} fontSize={'lg'}>
            If you experience any issues or need any support with this
            application, feel free to contact me.
          </Text>
        </Stack>
        <Flex flexDirection={'column'}>
          <Image
            src={TroyPortrait}
            borderRadius={'full'}
            boxSize={'300px'}
            alt={'Troy Prejusa portrait'}
            margin={'1rem'}
          />
          <Stack spacing={4}>
            <Feature
              icon={<Icon as={IoMail} color={'purple.500'} w={5} h={5} />}
              iconBg={useColorModeValue('purple.100', 'purple.900')}
              text={'troyprejusa@gmail.com'}
            />
            <Feature
              icon={<Icon as={IoLogoLinkedin} color={'blue.500'} w={5} h={5} />}
              iconBg={useColorModeValue('blue.100', 'blue.900')}
              text={'linkedin.com/in/troyprejusa'}
            />
            <Feature
              icon={<Icon as={IoLogoGithub} color={'gray.500'} w={5} h={5} />}
              iconBg={useColorModeValue('gray.100', 'gray.900')}
              text={'github.com/troyprejusa'}
            />
          </Stack>
        </Flex>
      </SimpleGrid>
    </Container>
  );
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex
        w={8}
        h={8}
        align={'center'}
        justify={'center'}
        rounded={'full'}
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

export default About;
