# Features

## Current Features

### Authentication
- Google Sign-In via Firebase Auth
- User profile record created/updated in Firestore on each sign-in
- All snippets are private — scoped per user via `userId` field

### Snippet Management
- **Add** — modal with title, description, content, and category selection
- **Edit** — same modal, pre-filled
- **Delete** — inline confirmation (no browser dialogs)
- **Validation** — required fields highlighted with error messages

### Organisation
- **Categories** — multi-select from: `AI`, `Prompt`, `Sitecore`, `Codelab`, `Cloud`, `Frontend`, `Backend`
- **Favourites** — star to pin; favourites sort to top within results
- **Descriptions** — optional short summary shown on the card

### Discovery
- **Real-time search** — filters title, description, and content as you type
- **Category filter** — AND logic: snippet must match all selected categories

### Clipboard
- **One-click copy** — copies snippet content; shows "Copied!" for 2 seconds
- **Silent failure handling** — no crash if clipboard permission is denied

### Sync & Offline
- **Firestore real-time sync** — `onSnapshot` keeps the list live across tabs
- **Offline persistence** — IndexedDB cache (via `persistentLocalCache`) serves data offline
- **Sync status badge** — shows Synced / Syncing… / Offline in the header
- **Demo mode** — click the badge to manually force offline (useful for presentations)
- **Auto-reconnect** — pending writes replay automatically when back online

### Audit Trail
Every snippet stores:
- `userId` — owner's Firebase UID
- `createdBy` — display name at creation
- `updatedBy` — display name of last editor
- `createdAt` / `updatedAt` — ISO timestamps

### Sample Data
- "Load sample snippets" button seeds 3 demo snippets into Firestore
- Button only appears when the collection is empty
- Shows upload progress and Firestore error messages with actionable links

---

## Planned / Future Features

### Data
- [ ] Import/export snippets as JSON
- [ ] Cloud backup / restore

### Collaboration
- [ ] Share individual snippets with other users (read-only link)
- [ ] Team workspaces (shared snippet collections)

### UX
- [ ] Keyboard shortcut to open search
- [ ] Drag-and-drop reorder within favourites
- [ ] Custom category management (add/rename/delete categories)
- [ ] Snippet usage counter (track copy frequency)
- [ ] Full-text search via Firestore extensions or Algolia

### Platform
- [ ] Chrome Extension build target (static export from same codebase)
- [ ] Mobile-responsive layout improvements
