import React, { ReactNode, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
} from '@chakra-ui/react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
  deleteHandler: () => void;
}

function ConfirmDeleteModal(props: ConfirmDeleteModalProps) {
  const { isOpen, onClose, deleteHandler } = props;
  const cancelRef: HTMLButtonElement = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this item?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteHandler();
                onClose();
              }}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ConfirmDeleteModal;
