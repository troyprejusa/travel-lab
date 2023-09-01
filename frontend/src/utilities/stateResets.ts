import { Dispatch } from "@reduxjs/toolkit";
import { reduxResetMessages } from "../redux/MessageSlice";
import { reduxResetPolls } from "../redux/PollSlice";
import { reduxResetPacking } from "../redux/PackingSlice";
import { reduxResetTrip } from "../redux/TripSlice";
import { reduxResetItinerary } from "../redux/ItinerarySlice";
import { reduxResetTravellers } from "../redux/TravellersSlice";
import { reduxUserLogout } from "../redux/UserSlice";
import { msgSocket } from "./TripSocket";
import { pollSocket } from "./TripSocket";

export const signOutBeforeTripSelect = (dispatch: Dispatch) => {
    localStorage.removeItem('token');
    dispatch(reduxUserLogout(null));
}

export const signOutAfterTripSelect = (dispatch: Dispatch) => {
    localStorage.removeItem('token');
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