import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { TripModel } from "../utilities/Interfaces";
import { RootState } from "../redux/Store";
import { reduxFetchItinerary } from "../redux/ItinerarySlice";
import { reduxFetchMessages } from "../redux/MessageSlice";
import { reduxFetchPolls } from "../redux/PollSlice";
import { reduxFetchPacking } from "../redux/PackingSlice";

function Project(): JSX.Element {

    const dispatch = useDispatch();
    const trip: TripModel = useSelector((state: RootState) => state.trip);

    // Fetch all states for this project on project load
    useEffect(fetchAllStates, [])

    return (
        <>
            <Navbar>
                <Box>
                    <Outlet />
                </Box>
            </Navbar>
        </>
    )

    function fetchAllStates() {
        dispatch(reduxFetchItinerary(trip.id));
        dispatch(reduxFetchMessages(trip.id));
        dispatch(reduxFetchPolls(trip.id));
        dispatch(reduxFetchPacking(trip.id));
    }
}

export default Project;