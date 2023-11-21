import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useAuth0 } from '@auth0/auth0-react';
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
  useToast,
} from '@chakra-ui/react';

// interface JoinTripModalProps {}

function JoinTripModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const joinForm = useRef<HTMLFormElement>(null);
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();

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
            <form ref={joinForm} onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Trip id</FormLabel>
                <Input name="trip_id" type='text'/>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Request
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
    if (event.type === 'submit') {
      event.preventDefault();
    }

    if (joinForm.current === null) return;

    const formData = new FormData(joinForm.current);

    // Validate form
    const id_entry: string = formData.get('trip_id') as string;

    if (id_entry === '') {
      alert('Trip id cannot be empty!');
      return;
    }

    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      const res: Response = await fetch(`/user/trips/${id_entry}`, {
        method: 'POST',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        // Close the modal
        onClose();
        toast({
          position: 'top',
          title: 'Request sent :)',
          description: 'Check back later to see if a trip admin admits you!',
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      } else {
        const errorRes = await res.json();
        console.error(errorRes);
        toast({
          position: 'top',
          title: 'Unable to request to join this trip :(',
          description: errorRes.detail.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to request to join this trip :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }
}

export default JoinTripModal;
