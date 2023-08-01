import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useDispatch } from 'react-redux';
import { reduxSetTrip } from '../redux/TripSlice';
import { useNavigate } from 'react-router-dom';
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
import { TripModel } from '../Models/Interfaces';

interface ChakraNewTripProps {

}

function ChakraNewTrip() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const destination = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const departure_date = useRef<HTMLInputElement>(null);
    const return_date = useRef<HTMLInputElement>(null);

    return (
      <>
        <Button onClick={onOpen}>New Trip</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Trip</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                        <FormLabel>Destination</FormLabel>
                        <Input placeholder='Destination' ref={destination}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Input placeholder='Description' ref={description}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Departure Date</FormLabel>
                        <Input placeholder='Departure Date' type="date" ref={departure_date}/>
                    </FormControl>
                        <FormControl isRequired>
                        <FormLabel>Return Date</FormLabel>
                        <Input placeholder='Return Date' type="date" ref={return_date}/>
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

            if (destination.current !== null && 
                description.current !== null && 
                departure_date.current !== null && 
                return_date.current !== null) {

                // Validate form
                const destination_entry  = destination.current.value;
                const description_entry = description.current.value;
                const start_date_entry = departure_date.current.value;
                const end_date_entry = return_date.current.value;

                if (destination_entry === '') {
                    alert('Destination cannot be empty!');
                    return;
                }
                
                if (description_entry === '') {
                    alert('Description cannot be empty!');
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
                
                const formData: URLSearchParams = new URLSearchParams();
                formData.append('destination', destination_entry);
                formData.append('description', description_entry);
                formData.append('start_date', start_date_entry);
                formData.append('end_date', end_date_entry);

                const res: Response = await fetch('/trip/' , {
                    method: 'POST',
                    body: formData,
                    headers: fetchHelpers.getTokenFormHeader()
                })
    
                if (res.ok) {
                    const trip: TripModel = await res.json();

                    // Close the modal
                    onClose();

                    // Make trip the current trip
                    dispatch(reduxSetTrip(trip));

                    // Navigate to the trip
                    navigate(`/trip/${trip.id}/home`);
    
                } else {
                    const message: any = await res.json();
                    throw new Error(JSON.stringify(message));
                }
        
            } else {
                alert('Error in form submission')
            }

            } catch (e: any) {
                console.error(e)
                alert('Unable to create trip :(')
        }
}
}

export default ChakraNewTrip;