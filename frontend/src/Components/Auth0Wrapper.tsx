import { ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';


interface Auth0WrapperProps {
  children: ReactNode;
}

function Auth0Wrapper(props: Auth0WrapperProps) {
  const { isLoading, error } = useAuth0();

  if (!isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Unable to sign in</div>;
  }

  return <>{props.children}</>;
}

export default Auth0Wrapper;
