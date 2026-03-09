import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { type User } from 'firebase/auth';
import { db } from './firebase';
import { type UserProfile } from '../types';

function displayNameFrom(user: User): string {
  return user.displayName ?? user.email ?? user.uid;
}

/**
 * Creates a user profile document on first sign-in.
 * On subsequent sign-ins only lastLoginAt and mutable fields are updated.
 */
export async function upsertUserProfile(user: User): Promise<UserProfile> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const now = new Date().toISOString();

  if (snap.exists()) {
    const updates = {
      displayName: displayNameFrom(user),
      email: user.email ?? '',
      photoURL: user.photoURL ?? null,
      lastLoginAt: now,
    };
    await updateDoc(ref, updates);
    return { ...(snap.data() as UserProfile), ...updates };
  }

  const profile: UserProfile = {
    uid: user.uid,
    displayName: displayNameFrom(user),
    email: user.email ?? '',
    photoURL: user.photoURL ?? null,
    createdAt: now,
    lastLoginAt: now,
  };
  await setDoc(ref, profile);
  return profile;
}
