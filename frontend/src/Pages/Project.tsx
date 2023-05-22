import React from "react";
import { useParams, Outlet} from "react-router-dom";

function Project() {
    const { projectId } = useParams();
    return (
        <>
            <h1>I'm a project with id {projectId} </h1>
            <Outlet />
        </>
    )
}

export default Project;