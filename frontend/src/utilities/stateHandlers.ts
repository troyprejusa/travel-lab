import { Dispatch } from "@reduxjs/toolkit";
import { reduxFetchMessages, reduxResetMessages } from "../redux/MessageSlice";
import { reduxFetchPolls, reduxResetPolls } from "../redux/PollSlice";
import { reduxFetchPacking, reduxResetPacking } from "../redux/PackingSlice";
import { reduxResetTrip } from "../redux/TripSlice";
import { reduxFetchItinerary, reduxResetItinerary } from "../redux/ItinerarySlice";
import { reduxFetchTravellers, reduxResetTravellers } from "../redux/TravellersSlice";
import { reduxFetchTripPermissions, reduxUserLogout } from "../redux/UserSlice";
import { msgSocket, pollSocket, itinerarySocket, packingSocket } from "./TripSocket";

export const fetchAllTripData = (trip_id: string, token: string, dispatch: Dispatch) => {
    dispatch(reduxFetchTripPermissions({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchItinerary({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchPolls({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchPacking({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchMessages({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchTravellers({ trip_id: trip_id, token: token }));
}

export const resetAllTripData = (dispatch: Dispatch) => {
    dispatch(reduxResetMessages(null));
    dispatch(reduxResetPolls(null));
    dispatch(reduxResetPacking(null))
    dispatch(reduxResetTrip(null));
    dispatch(reduxResetItinerary(null));
    dispatch(reduxResetTravellers(null));
}

export const closeAllSockets = () => {
    msgSocket.disconnectSocket();
    pollSocket.disconnectSocket();
    itinerarySocket.disconnectSocket();
    packingSocket.disconnectSocket();
}

export const signOutBeforeTripSelect = (dispatch: Dispatch) => {
    dispatch(reduxUserLogout(null));
}

export const signOutAfterTripSelect = (dispatch: Dispatch) => {
    dispatch(reduxUserLogout(null));
    resetAllTripData(dispatch);
    closeAllSockets();

}

export const resetAfterLeavingTrip = (dispatch: Dispatch) => {
    resetAllTripData(dispatch);
    closeAllSockets();
}

export const resetAfterTripDelete = (dispatch: Dispatch) => {
    // This can be the same as above
    resetAfterLeavingTrip(dispatch);
}