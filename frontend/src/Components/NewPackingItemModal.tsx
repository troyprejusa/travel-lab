import { useRef, SyntheticEvent } from 'react';
import { packingSocket } from '../utilities/TripSocket';
import {
  Button,
  ButtonGroup,
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
  Textarea,
} from '@chakra-ui/react';
import { NewPackingWS, TripModel, UserModel } from '../utilities/Interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

// interface NewItemModalProps {}

function NewItemModal() {
  const user: UserModel = useSelector((state: RootState) => state.user);
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const itemForm = useRef<HTMLFormElement>(null);

  return (
    <>
      <ButtonGroup>
        <Button size="md" colorScheme="orange" onClick={onOpen}>
          Add item
        </Button>
      </ButtonGroup>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Item</ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody>
            <form ref={itemForm} onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Item</FormLabel>
                <Input placeholder="item" name="item" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Quantity</FormLabel>
                <Input type="number" name="quantity" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder="description" name="description" />
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
    if (event.type === 'submit') {
      event.preventDefault();
    }

    if (itemForm.current === null) return;

    const formData = new FormData(itemForm.current);

    // Validate form
    const item: string = formData.get('item') as string;
    const quantity: string = formData.get('quantity') as string;

    if (item === '') {
      alert('Item cannot be empty!');
      return;
    }

    if (quantity === '' || parseInt(quantity) < 1) {
      alert('Quantity entry is not valid!');
      return;
    }

    const new_packing = {
      trip_id: trip.id,
      created_by: user.email,
      ...Object.fromEntries(formData.entries()),
    } as NewPackingWS;

    if (new_packing.description === '') new_packing.description = null;

    packingSocket.sendItem(new_packing);

    // Close the modal
    onClose();
  }
}

export default NewItemModal;
