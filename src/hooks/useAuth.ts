'use client';

import { useState, useEffect } from 'react';
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { upsertUserProfile } from '../lib/userProfile';
import { type UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      // Unblock loading immediately — auth state is known
      setLoading(false);

      if (u) {
        // Upsert user profile in the background — never blocks the UI
        upsertUserProfile(u)
          .then(setUserProfile)
          .catch(() => {
            // Profile upsert failed (e.g. Firestore rules not yet deployed).
            // Non-fatal — the app continues with Firebase Auth identity only.
          });
      } else {
        setUserProfile(null);
      }
    });
    return () => unsub();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return { user, userProfile, loading, signIn, signOut };
}
