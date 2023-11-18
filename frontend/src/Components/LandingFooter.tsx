import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const links = [
  {
    text: 'Home',
    ref: '/',
  },
  {
    text: 'Privacy Policy',
    ref: '/privacy',
  },
  {
    text: 'Terms and Conditions',
    ref: '/termsandconditions',
  },
  {
    text: 'Licenses',
    ref: '/licenses',
  }
];

export default function LandingFooter() {
  const navigate = useNavigate();
  return (
    <Box
      position={'absolute'}
      left="0"
      bottom="0"
      width="full"
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Stack direction={'row'} spacing={6}>
          {links.map((link, i) => (
            <Box key={`link_${i}`}cursor={'pointer'} onClick={() => navigate(link.ref)}>
              {link.text}
            </Box>
          ))}
        </Stack>
        <Text>2023 Troy's Travel Lab</Text>
      </Container>
    </Box>
  );
}
