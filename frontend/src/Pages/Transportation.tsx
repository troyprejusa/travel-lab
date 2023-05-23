import React from 'react';
import { useParams } from 'react-router-dom';

interface TransportationProps {

};

function Transportation(): JSX.Element {
    const { projectId } = useParams();
    return (
        <h1>Transportation for project {projectId}</h1>
    )
}

export default Transportation;