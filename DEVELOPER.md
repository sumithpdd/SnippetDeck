# Developer Guide

See [docs/architecture.md](docs/architecture.md) and [docs/local-development.md](docs/local-development.md) for full details.

## Common Tasks

### Add a new category

Open `src/types.ts` and add to `CATEGORIES`:

```ts
export const CATEGORIES = ['AI', 'Prompt', 'Sitecore', 'Codelab', 'Cloud', 'Frontend', 'Backend', 'YourNew'];
```

It automatically appears in the filter bar and add/edit modal — no other changes needed.

### Add a field to Snippet

1. Add the field to the `Snippet` interface in `src/types.ts`
2. Update `hooks/useSnippets.ts` → set the default in `addSnippet`
3. Update `components/SnippetModal.tsx` → add the form input
4. Update `components/SnippetCard.tsx` → display the field

### Firestore data

Snippets live in the flat top-level collection `snippets/{snippetId}` in Firestore.
Each document carries a `userId` field that links it to `users/{uid}`.

`useSnippets(uid)` attaches a real-time `onSnapshot` listener — any change in Firestore
immediately updates the UI.

### Debugging

- Open browser DevTools → Console for client-side logs
- Firebase Console → Firestore → Data tab to inspect documents directly
- Firebase Console → Authentication → Users to see who has signed in
