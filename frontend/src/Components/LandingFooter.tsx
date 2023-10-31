import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function SmallWithNavigation() {
  const navigate = useNavigate();
  return (
    <Box
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
          <Box as="a" href={'#'}>
            FAQ
          </Box>
          <Box as="a" href={'#'}>
            Contact Us
          </Box>
          <Box as="a" href={'#'}>
            Terms and Conditions
          </Box>
          <Box onClick={() => {navigate('/licenses')}} cursor={'pointer'}>
            Third-Party Licenses
          </Box>
        </Stack>
        <Text>2023 Travel Lab. All rights reserved</Text>
      </Container>
    </Box>
  );
}
