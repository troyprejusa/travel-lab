import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Box } from "@chakra-ui/react";

function Project(): JSX.Element {
    return (
        <>
            <Navbar>
                <Box>
                    <Outlet />
                </Box>
            </Navbar>
        </>
    )
}

export default Project;