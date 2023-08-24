import { useRef, SyntheticEvent } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
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
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Textarea
} from '@chakra-ui/react'
import { TripModel } from '../utilities/Interfaces';

interface NewItemModalProps {
    getItemsCallback: () => void
}

function NewItemModal(props: NewItemModalProps) {

    const trip: TripModel = useSelector((state: RootState) => state.trip);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const itemForm = useRef<HTMLFormElement>(null);

    return (
      <>
        <Button onClick={onOpen}>Add item</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Item</ModalHeader>
            {/* <ModalCloseButton /> */}

            <ModalBody>
                <form onSubmit={handleSubmit} ref={itemForm}>
                    <FormControl isRequired>
                        <FormLabel>Item</FormLabel>
                        <Input placeholder='item' name='item'/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Quantity</FormLabel>
                        <Input type='number' name='quantity'/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder='description' name='description'/>
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

        event.preventDefault();

        if (itemForm.current === null) return

        const formData = new FormData(itemForm.current)

        // Validate form
        const item: string  = formData.get('item');
        const quantity: string = formData.get('quantity');

        if (item === '') {
            alert('Item cannot be empty!');
            return;
        }
        
        if (quantity === '') {
            alert('Quantity cannot be empty!');
            return;
        }

        try {
            const res: Response = await fetch(`/trip/${trip.id}/packing` , {
                method: 'POST',
                body: formData,
                headers: fetchHelpers.getTokenHeader()
            })

            if (res.ok) {

                // Get trigger state update on the parent table
                props.getItemsCallback()

                // Close the modal
                onClose();

            } else {
                const message: any = await res.json();
                throw new Error(JSON.stringify(message));
            }
    
        } catch (e: any) {
            console.error(e)
            alert('Unable to submit item :(')
        }
    }
}

export default NewItemModal;
