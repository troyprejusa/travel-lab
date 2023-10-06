import splashphotoHero from '../assets/tripphoto.jpg';
import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
    FiCalendar,
    FiBriefcase,
    FiMessageSquare,
} from 'react-icons/fi';
import { ReactElement } from 'react';

interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
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

export default function LandingHero() {
  return (
    <Container maxW={'5xl'} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
        <Heading
          fontFamily="monospace"
          fontSize={'60px'}
          userSelect={'none'}
          cursor={'default'}
        >
          Travel | Lab
        </Heading>
          <Text
            textTransform={'uppercase'}
            color={'blue.400'}
            fontWeight={600}
            fontSize={'sm'}
            bg={useColorModeValue('blue.50', 'blue.900')}
            p={2}
            alignSelf={'flex-start'}
            rounded={'md'}
          >
            {'<alpha release 0.0.1>'}
          </Text>
          <Heading>
            Planning a group trip{' '}
            <Text as={'span'} color={'orange.400'}>
              simplified
            </Text>
          </Heading>
          <Text color={'gray.500'} fontSize={'lg'}>
            Collaborate with your travel partners to organize the details of
            your trip
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.100', 'gray.700')}
              />
            }
          >
            <Feature
              icon={
                <Icon as={FiCalendar} color={'yellow.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('yellow.100', 'yellow.900')}
              text={'Itinerary Planning'}
            />
            <Feature
              icon={<Icon as={FiBriefcase} color={'green.500'} w={5} h={5} />}
              iconBg={useColorModeValue('green.100', 'green.900')}
              text={'Group Packing'}
            />
            <Feature
              icon={
                <Icon as={FiMessageSquare} color={'purple.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('purple.100', 'purple.900')}
              text={'Messaging Board'}
            />
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={'md'}
            alt={'feature image'}
            src={
              splashphotoHero
            }
            objectFit={'cover'}
          />
        </Flex>
      </SimpleGrid>
    </Container>
  );
}
