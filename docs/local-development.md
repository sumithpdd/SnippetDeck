# Local Development

## Prerequisites

- Node.js 20+
- npm 9+

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in your Firebase values in .env.local
```

## Run Dev Server

```bash
npm run dev
```

Opens `http://localhost:3000`. Sign in with Google — snippets are loaded from Firestore in real-time.

## Other Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint check |

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Entry point (Server Component — disables SSR via dynamic import)
│   ├── HomeClient.tsx    # Root client component (auth gate + app shell)
│   ├── layout.tsx        # HTML shell, metadata
│   └── globals.css       # Global styles
├── components/           # UI components (all Client Components)
├── hooks/                # Business logic hooks
├── lib/
│   ├── firebase.ts       # Firebase client initialisation (with offline persistence)
│   └── userProfile.ts    # Firestore user profile upsert
└── types.ts              # Snippet and UserProfile interfaces, CATEGORIES, MOCK_DATA
```

## Notes

- All components use `'use client'` — this is a fully browser-side app
- Firebase is never called on the server (`page.tsx` uses `dynamic(..., { ssr: false })`)
- Snippets live in the flat top-level Firestore collection `snippets/`, related to users via the `userId` field
- The `users/` collection stores user profile documents at `users/{uid}`
