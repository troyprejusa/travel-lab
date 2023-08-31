import { useState, useRef, SyntheticEvent, ReactElement } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { TripModel, NewPollModel } from '../utilities/Interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
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
  Radio,
  Box,
  Select,
  Textarea,
  ButtonGroup,
} from '@chakra-ui/react';

interface NewPollModalProps {
  getPollsCallback: () => void;
}

function NewPollModal(props: NewPollModalProps) {
  const trip: TripModel = useSelector((state: RootState) => state.trip);

  const [pollOptionCount, setPollOptionCount] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const pollForm = useRef<HTMLFormElement>(null);

  const selectOptions: Array<ReactElement> = [];
  for (let i = 2; i < 6; i++) {
    selectOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const pollOptionInputs: Array<ReactElement> = [];
  for (let i = 0; i < pollOptionCount; i++) {
    pollOptionInputs.push(
      <FormControl key={i} isRequired>
        <FormLabel>{`Option ${i + 1}`}</FormLabel>
        <Input name={`pollOption_${i + 1}`} />
      </FormControl>
    );
  }

  return (
    <>
      <ButtonGroup>
        <Button size="md" colorScheme="orange" onClick={onOpen}>
          New poll
        </Button>
      </ButtonGroup>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Poll</ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody>
            <form onSubmit={handleSubmit} ref={pollForm}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input placeholder="title" name="title" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Anonymous?</FormLabel>
                <Radio placeholder="Description" name="anonymous" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder="description" name="description" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Number of poll choices</FormLabel>
                <Select
                  placeholder="options"
                  size="md"
                  onChange={(event: SyntheticEvent) =>
                    setPollOptionCount(event.target.value)
                  }
                >
                  {selectOptions}
                </Select>
              </FormControl>
              <Box overflowY={'scroll'}>{pollOptionInputs}</Box>
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
    event.preventDefault();

    if (pollForm.current === null) return;

    const formData = new FormData(pollForm.current);

    // Because we want to use an array to hold the multiple
    // options, we're going to use JSON instead of the actual
    // form
    const pollData: NewPollModel = {
      title: '',
      anonymous: false,
      description: null,
      options: [],
    };

    for (const [key, val] of formData) {
      if (key === 'title') {
        pollData.title = val.toString();
      } else if (key === 'anonymous') {
        pollData.anonymous = true;
      } else if (key === 'description') {
        const descriptionEntry = formData.get('description');
        if (descriptionEntry !== '') pollData.description = descriptionEntry;
      } else if (key.split('_').length > 1) {
        // This is an option
        pollData.options.push(val.toString());
      }
    }

    try {
      const res: Response = await fetch(`/trip/${trip.id}/poll`, {
        method: 'POST',
        body: JSON.stringify(pollData),
        headers: fetchHelpers.getTokenJSONHeader(),
      });

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
      console.error(e);
      alert('Unable to create poll :(');
    }
  }
}

export default NewPollModal;
