import React, { SyntheticEvent } from 'react';
import {
  FiEdit,
  FiTrash,
  FiUserCheck,
  FiUserX,
  FiRotateCw,
} from 'react-icons/fi';
import { IconButton, IconButtonProps } from '@chakra-ui/react';
import fetchHelpers from '../utilities/fetchHelpers';
import { fetchAllTripData } from '../utilities/stateHandlers';
import { Dispatch } from '@reduxjs/toolkit';
import { useAuth0 } from '@auth0/auth0-react';

interface TrashButtonProps extends IconButtonProps {
  deleteHandler: () => void;
}

export const TrashButton = (props: TrashButtonProps) => {
  const { deleteHandler, ...rest } = props;

  return (
    <IconButton
      icon={<FiTrash />}
      onClick={(event: SyntheticEvent) => deleteHandler()}
      fontSize={'20px'}
      variant={'outline'}
      colorScheme="red"
      {...rest}
    />
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
}

export const EditButton = (props: EditButtonProps) => {
  const { editHandler, ...rest } = props;

  return (
    <IconButton
      variant={'outline'}
      colorScheme="cyan"
      fontSize={'20px'}
      icon={<FiEdit />}
      onClick={(event: SyntheticEvent) => editHandler()}
      {...rest}
    />
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
