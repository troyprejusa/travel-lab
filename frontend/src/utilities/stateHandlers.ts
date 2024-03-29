import { reduxFetchMessages, reduxResetMessages } from "../redux/MessageSlice";
import { reduxFetchPolls, reduxResetPolls } from "../redux/PollSlice";
import { reduxFetchPacking, reduxResetPacking } from "../redux/PackingSlice";
import { reduxResetTrip } from "../redux/TripSlice";
import { reduxFetchItinerary, reduxResetItinerary } from "../redux/ItinerarySlice";
import { reduxFetchTravellers, reduxResetTravellers } from "../redux/TravellersSlice";
import { reduxFetchTripPermissions, reduxUserLogout } from "../redux/UserSlice";
import { msgSocket, pollSocket, itinerarySocket, packingSocket } from "./TripSocket";
import { AppDispatch } from "../redux/Store";

export const fetchAllTripData = (trip_id: string, token: string, dispatch: AppDispatch) => {
    dispatch(reduxFetchTripPermissions({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchItinerary({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchPolls({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchPacking({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchMessages({ trip_id: trip_id, token: token }));
    dispatch(reduxFetchTravellers({ trip_id: trip_id, token: token }));
}

export const resetAllTripData = (dispatch: AppDispatch) => {
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

export const signOutBeforeTripSelect = (dispatch: AppDispatch) => {
    dispatch(reduxUserLogout(null));
}

export const signOutAfterTripSelect = (dispatch: AppDispatch) => {
    dispatch(reduxUserLogout(null));
    resetAllTripData(dispatch);
    closeAllSockets();

}

export const resetAfterLeavingTrip = (dispatch: AppDispatch) => {
    resetAllTripData(dispatch);
    closeAllSockets();
}

export const resetAfterTripDelete = (dispatch: AppDispatch) => {
    // This can be the same as above
    resetAfterLeavingTrip(dispatch);
}