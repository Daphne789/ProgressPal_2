import React from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const auth = getAuth();

export function useAuthentication() {
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is logged out
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user
  };
}