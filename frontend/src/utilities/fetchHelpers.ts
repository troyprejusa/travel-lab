import Constants from './Constants';

const fetchHelpers = {
  getTokenHeader: function (token: string): Headers {
    return new Headers({
      authorization: `BEARER ${token}`,
    });
  },

  getTokenJSONHeader: function (token: string): Headers {
    return new Headers({
      authorization: `BEARER ${token}`,
      'content-type': 'application/json',
    });
  },

  // To avoid having to maintain type-sync with Auth0, I will eslint-ignore this definition
  getAuth0Token: async function (getAccessTokenSilently: Function): Promise<string> {
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: Constants.AUTH0_AUDIENCE,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Unable to retrieve access token');
    }
  },
};

export default fetchHelpers;
