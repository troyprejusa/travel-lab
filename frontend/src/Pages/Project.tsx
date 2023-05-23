import React from "react";
import { useParams, Outlet} from "react-router-dom";
import ChakraNavbar from "../Components/ChakraNavbar";

function Project(): JSX.Element {
    const { projectId } = useParams();
    return (
        <>
            <ChakraNavbar>
                <Outlet />
            </ChakraNavbar>
        </>
    )
}

export default Project;