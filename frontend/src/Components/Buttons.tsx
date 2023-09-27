import React, { ReactElement } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { fetchAllTripData } from '../utilities/stateHandlers';
import { Dispatch } from '@reduxjs/toolkit';
import { useAuth0 } from '@auth0/auth0-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {
  FiEdit,
  FiTrash,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiUserMinus,
  FiRotateCw,
  FiSunrise,
  FiSunset,
} from 'react-icons/fi';
import {
  IconButton,
  IconButtonProps,
  useDisclosure,
  Tooltip,
  ButtonProps,
  Button,
} from '@chakra-ui/react';

// Should be able to receive and pass on all props for an IconButton
interface ConfigurableIconButtonWrapperProps extends IconButtonProps {
  clickHandler: () => void;
  tooltipMsg?: string;
  disabled?: boolean;
}

// Add in icon and colorScheme specification
interface ConfigurableIconButtonProps
  extends ConfigurableIconButtonWrapperProps {
  icon: ReactElement;
  colorScheme: string;
}

const ConfigurableIconButton = (props: ConfigurableIconButtonProps) => {
  const { clickHandler, tooltipMsg, disabled, icon, colorScheme, ...rest } =
    props;

  return (
    <Tooltip label={tooltipMsg || null}>
      <span>
        <IconButton
          variant={'outline'}
          colorScheme={colorScheme}
          fontSize={'20px'}
          icon={icon}
          onClick={clickHandler}
          isDisabled={disabled || false}
          {...rest}
        />
      </span>
    </Tooltip>
  );
};

export const ClaimButton = (props: ConfigurableIconButtonWrapperProps) => (
  <ConfigurableIconButton
    {...props}
    icon={<FiUserCheck />}
    colorScheme="teal"
  />
);

export const UnclaimButton = (props: ConfigurableIconButtonWrapperProps) => (
  <ConfigurableIconButton {...props} icon={<FiUserX />} colorScheme="yellow" />
);

export const EditButton = (props: ConfigurableIconButtonWrapperProps) => (
  <ConfigurableIconButton {...props} icon={<FiEdit />} colorScheme="cyan" />
);

export const AddUserButton = (props: ConfigurableIconButtonWrapperProps) => (
  <ConfigurableIconButton
    {...props}
    icon={<FiUserPlus />}
    colorScheme="green"
  />
);

export const RemoveUserButton = (props: ConfigurableIconButtonWrapperProps) => (
  <ConfigurableIconButton
    {...props}
    icon={<FiUserMinus />}
    colorScheme="red"
  />
);

export const PromoteUserButton = (
  props: ConfigurableIconButtonWrapperProps
) => (
  <ConfigurableIconButton
    {...props}
    icon={<FiSunrise />}
    colorScheme="orange"
  />
);

export const DemoteUserButton = (props: ConfigurableIconButtonWrapperProps) => (
  <ConfigurableIconButton {...props} icon={<FiSunset />} colorScheme="purple" />
);

// IconButton + Modal
export const TrashButton = (props: ConfigurableIconButtonWrapperProps) => {
  const { clickHandler, ...rest } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ConfigurableIconButton
        {...rest}
        clickHandler={onOpen}
        icon={<FiTrash />}
        colorScheme="red"
      />

      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        deleteHandler={clickHandler}
      />
    </>
  );
};

interface DeleteButtonProps extends ButtonProps {
  clickHandler: () => void;
  buttonText?: string;
  tooltipMsg?: string;
  disabled?: boolean;
  modalHeader?: string;
  modalBody?: string;
}

// Button + Modal
export const DeleteButton = (props: DeleteButtonProps) => {
  const {
    clickHandler,
    buttonText,
    tooltipMsg,
    disabled,
    modalHeader,
    modalBody,
    ...rest
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label={tooltipMsg || null}>
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
            deleteHandler={clickHandler}
            header={modalHeader}
            body={modalBody}
          />
        </span>
      </Tooltip>
    </>
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
