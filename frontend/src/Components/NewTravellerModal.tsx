import { useRef, SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';
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
  Text,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { TripModel } from '../utilities/Interfaces';
import { RootState } from '../redux/Store';
import { ConfigurableButton } from './Buttons';

interface NewTravellerModalProps {}

function NewTravellerModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trip: TripModel = useSelector((state: RootState) => state.trip);

  // TODO: Future enhancement to use the form to invite users
  const travellerForm = useRef<HTMLFormElement>(null);

  return (
    <>
      <Button size="md" colorScheme="orange" onClick={onOpen}>
        Invite user
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add traveller</ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody>
            <Alert status="info">
              <AlertIcon />
              <AlertTitle>Traveller invite feature in work</AlertTitle>
            </Alert>
            <Text>
              For now, have travellers request to join trip from the trip
              selection screen. Request to join this trip using the trip id for
              this trip:
            </Text>
            <br></br>
            <Text>{trip.id}</Text>
            <br></br>
            <form ref={travellerForm} onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="email" name="email" />
                <FormHelperText>
                  Email must belong to a current Travel Lab user
                </FormHelperText>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <ConfigurableButton
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              disabled={true}
              tooltipMsg="Feature in work"
            >
              Invite
            </ConfigurableButton>
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
    
    if (travellerForm.current === null) return;

    const formData = new FormData(travellerForm.current);

    // Validate form
  }
}

export default NewTravellerModal;
