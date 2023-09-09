import { Dispatch } from "@reduxjs/toolkit";
import { reduxFetchMessages, reduxResetMessages } from "../redux/MessageSlice";
import { reduxFetchPolls, reduxResetPolls } from "../redux/PollSlice";
import { reduxFetchPacking, reduxResetPacking } from "../redux/PackingSlice";
import { reduxResetTrip } from "../redux/TripSlice";
import { reduxFetchItinerary, reduxResetItinerary } from "../redux/ItinerarySlice";
import { reduxFetchTravellers, reduxResetTravellers } from "../redux/TravellersSlice";
import { reduxUserLogout } from "../redux/UserSlice";
import { msgSocket } from "./TripSocket";
import { pollSocket } from "./TripSocket";

export const fetchAllTripData = (trip_id: string, token: string, dispatch: Dispatch) => {
    dispatch(reduxFetchTravellers({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchItinerary({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchMessages({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchPolls({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchPacking({ trip_id: trip_id, token: token }));
}

export const signOutBeforeTripSelect = (dispatch: Dispatch) => {
    dispatch(reduxUserLogout(null));
}

export const signOutAfterTripSelect = (dispatch: Dispatch) => {
    dispatch(reduxUserLogout(null));

    msgSocket.disconnectSocket();
    pollSocket.disconnectSocket();

    dispatch(reduxResetMessages(null));
    dispatch(reduxResetPolls(null));
    dispatch(reduxResetPacking(null))
    dispatch(reduxResetTrip(null));
    dispatch(reduxResetItinerary(null));
    dispatch(reduxResetTravellers(null));
}

export const resetAfterLeavingTrip = (dispatch: Dispatch) => {
    msgSocket.disconnectSocket();
    pollSocket.disconnectSocket();

    dispatch(reduxResetMessages(null));
    dispatch(reduxResetPolls(null));
    dispatch(reduxResetPacking(null))
    dispatch(reduxResetTrip(null));
    dispatch(reduxResetItinerary(null));
    dispatch(reduxResetTravellers(null));
}

export const resetAfterTripDelete = (dispatch: Dispatch) => {
    msgSocket.disconnectSocket();
    pollSocket.disconnectSocket();
    
    dispatch(reduxResetMessages(null));
    dispatch(reduxResetPolls(null));
    dispatch(reduxResetPacking(null))
    dispatch(reduxResetTrip(null));
    dispatch(reduxResetItinerary(null));
    dispatch(reduxResetTravellers(null));
}