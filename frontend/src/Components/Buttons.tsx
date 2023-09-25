import React, { SyntheticEvent } from 'react';
import {
  FiEdit,
  FiTrash,
  FiUserCheck,
  FiUserX,
  FiRotateCw,
} from 'react-icons/fi';
import {
  IconButton,
  IconButtonProps,
  useDisclosure,
  Tooltip,
  ButtonProps,
  Button,
} from '@chakra-ui/react';
import fetchHelpers from '../utilities/fetchHelpers';
import { fetchAllTripData } from '../utilities/stateHandlers';
import { Dispatch } from '@reduxjs/toolkit';
import { useAuth0 } from '@auth0/auth0-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface TrashButtonProps extends IconButtonProps {
  deleteHandler: () => void;
  disabled?: boolean;
  disabledMsg?: string;
}

export const TrashButton = (props: TrashButtonProps) => {
  const { deleteHandler, disabled, disabledMsg, ...rest } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label={disabled && disabledMsg ? disabledMsg : null}>
        <span>
          <IconButton
            icon={<FiTrash />}
            onClick={onOpen}
            fontSize={'20px'}
            variant={'outline'}
            colorScheme="red"
            isDisabled={disabled || false}
            {...rest}
          />
          <ConfirmDeleteModal
            isOpen={isOpen}
            onClose={onClose}
            deleteHandler={deleteHandler}
          />
        </span>
      </Tooltip>
    </>
  );
};

interface ClaimButtonProps extends IconButtonProps {
  claimHandler: () => void;
}

export const ClaimButton = (props: ClaimButtonProps) => {
  const { claimHandler, ...rest } = props;

  return (
    <IconButton
      variant={'outline'}
      colorScheme="teal"
      fontSize={'20px'}
      icon={<FiUserCheck />}
      onClick={(event: SyntheticEvent) => claimHandler()}
      {...rest}
    />
  );
};

interface UnclaimButtonProps extends IconButtonProps {
  unclaimHandler: () => void;
}

export const UnclaimButton = (props: UnclaimButtonProps) => {
  const { unclaimHandler, ...rest } = props;

  return (
    <IconButton
      variant={'outline'}
      colorScheme="yellow"
      fontSize={'20px'}
      icon={<FiUserX />}
      onClick={(event: SyntheticEvent) => unclaimHandler()}
      {...rest}
    />
  );
};

interface EditButtonProps extends IconButtonProps {
  editHandler: () => void;
  disabled?: boolean;
  disabledMsg?: string;
}

export const EditButton = (props: EditButtonProps) => {
  const { editHandler, disabled, disabledMsg, ...rest } = props;

  return (
    <Tooltip label={disabled && disabledMsg ? disabledMsg : null}>
      <span>
        <IconButton
          variant={'outline'}
          colorScheme="cyan"
          fontSize={'20px'}
          icon={<FiEdit />}
          onClick={() => editHandler()}
          isDisabled={disabled || false}
          {...rest}
        />
      </span>
    </Tooltip>
  );
};

interface RefreshButtonProps extends IconButtonProps {
  trip_id: string;
  dispatch: Dispatch;
}

export const RefreshButton = (props: RefreshButtonProps) => {
  const { trip_id, dispatch, ...rest } = props;
  const { getAccessTokenSilently } = useAuth0();
  return (
    <IconButton
      colorScheme="blue"
      fontSize={'20px'}
      icon={<FiRotateCw />}
      onClick={async () => {
        const token: string = await fetchHelpers.getAuth0Token(
          getAccessTokenSilently
        );
        fetchAllTripData(trip_id, token, dispatch);
      }}
      {...rest}
    />
  );
};

interface DeleteButtonProps extends ButtonProps {
  deleteHandler: () => void;
  buttonText?: string;
  disabled?: boolean;
  disabledMsg?: string;
  header?: string;
  body?: string;
}

export const DeleteButton = (props: DeleteButtonProps) => {
  const {
    deleteHandler,
    disabled,
    disabledMsg,
    header,
    body,
    buttonText,
    ...rest
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label={disabled && disabledMsg ? disabledMsg : null}>
        <span>
          <Button
            onClick={onOpen}
            colorScheme="red"
            size={'md'}
            isDisabled={disabled || false}
            {...rest}
          >
            {buttonText || 'Delete'}
          </Button>
          <ConfirmDeleteModal
            isOpen={isOpen}
            onClose={onClose}
            deleteHandler={deleteHandler}
            header={header}
            body={body}
          />
        </span>
      </Tooltip>
    </>
  );
};
