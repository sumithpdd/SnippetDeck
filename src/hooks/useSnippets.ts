'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type Snippet, MOCK_DATA } from '../types';

// Top-level flat collection — snippets are related to users via the userId field
const SNIPPETS_COL = 'snippets';

type SnippetInput = Pick<Snippet, 'title' | 'description' | 'content' | 'categories'>;

interface UserContext {
  uid: string;
  displayName: string;
}

export function useSnippets({ uid, displayName }: UserContext) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    // Requires a composite index on (userId ASC, createdAt DESC) — see firestore.indexes.json
    const q = query(
      collection(db, SNIPPETS_COL),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      { includeMetadataChanges: true },
      snapshot => {
        setError(null);
        setSnippets(
          snapshot.docs.map(d => ({ ...(d.data() as Omit<Snippet, 'id'>), id: d.id }))
        );
        setHasPendingWrites(snapshot.docs.some(d => d.metadata.hasPendingWrites));
        setFromCache(snapshot.metadata.fromCache);
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  const addSnippet = async (data: SnippetInput) => {
    await addDoc(collection(db, SNIPPETS_COL), {
      ...data,
      userId: uid,
      createdBy: displayName,
      updatedBy: displayName,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateSnippet = async (id: string, data: SnippetInput) => {
    await updateDoc(doc(db, SNIPPETS_COL, id), {
      ...data,
      updatedBy: displayName,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteSnippet = async (id: string) => {
    await deleteDoc(doc(db, SNIPPETS_COL, id));
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    await updateDoc(doc(db, SNIPPETS_COL, id), {
      isFavorite: !current,
      updatedBy: displayName,
      updatedAt: new Date().toISOString(),
    });
  };

  const seedSnippets = async (): Promise<void> => {
    await Promise.all(
      MOCK_DATA.map(s =>
        addDoc(collection(db, SNIPPETS_COL), {
          ...s,
          userId: uid,
          createdBy: displayName,
          updatedBy: displayName,
        })
      )
    );
  };

  return {
    snippets,
    loading,
    error,
    hasPendingWrites,
    fromCache,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
    seedSnippets,
  };
}
