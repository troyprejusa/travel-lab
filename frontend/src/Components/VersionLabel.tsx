import { Box, Text } from '@chakra-ui/react';

export default function VersionLabel() {
  return (
    <Box width={'max-content'} userSelect={'none'}>
      <Text
        color={'blue.400'}
        fontWeight={600}
        fontSize={'sm'}
        bg={'blue.50'}
        p={2}
        alignSelf={'flex-start'}
        rounded={'md'}
      >
        {'ALPHA v0.0.1'}
      </Text>
    </Box>
  );
}
