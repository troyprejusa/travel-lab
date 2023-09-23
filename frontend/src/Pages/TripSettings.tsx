import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Text,
  Divider,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { TripModel, UserModel } from '../utilities/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { Dispatch } from '@reduxjs/toolkit';
import {
  resetAfterLeavingTrip,
  resetAfterTripDelete,
} from '../utilities/stateHandlers';
import fetchHelpers from '../utilities/fetchHelpers';
import { useAuth0 } from '@auth0/auth0-react';
import ConfirmDeleteModal from '../Components/ConfirmDeleteModal';
import { DeleteButton } from '../Components/Buttons';
import TitleBar from '../Components/TitleBar';

function TripSettings(): JSX.Element {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const user: UserModel = useSelector((state: RootState) => state.user);
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const { getAccessTokenSilently } = useAuth0();
  const {
    isOpen: leaveModalIsOpen,
    onOpen: leaveModalOnOpen,
    onClose: leaveModalOnClose,
  } = useDisclosure();

  return (
    <>
      <TitleBar text='Trip Settings' />
      <Box>
        <h2>Leave trip</h2>
        <Button colorScheme="red" onClick={leaveModalOnOpen}>
          Leave
        </Button>
        <ConfirmDeleteModal
          isOpen={leaveModalIsOpen}
          onClose={leaveModalOnClose}
          deleteHandler={handleLeaveTrip}
          header={'Leave trip'}
          body={`Are you sure you want to leave trip to ${trip.destination}?`}
        />
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
        <DeleteButton
          deleteHandler={handleDeleteTrip}
          disabled={!trip.admin}
          disabledMsg={'Only trip admins can delete trip'}
          header={'Delete trip'}
          body={
            'Are you sure you want to delete this trip? This action is irreversible!'
          }
        />
      </Box>
    </>
  );

  async function handleLeaveTrip() {
    try {
      const token = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
      const res: Response = await fetch(`/user/trip/${trip.id}`, {
        method: 'DELETE',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        resetAfterLeavingTrip(dispatch);
        navigate(`/user/${user.email}/trips`);
      } else {
        const errorRes: any = await res.json();
        throw new Error(errorRes);
      }
    } catch (error: any) {
      console.error(error);
      alert('Unable to leave trip :(');
    }
  }

  async function handleDeleteTrip() {
    try {
      const token = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
      const res: Response = await fetch(`/trip/${trip.id}`, {
        method: 'DELETE',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        resetAfterTripDelete(dispatch);
        navigate(`/user/${user.email}/trips`);
      } else {
        const errorRes: any = await res.json();
        throw new Error(errorRes);
      }
    } catch (error: any) {
      console.error(error);
      alert('Unable to delete trip :(');
    }
  }
}

export default TripSettings;
