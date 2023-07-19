import { useRef } from 'react';
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
import { SyntheticEvent } from 'react';

interface ChakraNewTripProps {

}

function ChakraNewTrip() {

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

    function handleSubmit(event: SyntheticEvent) {
        event.preventDefault();

        if (destination.current !== null && 
            description.current !== null && 
            departure_date.current !== null && 
            return_date.current !== null) {
            
            // TODO: Send the fetch request
            console.log('Submit me bro!')
      
        } else {
            alert('Unable to create trip')
        }
    }
}

export default ChakraNewTrip;