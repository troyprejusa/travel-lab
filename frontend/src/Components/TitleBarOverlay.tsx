import { Box } from "@chakra-ui/react";

export default function TitleBarOverlay(props) {
    return (
        <Box position={'absolute'}>
            {props.children}
        </Box>
    )
}