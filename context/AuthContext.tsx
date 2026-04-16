"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface UserProfile {
  name: string;
  role: "student" | "admin";
  email: string;
  photoURL: string | null;
  onboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALLOWED_DOMAIN = "rishihood.edu.in";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous profile listener if it exists
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        // Validate domain
        const email = firebaseUser.email || "";
        const isAllowed = email.endsWith(`@${ALLOWED_DOMAIN}`) || email.endsWith(`.${ALLOWED_DOMAIN}`);
        
        if (!isAllowed) {
          await signOut(auth);
          setUser(null);
          setProfile(null);
          setError(`access denied. please use your @${ALLOWED_DOMAIN} account.`);
          setLoading(false);
          return;
        }

        setUser(firebaseUser);
        
        // Listen to Firestore Profile in Real-time
        unsubscribeProfile = onSnapshot(
          doc(db, "users", firebaseUser.uid), 
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (err: any) => {
            console.error("profile listener error:", err);
            if (err.code === 'permission-denied') {
              setError("security error: check your firestore rules in the console.");
            } else if (err.code === 'unavailable' || err.message.includes('offline')) {
              setError("connection error: ensure you have created a firestore database in the console.");
            }
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      console.log("Triggering Google Popup...");
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;

      const email = loggedUser.email || "";
      const isAllowed = email.endsWith(`@${ALLOWED_DOMAIN}`) || email.endsWith(`.${ALLOWED_DOMAIN}`);

      if (!isAllowed) {
        await signOut(auth);
        throw new Error(`use your @${ALLOWED_DOMAIN} email to continue.`);
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
    } catch (err) {
      console.error("logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
