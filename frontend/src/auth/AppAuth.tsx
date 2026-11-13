import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  Auth0Provider,
  useAuth0,
} from '@auth0/auth0-react';
import Constants from '../utilities/Constants';

export interface AppUser {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

interface AppAuthValue {
  user?: AppUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: Error;
  isDevAuth: boolean;
  getAccessTokenSilently: (options?: any) => Promise<string>;
  loginWithRedirect: (options?: any) => Promise<void>;
  logout: (options?: any) => void;
  selectDevUser: (email: string) => void;
}

const AuthContext = createContext<AppAuthValue | null>(null);
const DEV_USERS = ['troy@test.com', 'joe@test.com'];
const DEV_AUTH_STORAGE_KEY = 'travel-lab-dev-user';
const DEV_AUTH_ENABLED = import.meta.env.DEV;

export function AppAuthProvider({ children }: { children: ReactNode }) {
  if (DEV_AUTH_ENABLED) {
    return <DevAuthProvider>{children}</DevAuthProvider>;
  }

  return (
    <Auth0Provider
      domain={Constants.AUTH0_DOMAIN}
      clientId={Constants.AUTH0_CLIENT}
      useRefreshTokens
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: Constants.AUTH0_AUDIENCE,
      }}
    >
      <Auth0Bridge>{children}</Auth0Bridge>
    </Auth0Provider>
  );
}

function DevAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | undefined>(() => {
    const stored = window.localStorage.getItem(DEV_AUTH_STORAGE_KEY);
    return stored && DEV_USERS.includes(stored) ? stored : undefined;
  });

  function selectDevUser(selectedEmail: string) {
    if (!DEV_USERS.includes(selectedEmail)) {
      throw new Error('Unknown development user');
    }
    window.localStorage.setItem(DEV_AUTH_STORAGE_KEY, selectedEmail);
    setEmail(selectedEmail);
  }

  const value: AppAuthValue = {
    user: email ? { email, name: email === 'troy@test.com' ? 'Troy' : 'Joe' } : undefined,
    isAuthenticated: Boolean(email),
    isLoading: false,
    isDevAuth: true,
    getAccessTokenSilently: async () => {
      if (!email) throw new Error('Choose a development user first');
      return email;
    },
    loginWithRedirect: async () => selectDevUser(DEV_USERS[0]),
    logout: () => {
      window.localStorage.removeItem(DEV_AUTH_STORAGE_KEY);
      setEmail(undefined);
      window.location.assign('/');
    },
    selectDevUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function Auth0Bridge({ children }: { children: ReactNode }) {
  const auth = useAuth0();
  const value: AppAuthValue = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    isDevAuth: false,
    getAccessTokenSilently: auth.getAccessTokenSilently,
    loginWithRedirect: auth.loginWithRedirect,
    logout: auth.logout,
    selectDevUser: () => {},
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAppAuth(): AppAuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAppAuth must be used within AppAuthProvider');
  return context;
}

export function withAuthenticationRequired<P extends object>(
  Component: React.ComponentType<P>,
  options: { onRedirecting?: () => ReactNode } = {},
) {
  return function AuthenticationRequired(props: P) {
    const { isAuthenticated, isLoading } = useAppAuth();
    if (isLoading || !isAuthenticated) {
      return <>{options.onRedirecting?.() ?? null}</>;
    }
    return <Component {...props} />;
  };
}

export { DEV_USERS };
