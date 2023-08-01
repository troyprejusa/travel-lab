import React from "react";
import { Outlet } from "react-router-dom";
import ChakraNavbar from "../Components/ChakraNavbar";
import { Box } from "@chakra-ui/react";

function Project(): JSX.Element {
    return (
        <>
            <ChakraNavbar>
                <Box>
                    <Outlet />
                </Box>
            </ChakraNavbar>
        </>
    )
}

export default Project;