import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useDispatch } from 'react-redux';
import { reduxFetchTravellers } from '../redux/TravellersSlice';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';
import { TripModel } from '../utilities/Interfaces';

interface NewTravellerModalProps {}

function NewTravellerModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const travellerForm = useRef<HTMLFormElement>(null);

  return (
    <>
      <Button size="md" colorScheme="orange" onClick={onOpen}>
        Add traveller
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add traveller</ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody>
            <form ref={travellerForm}>
              <FormControl isRequired>
                <FormLabel>Destination</FormLabel>
                <Input placeholder="Destination" name="destination" />
              </FormControl>
              <FormControl isRequired>
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
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
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

  // async function handleSubmit(event: SyntheticEvent) {

  //     event.preventDefault();

  //     if (tripForm.current === null) return

  //     const formData = new FormData(tripForm.current)

  //     // Validate form
  //     const destination_entry: string  = formData.get('destination');
  //     const description_entry: string = formData.get('description');
  //     const start_date_entry: string = formData.get('start_date');
  //     const end_date_entry: string = formData.get('end_date');

  //     if (destination_entry === '') {
  //         alert('Destination cannot be empty!');
  //         return;
  //     }

  //     if (description_entry === '') {
  //         alert('Description cannot be empty!');
  //         return;
  //     }

  //     if (start_date_entry === '') {
  //         alert('Departure date cannot be empty!');
  //         return;
  //     }

  //     if (end_date_entry === '') {
  //         alert('Return date cannot be empty!');
  //         return;
  //     }

  //     if (Date.parse(start_date_entry) > Date.parse(end_date_entry)) {
  //         alert('Start date cannot be after end time!');
  //         return;
  //     }

  //     try {
  //         const res: Response = await fetch('/trip/' , {
  //             method: 'POST',
  //             body: formData,
  //             headers: fetchHelpers.getTokenHeader(token)
  //         })

  //         if (res.ok) {
  //             const trip: TripModel = await res.json();

  //             // Close the modal
  //             onClose();

  //             // Make trip the current trip
  //             dispatch(reduxSetTrip(trip));

  //             // Navigate to the trip
  //             navigate(`/trip/${trip.id}/home`);

  //         } else {
  //             const message: any = await res.json();
  //             throw new Error(JSON.stringify(message));
  //         }

  //     } catch (e: any) {
  //         console.error(e)
  //         alert('Unable to create trip :(')
  //     }
  // }
}

export default NewTravellerModal;
