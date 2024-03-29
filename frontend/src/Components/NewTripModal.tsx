import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useDispatch } from 'react-redux';
import { reduxSetTrip } from '../redux/TripSlice';
import { useNavigate } from 'react-router-dom';
import { TripModel } from '../utilities/Interfaces';
import { useAuth0 } from '@auth0/auth0-react';
import {
  itinerarySocket,
  msgSocket,
  packingSocket,
  pollSocket,
} from '../utilities/TripSocket';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  // ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
  FormHelperText,
  Select,
} from '@chakra-ui/react';
import Constants from '../utilities/Constants';

// interface NewTripModalProps {}

function NewTripModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const tripForm = useRef<HTMLFormElement>(null);
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();

  return (
    <>
      <Button size="md" colorScheme="orange" onClick={onOpen}>
        Create trip
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Trip</ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody>
            <form ref={tripForm} onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Destination</FormLabel>
                <Input placeholder="Destination" name="destination" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input placeholder="Description" name="description" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Departure Date</FormLabel>
                <Input
                  placeholder="Departure Date"
                  type="date"
                  name="start_date"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Return Date</FormLabel>
                <Input placeholder="Return Date" type="date" name="end_date" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select name='vacation_type' defaultValue={'road_trip'}>
                  <option value="tropical">Tropical</option>
                  <option value="wilderness">Wilderness</option>
                  <option value="city">City</option>
                  <option value="historical">Historical</option>
                  <option value="countryside">Countryside</option>
                  <option value="road_trip">Road Trip</option>
                  <option value="winter">Winter</option>
                </Select>
                <FormHelperText>
                  We use this to provide a default trip picture
                </FormHelperText>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

  async function handleSubmit(event: SyntheticEvent) {
    if (event.type === 'submit') {
      event.preventDefault();
    }

    if (tripForm.current === null) return;

    const formData = new FormData(tripForm.current);

    // Validate form
    const destination_entry: string = formData.get('destination') as string;
    const start_date_entry: string = formData.get('start_date') as string;
    const end_date_entry: string = formData.get('end_date') as string;

    if (destination_entry === '') {
      alert('Destination cannot be empty!');
      return;
    }

    if (start_date_entry === '') {
      alert('Departure date cannot be empty!');
      return;
    }

    if (end_date_entry === '') {
      alert('Return date cannot be empty!');
      return;
    }

    if (Date.parse(start_date_entry) > Date.parse(end_date_entry)) {
      alert('Start date cannot be after end time!');
      return;
    }

    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      const res: Response = await fetch(`${Constants.API_PREFIX}/trip/`, {
        method: 'POST',
        body: formData,
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        const trip: TripModel = await res.json();

        // Close the modal
        onClose();

        // Make trip the current trip
        dispatch(reduxSetTrip(trip));

        // Establish a websocket connection for this trip
        itinerarySocket.establishSocket(token, trip.id, dispatch);
        pollSocket.establishSocket(token, trip.id, dispatch);
        packingSocket.establishSocket(token, trip.id, dispatch);
        msgSocket.establishSocket(token, trip.id, dispatch);

        // Navigate to the trip
        navigate(`/trip/${trip.id}/home`);

      } else {
        const errorRes = await res.json();
        console.error(errorRes);
        toast({
          position: 'top',
          title: 'Unable to create trip :(',
          description: errorRes.detail.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to create trip :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }
}

export default NewTripModal;
