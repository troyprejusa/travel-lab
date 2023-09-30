import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
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
import {
  AcceptUserButton,
  RejectUserButton,
  PromoteUserButton,
  TrashButton,
  ConfigurableButtonAndModal,
} from '../Components/Buttons';
import TitleBar from '../Components/TitleBar';
import { reduxAcceptTraveller, reduxRemoveTraveller } from '../redux/TravellersSlice';

function TripSettings(): JSX.Element {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const user: UserModel = useSelector((state: RootState) => state.user);
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const travellers: Array<UserModel> = useSelector(
    (state: RootState) => state.travellers
  );
  const { getAccessTokenSilently } = useAuth0();

  return (
    <>
      <TitleBar text="Trip Settings" />
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Trip photo
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>insert text here</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Join requests
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>Accept or deny requests to join trip.</Text>
            <TableContainer marginTop={6} borderRadius={'6px'}>
              <Table variant="striped" colorScheme="blackAlpha">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {travellers
                    .filter((traveller: UserModel) => !traveller.confirmed)
                    .map((traveller: UserModel, i: number) => {
                      return (
                        <Tr key={i}>
                          <Td>{`${traveller.first_name} ${traveller.last_name}`}</Td>
                          <Td>
                            <ButtonGroup>
                              <AcceptUserButton
                                aria-label="Accept user request"
                                onClick={() => handleAcceptUser(traveller.id)}
                                disabled={!user.admin}
                                tooltipMsg={
                                  user.admin
                                    ? 'Accept request'
                                    : 'Only admins can accept requests'
                                }
                              />
                              <RejectUserButton
                                aria-label="Reject user request"
                                onClick={() => handleRejectUser(traveller.id)}
                                disabled={!user.admin}
                                tooltipMsg={
                                  user.admin
                                    ? 'Reject request'
                                    : 'Only admins can reject requests'
                                }
                              />
                            </ButtonGroup>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Traveller Roles
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Promote travellers to administrators, or remove travellers from
              trip.
            </Text>
            <TableContainer marginTop={6} borderRadius={'6px'}>
              <Table variant="striped" colorScheme="blackAlpha">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {travellers
                    .filter(
                      (traveller: UserModel) =>
                        traveller.confirmed && traveller.id !== user.id
                    )
                    .map((traveller: UserModel, i: number) => {
                      return (
                        <Tr key={i}>
                          <Td>{`${traveller.first_name} ${traveller.last_name}`}</Td>
                          <Td>
                            <ButtonGroup>
                              {/* <PromoteUserButton /> */}
                              <TrashButton
                                aria-label="Remove user"
                                onClick={() => handleDeleteUser(traveller.id)}
                                disabled={!user.admin}
                                tooltipMsg={
                                  user.admin
                                    ? 'Remove user from trip'
                                    : 'Only admins can remove users from trip'
                                }
                              />
                            </ButtonGroup>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Leave Trip
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              If you leave the trip, it will not affect any other members of the
              trip.
            </Text>
            <ConfigurableButtonAndModal
              onClick={handleLeaveTrip}
              modalHeader={'Leave trip'}
              modalBody={`Are you sure you want to leave trip to ${trip.destination}?`}
            >
              Leave Trip
            </ConfigurableButtonAndModal>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Delete trip
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              If you delete this trip, it will delete the trip for all users,
              and permanently delete all data associated with this trip.
            </Text>
            <ConfigurableButtonAndModal
              onClick={handleDeleteTrip}
              tooltipMsg={user.admin ? '' : 'Only trip admins can delete trip'}
              disabled={!user.admin}
              modalHeader={'Delete trip'}
              modalBody={
                'Are you sure you want to delete this trip? This action is irreversible!'
              }
            >
              Delete Trip
            </ConfigurableButtonAndModal>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );

  async function handleAcceptUser(id: string) {
    let token: string;
    try {
      token = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
    } catch (error: any) {
      console.error(error);
    }
    reduxAcceptTraveller({token: token, trip_id: trip.id, user_id: id });
  }

  async function handleRejectUser(id: string) {
    // For now, there's no reason for this logic to be different
    handleDeleteUser(id);

  }

  async function handleDeleteUser(id: string) {
    let token: string;
    try {
      token = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
    } catch (error: any) {
      console.error(error);
    }
    reduxRemoveTraveller({token: token, trip_id: trip.id, user_id: id });
  }

  async function handleLeaveTrip() {
    try {
      const token: string = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
      const res: Response = await fetch(`/user/trips/${trip.id}`, {
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
