import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useDispatch } from 'react-redux';
import { addTrip, makeCurrentTrip } from '../redux/TripSlice';
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
                
                const formData: URLSearchParams = new URLSearchParams();
                formData.append('destination', destination.current.value);
                formData.append('description', description.current.value);
                formData.append('start_date', departure_date.current.value);
                formData.append('end_date', return_date.current.value);

                const res: Response = await fetch('/trip/' , {
                    method: 'POST',
                    body: formData,
                    headers: fetchHelpers.getTokenFormHeader()
                })
    
                if (res.ok) {
                    const trip: TripModel = await res.json();

                    // Save this trip to state
                    dispatch(addTrip(trip));

                    // Make trip the current trip
                    dispatch(makeCurrentTrip(trip));

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