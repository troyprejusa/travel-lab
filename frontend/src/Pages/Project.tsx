import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { TripModel } from '../utilities/Interfaces';
import { AppDispatch, RootState } from '../redux/Store';
import { useAuth0 } from '@auth0/auth0-react';
import fetchHelpers from '../utilities/fetchHelpers';
import { fetchAllTripData } from '../utilities/stateHandlers';
import Constants from '../utilities/Constants';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import LoadingPage from '../Components/LoadingPage';
import { Box, Heading, Flex } from '@chakra-ui/react';

function Project(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const { getAccessTokenSilently } = useAuth0();

  // Fetch all data for this project only on page load
  useEffect(() => {
    setTripData();
  }, []);

  return (
    <>
      <Navbar>
        <Box
          id="trip-outlet"
          padding={Constants.OUTLET_PADDING}
          minWidth={`calc(100vw - ${Constants.NAVBAR_LEFT_PANE_WIDTH})`}
          minHeight={`calc(100vh - ${Constants.NAVBAR_TOP_PANE_HEIGHT})`}
        >
          <Outlet />
        </Box>
      </Navbar>
    </>
  );

  async function setTripData() {
    const token: string = await fetchHelpers.getAuth0Token(
      getAccessTokenSilently
    );
    fetchAllTripData(trip.id, token, dispatch);
  }
}

const ProtectedProject = withAuthenticationRequired(Project, {
  onRedirecting: () => (
    <LoadingPage>
      <Flex justifyContent="center" marginBottom={'4rem'}>
        <Heading size={'lg'}>Verifying session...</Heading>
      </Flex>
    </LoadingPage>
  ),
});

export default ProtectedProject;
