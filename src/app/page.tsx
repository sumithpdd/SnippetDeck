'use client';

import dynamic from 'next/dynamic';

// Disable SSR — Firebase Auth and Firestore are browser-only APIs.
// This prevents build-time prerender errors when env vars are not available.
const HomeClient = dynamic(() => import('./HomeClient'), { ssr: false });

export default function Page() {
  return <HomeClient />;
}
