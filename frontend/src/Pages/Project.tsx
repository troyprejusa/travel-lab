import React from "react";
import { useParams, Outlet} from "react-router-dom";
import ChakraNavbar from "../Components/ChakraNavbar";

function Project() {
    const { projectId } = useParams();
    return (
        <>
            <h1>I'm a project with id {projectId} </h1>
            <ChakraNavbar>
                <Outlet />
            </ChakraNavbar>
        </>
    )
}

export default Project;