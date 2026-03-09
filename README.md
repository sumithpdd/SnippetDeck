# SnippetDeck Pro

A web app for storing, tagging, and instantly copying code snippets and talking points during live technical demos.

Built with **Next.js 15**, **Firebase**, and deployed on **Vercel**.

## Features

- Google Sign-In — your snippets are private and synced across devices
- Multi-category tagging (AI, Prompt, Sitecore, Codelab, Cloud, Frontend, Backend)
- Real-time sync via Firestore
- Real-time search across title and content
- Multi-select category filters
- Favorites — pin snippets to the top
- One-click copy to clipboard
- Full CRUD (add, edit, delete)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | Firebase Firestore |
| Auth | Firebase Auth (Google) |
| Icons | Lucide React |
| Hosting | Vercel |

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # fill in Firebase config
npm run dev
```

## Docs

- [Firebase Setup](docs/firebase-setup.md) — enable Firestore, Auth, and security rules
- [Vercel Deployment](docs/vercel-deploy.md) — deploy to production in minutes
- [Local Development](docs/local-development.md) — dev server, scripts, project structure
- [Architecture](docs/architecture.md) — component breakdown, data flow
- [Features](docs/features.md) — current features and roadmap
- [Developer Guide](DEVELOPER.md) — how to extend the project
