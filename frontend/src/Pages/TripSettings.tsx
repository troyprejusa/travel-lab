import { useNavigate } from 'react-router-dom';
import { TripModel, UserModel } from '../utilities/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/Store';
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
  // Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
  Badge,
} from '@chakra-ui/react';
import {
  resetAfterLeavingTrip,
  resetAfterTripDelete,
} from '../utilities/stateHandlers';
import fetchHelpers from '../utilities/fetchHelpers';
import { useAuth0 } from '@auth0/auth0-react';
import {
  AcceptUserButton,
  RejectUserButton,
  // PromoteUserButton,
  TrashButton,
  ConfigurableButtonAndModal,
} from '../Components/Buttons';
import TitleBar from '../Components/TitleBar';
import {
  reduxAcceptTraveller,
  reduxRemoveTraveller,
} from '../redux/TravellersSlice';

function TripSettings(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user: UserModel = useSelector((state: RootState) => state.user);
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const travellers: Array<UserModel> = useSelector(
    (state: RootState) => state.travellers
  );
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();

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
            <Alert status="info">
              <AlertIcon />
              <AlertTitle>Photo upload feature in work</AlertTitle>
            </Alert>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Join requests{' '}
                <span>
                  <Badge
                    rounded="full"
                    px="2"
                    fontSize="0.8em"
                    colorScheme={user.admin ? 'green' : 'red'}
                  >
                    admin
                  </Badge>
                </span>
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
                Traveller Roles{' '}
                <span>
                  <Badge
                    rounded="full"
                    px="2"
                    fontSize="0.8em"
                    colorScheme={user.admin ? 'green' : 'red'}
                  >
                    admin
                  </Badge>
                </span>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Promote travellers to administrators (feature in work), or remove travellers from
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
                                    ? 'remove user from trip'
                                    : 'only admins can remove users from trip'
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
                Delete trip{' '}
                <span>
                  <Badge
                    rounded="full"
                    px="2"
                    fontSize="0.8em"
                    colorScheme={user.admin ? 'green' : 'red'}
                  >
                    admin
                  </Badge>
                </span>
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
    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      dispatch(
        reduxAcceptTraveller({ token: token, trip_id: trip.id, user_id: id })
      );
    } catch (error) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to accept user :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }

  async function handleRejectUser(id: string) {
    // For now, there's no reason for this logic to be different
    handleDeleteUser(id);
  }

  async function handleDeleteUser(id: string) {
    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      dispatch(
        reduxRemoveTraveller({ token: token, trip_id: trip.id, user_id: id })
      );
    } catch (error) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to reject user :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }

  async function handleLeaveTrip() {
    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      const res: Response = await fetch(`/user/trips/${trip.id}`, {
        method: 'DELETE',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        resetAfterLeavingTrip(dispatch);
        navigate(`/user/${user.email}/trips`);
      } else {
        const errorRes = await res.json();
        throw new Error(errorRes);
      }
    } catch (error) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to leave trip :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
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
        const errorRes = await res.json();
        throw new Error(errorRes);
      }
    } catch (error) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to delete trip :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }
}

export default TripSettings;
