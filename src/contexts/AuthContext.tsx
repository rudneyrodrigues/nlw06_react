import { useState, useEffect } from "react";
import { createContext, ReactNode } from "react";
import toast from "react-hot-toast";

import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

type AuthContextData = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  logoutWithGoogle: () => Promise<void>;
  // Utiliza o Promise quando uma função possui async await
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // Ira verificar no firebase se já há alguém conectado
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    });

    // Ira desligar a verificação no firebase, após ser concluída;
    return () => {
      unsubscribe();
    }
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        toast.error('Missing information from Google Account.');
        return;
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  async function logoutWithGoogle() {
    await auth.signOut();

    toast.success('Logout feito com sucesso');

    setUser(undefined);
  }

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      logoutWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  )
}