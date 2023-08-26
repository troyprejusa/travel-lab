import React, { SyntheticEvent } from "react";
import { 
    FiEdit,
    FiTrash,
    FiUserCheck,
    FiUserX
} from "react-icons/fi";
import { 
    IconButton, 
    IconButtonProps,
} from "@chakra-ui/react";

interface TrashButtonProps extends IconButtonProps {
    deleteHandler: () => void
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
    )
}

interface ClaimButtonProps extends IconButtonProps {
    claimHandler: () => void
}

export const ClaimButton = (props: ClaimButtonProps) => {

    const { claimHandler, ...rest } = props;

    return (
        <IconButton 
            variant={'outline'} 
            colorScheme='teal' 
            fontSize={'20px'} 
            icon={<FiUserCheck />} 
            onClick={(event: SyntheticEvent) => claimHandler()}
            {...rest}
        />
    )
}

interface UnclaimButtonProps extends IconButtonProps {
    unclaimHandler: () => void
}

export const UnclaimButton = (props: UnclaimButtonProps) => {

    const { unclaimHandler, ...rest } = props;

    return (
        <IconButton 
        variant={'outline'} 
        colorScheme='yellow' 
        fontSize={'20px'} 
        icon={<FiUserX />} 
        onClick={(event: SyntheticEvent) => unclaimHandler()}
        {...rest}
        />
    )
}

interface EditButtonProps extends IconButtonProps {
    editHandler: () => void
}

export const EditButton = (props: EditButtonProps) => {

    const { editHandler, ...rest} = props;

    return (
        <IconButton 
        variant={'outline'} 
        colorScheme='cyan' 
        fontSize={'20px'} 
        icon={<FiEdit />} 
        onClick={(event: SyntheticEvent) => editHandler()}
        {...rest}
        />
    )
}
