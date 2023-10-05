import React, { ReactElement } from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { fetchAllTripData } from '../utilities/stateHandlers';
import { Dispatch } from '@reduxjs/toolkit';
import { useAuth0 } from '@auth0/auth0-react';
import ConfirmModal from './ConfirmModal';
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

/* --------------------------- Buttons  ---------------------------*/

interface ConfigurableButtonProps extends ButtonProps {
  tooltipMsg?: string;
  disabled?: boolean;
}

// Button + Modal
export const ConfigurableButton = (props: ConfigurableButtonProps) => {
  const { tooltipMsg, disabled, ...rest } = props;

  return (
    <>
      <Tooltip label={tooltipMsg || null}>
        <span>
          <Button
            colorScheme="red"
            size={'md'}
            isDisabled={disabled || false}
            {...rest}
          />
        </span>
      </Tooltip>
    </>
  );
};

/* --------------------------- Buttons with Modal  ---------------------------*/

interface ConfigurableButtonAndModalProps extends ConfigurableButtonProps {
  modalHeader?: string;
  modalBody?: string;
}

export const ConfigurableButtonAndModal = (
  props: ConfigurableButtonAndModalProps
) => {
  // Need to route the onClick event to execute in the modal
  const { onClick: clickHandler, modalHeader, modalBody, ...rest } = props;

  // Manage modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ConfigurableButton onClick={onOpen} {...rest} />
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        clickHandler={clickHandler}
        header={modalHeader}
        body={modalBody}
      />
    </>
  );
};
/* --------------------------- Icon Buttons  ---------------------------*/

interface ConfigurableIconButtonProps extends IconButtonProps {
  tooltipMsg?: string;
  disabled?: boolean;
}

const ConfigurableIconButton = (props: ConfigurableIconButtonProps) => {
  const { tooltipMsg, disabled, ...rest } = props;

  return (
    <Tooltip label={tooltipMsg || null}>
      <span>
        <IconButton
          variant={'outline'}
          fontSize={'20px'}
          isDisabled={disabled || false}
          {...rest}
        />
      </span>
    </Tooltip>
  );
};

export const ClaimButton = (props: ConfigurableIconButtonProps) => (
  <ConfigurableIconButton
    {...props}
    icon={<FiUserCheck />}
    colorScheme="teal"
  />
);

export const UnclaimButton = (props: ConfigurableIconButtonProps) => (
  <ConfigurableIconButton {...props} icon={<FiUserX />} colorScheme="yellow" />
);

export const EditButton = (props: ConfigurableIconButtonProps) => (
  <ConfigurableIconButton {...props} icon={<FiEdit />} colorScheme="cyan" />
);

export const AcceptUserButton = (props: ConfigurableIconButtonProps) => (
  <ConfigurableIconButton
    {...props}
    icon={<FiUserPlus />}
    colorScheme="green"
  />
);

export const RejectUserButton = (props: ConfigurableIconButtonProps) => (
  <ConfigurableIconButton {...props} icon={<FiUserMinus />} colorScheme="red" />
);

export const PromoteUserButton = (props: ConfigurableIconButtonProps) => (
  <ConfigurableIconButton
    {...props}
    icon={<FiSunrise />}
    colorScheme="orange"
  />
);

export const DemoteUserButton = (props: ConfigurableIconButtonProps) => (
  <ConfigurableIconButton {...props} icon={<FiSunset />} colorScheme="purple" />
);

/* --------------------------- Icon Buttons with Modal ---------------------------*/

// Combine Configurable icon button with configurable modal
interface ConfigurableIconAndModalButtonProps
  extends ConfigurableIconButtonProps {
  modalHeader?: string;
  modalBody?: string;
}

const ConfigurableIconAndModalButton = (
  props: ConfigurableIconAndModalButtonProps
) => {
  // Need to route the onClick event to execute in the modal
  const { onClick: clickHandler, modalHeader, modalBody, ...rest } = props;

  // Manage modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ConfigurableIconButton onClick={onOpen} {...rest} />

      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        clickHandler={clickHandler}
        header={modalHeader}
        body={modalBody}
      />
    </>
  );
};

export const TrashButton = (props: ConfigurableIconAndModalButtonProps) => (
  <ConfigurableIconAndModalButton
    {...props}
    icon={<FiTrash />}
    colorScheme="red"
  />
);

/* --------------------------- Other Buttons ---------------------------*/

interface RefreshButtonProps extends IconButtonProps {
  trip_id: string;
  dispatch: Dispatch;
}

export const RefreshButton = (props: RefreshButtonProps) => {
  const { trip_id, dispatch, ...rest } = props;
  const { getAccessTokenSilently } = useAuth0();
  return (
    <Tooltip label="Refresh trip data">
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
    </Tooltip>
  );
};
