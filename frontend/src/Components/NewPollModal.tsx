import { useState, useRef, SyntheticEvent, ReactElement } from 'react';
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
    Input,
    Radio,
    Box,
    Select
} from '@chakra-ui/react'
import { TripModel } from '../utilities/Interfaces';

interface NewTripModalProps {

}

function NewTripModal() {

    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const trip: TripModel = useSelector((state: RootState) => state.trip);
    
    const [ pollOptionCount, setPollOptionCount ] = useState(0);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const title = useRef<HTMLInputElement>(null);
    const anonymous = useRef<HTMLInputElement>(null);

    const selectOptions: Array<ReactElement> = [];
    for (let i = 1; i < 6; i++) {
        selectOptions.push(<option key={i} value={i}>{i}</option>);
    }

    const pollOptionInputs: Array<ReactElement> = [];
    for (let i = 0; i < pollOptionCount; i++) {
        pollOptionInputs.push((
            <FormControl key={i} id={`pollOption_${i}`}>
                <FormLabel>{`Option ${i + 1}`}</FormLabel>
                <Input />
            </FormControl>
        ))
    }

    return (
      <>
        <Button onClick={onOpen}>New Poll</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Poll</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder='title' ref={title}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Anonymous?</FormLabel>
                        <Radio placeholder='Description' ref={anonymous}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Number of poll choices</FormLabel>
                        <Select placeholder='options' size='md' onChange={(event: SyntheticEvent) => setPollOptionCount(event.target.value)}>
                            {selectOptions}
                        </Select>
                    </FormControl>
                    <Box overflowY={'scroll'}>
                        {pollOptionInputs}
                    </Box>
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
                anonymous.current !== null) {

                // Validate form
                const title_entry: string  = title.current.value;
                const anonymous_entry = anonymous.current.value;

                if (title_entry === '') {
                    alert('Title cannot be empty!');
                    return;
                }
                
                const formData: URLSearchParams = new URLSearchParams();
                formData.append('title', title_entry);
                formData.append('anonymous', anonymous_entry);
                
                // TODO:
                for (let i = 0; i < pollOptionCount; i++) {
                    formData.append(`${ajdfflajdl;kfj;akljdf}`)
                }

                const res: Response = await fetch(`/trip/${trip.id}/poll` , {
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

export default NewTripModal;