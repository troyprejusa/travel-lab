import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

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
          {/* <Box as="a" href={'#'}>
            FAQ
          </Box>
          <Box as="a" href={'#'}>
            Contact Us
          </Box> */}
            <Box
            cursor={'pointer'}
            onClick={() => navigate('/')}
          >
            Home
          </Box>
          <Box
            cursor={'pointer'}
            onClick={() => navigate('/termsandconditions')}
          >
            Terms and Conditions
          </Box>
          <Box cursor={'pointer'} onClick={() => navigate('/licenses')}>
            Third-Party Licenses
          </Box>
        </Stack>
        <Text>2023 Travel Lab</Text>
      </Container>
    </Box>
  );
}
