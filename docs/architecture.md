# Architecture

SnippetDeck Pro is a **Next.js 15** web app (App Router) backed by **Firebase**
and deployed to **Vercel**.

## Folder Structure

```
src/
├── app/
│   ├── page.tsx          # Server Component — dynamic import with ssr:false
│   ├── HomeClient.tsx    # Root Client Component (auth gate, app shell)
│   ├── layout.tsx        # HTML root, metadata
│   └── globals.css       # CSS custom properties + all component styles
│
├── components/           # Presentational UI — all 'use client'
│   ├── Header.tsx        # Title + status badge + sign-out
│   ├── SearchBar.tsx     # Controlled search input
│   ├── CategoryFilter.tsx # Category pill filters
│   ├── SnippetCard.tsx   # Card: copy, edit, inline delete confirm, favourite
│   └── SnippetModal.tsx  # Add/Edit modal with validation
│
├── hooks/                # Business logic — all 'use client'
│   ├── useAuth.ts        # Firebase Auth state + Google sign-in
│   ├── useSnippets.ts    # Firestore CRUD + real-time sync + error state
│   ├── useFilters.ts     # Search + category filter + derived sorted list
│   ├── useClipboard.ts   # Clipboard write + timed feedback
│   └── useNetworkStatus.ts # Online/offline detection + Firestore enable/disable
│
├── lib/
│   ├── firebase.ts       # Firebase app init + Firestore offline persistence
│   └── userProfile.ts   # Upsert users/{uid} document on sign-in
│
└── types.ts              # Snippet, UserProfile interfaces; CATEGORIES; MOCK_DATA
```

## SSR Strategy

`page.tsx` is a **Client Component** that uses `next/dynamic` with `{ ssr: false }` to
load `HomeClient`. Next.js 15 requires `'use client'` to use `ssr: false` dynamic imports.
This prevents Firebase (browser-only APIs) from running during static page generation at build time.

## Data Flow

```
useAuth ──► uid + displayName
              │
              ▼
         useSnippets(uid, displayName)
              │  onSnapshot (real-time)
              ▼
         snippets[] ──► useFilters ──► filteredSnippets[] ──► SnippetCard[]
                                                                    │
              ◄─────── addDoc / updateDoc / deleteDoc ──────────────┘
```

## Firestore Collections

| Collection | Path | Purpose |
|---|---|---|
| Users | `users/{uid}` | Profile: displayName, email, photoURL, timestamps |
| Snippets | `snippets/{id}` | Flat collection; `userId` field = FK to user |

## Offline Support

`firebase.ts` initialises Firestore with `persistentLocalCache` (IndexedDB).
`useNetworkStatus` detects browser online/offline events and calls
`enableNetwork` / `disableNetwork` on Firestore accordingly.
Queued writes are replayed automatically when connectivity is restored.

## Separation of Concerns

| Layer | Responsibility |
|---|---|
| `types.ts` | Data shapes, constants, seed data |
| `lib/firebase.ts` | Firebase initialisation (singleton, hot-reload safe) |
| `lib/userProfile.ts` | Firestore user profile persistence |
| `hooks/use*.ts` | All state and side-effects — no JSX |
| `components/*.tsx` | Pure UI — receive props, emit callbacks |
| `app/HomeClient.tsx` | Wires hooks to components; owns modal and edit state |
