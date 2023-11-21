import {
  Box,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react'

interface StatsCardProps {
  title: string
  stat: string
}
function StatsCard(props: StatsCardProps) {
  const { title, stat } = props
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}>
      <StatLabel fontWeight={'medium'} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {stat}
      </StatNumber>
    </Stat>
  )
}

export default function LandingStatistics() {
  return (
    <Box maxW="5xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Text textAlign={'center'} fontSize={'4xl'} py={10}>
        Who uses <Box as='span' fontWeight={'bold'}>Troy's Travel Lab</Box>?
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard title={'We serve'} stat={'<10 people'} />
        <StatsCard title={'In'} stat={'At least 1 country'} />
        <StatsCard title={'Who speak'} stat={'At least 1 language'} />
      </SimpleGrid>
    </Box>
  )
}