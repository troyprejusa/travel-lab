import Constants from "./Constants";


const fetchHelpers = {

  getTokenHeader: async function(getAccessTokenSilently) {
    const token = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
    
    return new Headers({
      authorization: `BEARER ${token}`,
    });
  },

  getTokenJSONHeader: async function(getAccessTokenSilently) {
    const token = await fetchHelpers.getAuth0Token(getAccessTokenSilently);

    return new Headers({
      authorization: `BEARER ${token}`,
      'content-type': 'application/json',
    });
  },

  getAuth0Token: async function(getAccessTokenSilently): string {
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: Constants.AUTH0_AUDIENCE // Value in Identifier field for the API being called.
        },
      });
    } catch (error: any) {
      console.error(error)
      throw new Error('Unable to retrieve token')
    }
  }
};

export default fetchHelpers;
