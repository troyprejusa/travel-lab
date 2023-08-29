import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { TripModel, ItineraryModel } from '../utilities/Interfaces';
import {
    Button,
    ButtonGroup,
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
    Input
} from '@chakra-ui/react'

interface NewItineraryModalProps {

}

function NewItineraryModal(props: any) {

    const trip: TripModel = useSelector((state: RootState) => state.trip);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const itineraryForm = useRef<HTMLFormElement>(null);

    return (
      <>
        <ButtonGroup>
            <Button size='md' colorScheme='orange' onClick={onOpen}>New stop</Button>
        </ButtonGroup>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Trip</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <form onSubmit={handleSubmit} ref={itineraryForm}>
                    <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder='Title' name='title' />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input placeholder='Description' name='description' />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Start Time</FormLabel>
                        <Input placeholder='Departure Date' name='start_time' type="datetime-local" />
                    </FormControl>
                        <FormControl isRequired>
                        <FormLabel>End Time</FormLabel>
                        <Input placeholder='Return Date' name='end_time' type="datetime-local" />
                    </FormControl>
                </form>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>Create</Button>
              <Button variant='ghost' onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )

    async function handleSubmit(event: SyntheticEvent) {
        
        event.preventDefault();

        if (itineraryForm.current === null) return;

        const formData = new FormData(itineraryForm.current);

        // Validate form
        const title_entry  = formData.get('title');
        // const description_entry = formData.get('description');
        const start_time_entry = formData.get('start_time');
        const end_time_entry = formData.get('end_time');

        if (title_entry === '') {
            alert('Title cannot be empty!');
            return;
        }
        
        if (start_time_entry === '') {
            alert('Start time cannot be empty!');
            return;
        }
        
        if (end_time_entry === '') {
            alert('End time cannot be empty!');
            return;
        }

        if (Date.parse(start_time_entry) > Date.parse(end_time_entry)) {
            alert('Event end cannot be before event start!');
            return;
        }
                
        try {
            const res: Response = await fetch(`/trip/${trip.id}/itinerary` , {
                method: 'POST',
                body: formData,
                headers: fetchHelpers.getTokenHeader()
            })

            if (res.ok) {
                props.getItinerary();
                onClose();

            } else {
                const json: any = await res.json();
                throw new Error(json.message);
            }
        

        } catch (e: any) {
            console.error(e)
            alert('Unable to add stop :(')
        }
    }
}

export default NewItineraryModal;