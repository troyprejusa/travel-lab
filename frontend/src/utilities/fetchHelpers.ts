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

  getAuth0Token: async function (getAccessTokenSilently): Promise<string> {
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: Constants.AUTH0_AUDIENCE,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Unable to retrieve access token');
    }
  },
};

export default fetchHelpers;
