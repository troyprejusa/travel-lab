import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeCurrentTrip } from '../redux/TripSlice';
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Wrap,
} from '@chakra-ui/react';
import { TripModel } from '../Models/Interfaces';
import { RootState } from '../redux/Store';


interface ChakraTripCardProps {
  tripData: TripModel,
  handleDelete: (event: SyntheticEvent) => void
}
  

export default function ChakraTripCard(props: ChakraTripCardProps) {
  const handleViewClick = (event: SyntheticEvent) => {
    dispatch(makeCurrentTrip(props.tripData));
    navigate(`/trip/${props.tripData.destination}/home`);
  }

  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  return (
    <Center py={6}>
      <Box
        maxW={'270px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}>
        <Image
          h={'120px'}
          w={'full'}
          src={
            'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
          }
          objectFit={'cover'}
        />
        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
              {props.tripData.destination}
            </Heading>
            <Text color={'gray.500'}>{props.tripData.description}</Text>
          </Stack>

          <Stack direction={'row'} justify={'center'} spacing={6}>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>{props.tripData.start_date.toString()}</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Depart
              </Text>
            </Stack>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>{props.tripData.end_date.toString()}</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Return
              </Text>
            </Stack>
          </Stack>

          <Wrap>
            <Button
              onClick={handleViewClick}
              w={'full'}
              mt={8}
              bg={useColorModeValue('#151f21', 'gray.900')}
              color={'white'}
              rounded={'md'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}>
              View
            </Button>
            {/* <Button
              id={`delete${props.tripIndex}`}
              onClick={props.handleDelete}
              w={'full'}
              mt={8}
              bg={useColorModeValue('#151f21', 'gray.900')}
              color={'white'}
              rounded={'md'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}>
              Delete
            </Button> */}
          </Wrap>
        </Box>
      </Box>
    </Center>
  );
}