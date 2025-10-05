// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  twitterProvider,
} from "../services/firebaseClient";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const token = await u.getIdToken();
          setUser({
            uid: u.uid,
            name: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            token,
          });
        } catch (error) {
          console.error("Error getting user token:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signInWithTwitter = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      return result;
    } catch (error) {
      console.error("Twitter sign-in error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithTwitter,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
