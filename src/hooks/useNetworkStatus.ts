'use client';

import { useState, useEffect, useCallback } from 'react';
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  // Tracks whether the user has manually forced offline mode
  const [forcedOffline, setForcedOffline] = useState(false);

  // Sync initial state from browser after mount (navigator not available during SSR).
  // If already offline, disable Firestore network immediately.
  useEffect(() => {
    const online = navigator.onLine;
    setIsOnline(online);
    if (!online) disableNetwork(db);
  }, []);

  // Respond to real network changes, unless the user has forced offline
  useEffect(() => {
    const handleOnline = () => {
      if (!forcedOffline) {
        setIsOnline(true);
        enableNetwork(db);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      disableNetwork(db);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [forcedOffline]);

  // Manual toggle — useful for offline demo mode
  const toggleNetwork = useCallback(async () => {
    if (isOnline) {
      await disableNetwork(db);
      setIsOnline(false);
      setForcedOffline(true);
    } else {
      await enableNetwork(db);
      setIsOnline(true);
      setForcedOffline(false);
    }
  }, [isOnline]);

  return { isOnline, forcedOffline, toggleNetwork };
}
