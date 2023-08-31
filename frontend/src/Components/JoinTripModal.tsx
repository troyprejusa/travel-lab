import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
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
} from '@chakra-ui/react';

interface JoinTripModalProps {}

function JoinTripModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const joinForm = useRef<HTMLFormElement>(null);

  return (
    <>
      <Button size="md" colorScheme="teal" onClick={onOpen}>
        Join trip
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request to join trip</ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody>
            <form onSubmit={handleSubmit} ref={joinForm}>
              <FormControl isRequired>
                <FormLabel>Trip id</FormLabel>
                <Input name="trip_id" />
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
    event.preventDefault();

    if (joinForm.current === null) return;

    const formData = new FormData(joinForm.current);

    // Validate form
    const id_entry: string = formData.get('trip_id');

    if (id_entry === '') {
      alert('Trip id cannot be empty!');
      return;
    }

    try {
      const res: Response = await fetch(
        `/trip/${id_entry}/travellers/request`,
        {
          method: 'POST',
          headers: fetchHelpers.getTokenHeader(),
        }
      );

      if (res.ok) {
        // Close the modal
        onClose();
      } else {
        const errorRes: any = await res.json();
        throw new Error(errorRes);
      }
    } catch (e: any) {
      console.error(e);
      alert('Request to join trip was unsuccessful :(');
    }
  }
}

export default JoinTripModal;
