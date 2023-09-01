import React, { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Text, Divider, Box, Button } from '@chakra-ui/react';
import { UserModel } from '../utilities/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { Dispatch } from '@reduxjs/toolkit';
import {
  resetAfterLeavingTrip,
  resetAfterTripDelete,
} from '../utilities/stateResets';

function TripSettings(): JSX.Element {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const user: UserModel = useSelector((state: RootState) => state.user);

  return (
    <>
      <Flex justifyContent={'center'}>
        <Text fontSize={'xl'} fontWeight={'bold'}>
          Trip Settings
        </Text>
      </Flex>
      <Box>
        <h2>Leave trip</h2>
        <Button onClick={handleLeaveTrip}>Leave</Button>
      </Box>
      <Divider />
      <h1>ADMIN ONLY</h1>
      <Box>
        <h2>Update roles</h2>
      </Box>
      <Box>
        <h2>Remove travellers</h2>
      </Box>
      <Box>
        <h2>Delete trip</h2>
        <Button onClick={handleDeleteTrip}>Delete</Button>
      </Box>
    </>
  );

  async function handleLeaveTrip(event: SyntheticEvent) {
    try {
      // TODO: Add logic here
      resetAfterLeavingTrip(dispatch);
      navigate(`/user/${user.email}/trips`);
    } catch (error: any) {
      console.error(error);
      alert('Unable to leave trip :(');
    }
  }

  async function handleDeleteTrip(event: SyntheticEvent) {
    try {
      // TODO: Add logic here
      resetAfterTripDelete(dispatch);
      navigate(`/user/${user.email}/trips`);
    } catch (error: any) {
      console.error(error);
      alert('Unable to delete trip :(');
    }
  }
}

export default TripSettings;
