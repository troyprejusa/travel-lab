import React from "react";
import { MessageModel } from "../utilities/Interfaces";
import { 
    Box, 
    Text 
} from "@chakra-ui/react";


interface MessageProps extends MessageModel{

}

const messageDisplay = {
    display: 'inline-block',
    maxWidth: '80%',
    padding: '10px',
    borderRadius: '8px'
}

export const ReceivedMessage = (props: MessageProps) => {
    return (
        <Box textAlign={'left'} marginTop={'20px'} marginBottom={'20px'}>
            <Box {...messageDisplay} backgroundColor={'gray.300'}>
                <Text>{props.content}</Text>
            </Box>
        </Box>
    )
}

export const SentMessage = (props: MessageProps) => {
    return (
        <Box textAlign={'right'} marginTop={'20px'} marginBottom={'20px'}>
            <Box {...messageDisplay} backgroundColor={'blue.500'}>
                <Text>{props.content}</Text>
            </Box>
        </Box>
    )
}