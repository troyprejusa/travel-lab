import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { TripModel, ItineraryModel } from '../Models/Interfaces';
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
    Input
} from '@chakra-ui/react'

interface NewItineraryModalProps {

}

function NewItineraryModal(props: any) {

    const trip: TripModel = useSelector((state: RootState) => state.trip);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const title = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const start_time = useRef<HTMLInputElement>(null);
    const end_time = useRef<HTMLInputElement>(null);

    return (
      <>
        <Button onClick={onOpen} colorScheme={'orange'} width={'20%'} minWidth={'max-content'}>New Stop</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Trip</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder='Title' ref={title}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Input placeholder='Description' ref={description}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Start Time</FormLabel>
                        <Input placeholder='Departure Date' type="datetime-local" ref={start_time}/>
                    </FormControl>
                        <FormControl isRequired>
                        <FormLabel>End Time</FormLabel>
                        <Input placeholder='Return Date' type="datetime-local" ref={end_time}/>
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
        
        try {

            event.preventDefault();

            if (title.current !== null && 
                description.current !== null && 
                start_time.current !== null && 
                end_time.current !== null) {

                // Validate form
                const title_entry  = title.current.value;
                const description_entry = description.current.value;
                const start_time_entry = start_time.current.value;
                const end_time_entry = end_time.current.value;

                if (title_entry === '') {
                    alert('Title cannot be empty!');
                    return;
                }
                
                if (description_entry === '') {
                    alert('Description cannot be empty!');
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
                
                const formData: URLSearchParams = new URLSearchParams();
                formData.append('title',title_entry);
                formData.append('description', description_entry);
                formData.append('start_time', start_time_entry);
                formData.append('end_time', end_time_entry);

                const res: Response = await fetch(`/trip/${trip.id}/itinerary` , {
                    method: 'POST',
                    body: formData,
                    headers: fetchHelpers.getTokenFormHeader()
                })
    
                if (res.ok) {
                    props.getItinerary();
                    onClose();

                } else {
                    const json: any = await res.json();
                    throw new Error(json.message);
                }
        
            } else {
                alert('Error in form submission')
            }

            } catch (e: any) {
                console.error(e)
                alert('Unable to add stop :(')
        }
    }
}

export default NewItineraryModal;