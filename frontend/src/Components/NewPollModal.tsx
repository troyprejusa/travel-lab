import { useState, useRef, SyntheticEvent, ReactElement } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useDispatch, useSelector } from 'react-redux';
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
import { PollModel, TripModel } from '../utilities/Interfaces';

interface NewPollModalProps {
    getPollsCallback: () => void
}

function NewPollModal(props: NewPollModalProps) {

    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const trip: TripModel = useSelector((state: RootState) => state.trip);
    
    const [ pollOptionCount, setPollOptionCount ] = useState(0);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const pollForm = useRef<HTMLFormElement>(null);

    const selectOptions: Array<ReactElement> = [];
    for (let i = 1; i < 6; i++) {
        selectOptions.push(<option key={i} value={i}>{i}</option>);
    }

    const pollOptionInputs: Array<ReactElement> = [];
    for (let i = 0; i < pollOptionCount; i++) {
        pollOptionInputs.push((
            <FormControl key={i}>
                <FormLabel>{`Option ${i + 1}`}</FormLabel>
                <Input name={`pollOption_${i + 1}`}/>
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
                <form onSubmit={handleSubmit} ref={pollForm}>
                    <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder='title' name='title'/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Anonymous?</FormLabel>
                        <Radio placeholder='Description' name='anonymous'/>
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
        
        event.preventDefault();

        if (pollForm === null) return;

        const formData = new FormData(pollForm.current);
        
        // Because we want to use an array to hold the multiple
        // options, we're going to use JSON instead of the actual
        // form
        const body = {};
        body.options = [];
        for (const [key, val] of formData) {
            if (key === 'anonymous') {
                body.anonymous = true;
            } else if (key.split('_').length > 1) {
                // This is an option
                body.options.push(val);
            } else {
                // Default case
                body[key] = val;
            }
        }

        // Set anonymous field if it has not been
        if (!('anonymous' in body)) {
            body.anonymous = false;
        }

        try {
            const res: Response = await fetch(`/trip/${trip.id}/poll` , {
                method: 'POST',
                body: JSON.stringify(body),
                headers: fetchHelpers.getTokenJSONHeader()
            })

            if (res.ok) {
                // Call state update on the parent (the polls page)
                props.getPollsCallback();

                // Close the modal
                onClose();

            } else {
                const message: any = await res.json();
                throw new Error(JSON.stringify(message));
            }
        
            } catch (e: any) {
                console.error(e)
                alert('Unable to create poll :(')
        }
    }
}

export default NewPollModal;