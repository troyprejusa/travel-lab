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
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';

interface JoinTripModalProps {}

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
          title: 'Request sent :)',
          description: 'Check back later to see if a trip admin admits you!',
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      } else {
        const errorRes: any = await res.json();
        throw new Error(errorRes);
      }
    } catch (error: any) {
      console.error(error);
      toast({
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
