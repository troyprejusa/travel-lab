import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";


interface TitleBarOverlayProps {
    children: ReactNode;
}

export default function TitleBarOverlay(props: TitleBarOverlayProps) {
    return (
        <Box position={'absolute'}>
            {props.children}
        </Box>
    )
}