# Firebase Setup

## 1. Get your Firebase config

1. Go to [Firebase Console](https://console.firebase.google.com/) and open your project
2. Navigate to **Project Settings** → **Your apps** → select your web app (or create one)
3. Copy the config object values

## 2. Create .env.local

```bash
cp .env.local.example .env.local
```

Fill in your values from the Firebase Console:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

> **Note:** Projects created before mid-2024 use `.appspot.com` for the storage bucket. Check your Firebase Console for the exact value.

## 3. Enable Firestore

1. Firebase Console → **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose a region closest to your users

## 4. Firestore Security Rules

Firebase Console → Firestore → **Rules** tab — paste the contents of `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    match /snippets/{snippetId} {
      allow read, delete: if request.auth != null
                          && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null
                    && request.auth.uid == resource.data.userId
                    && request.resource.data.userId == resource.data.userId;
    }
  }
}
```

## 5. Firestore Composite Index

The snippets query uses `where('userId', '==', ...)` + `orderBy('createdAt', 'desc')`.
Firestore requires a composite index for this combination.

**Easiest way:** Load the app after sign-in — if the index is missing, the error banner
will contain a direct link to create it in Firebase Console. Click it, wait ~1–2 minutes,
then refresh.

**Manual way:**
1. Firebase Console → Firestore → **Indexes** tab → **Add index**
2. Collection: `snippets`
3. Fields: `userId ASC`, `createdAt DESC`

The index definition is also in `firestore.indexes.json` for the Firebase CLI.

## 6. Enable Authentication

1. Firebase Console → **Authentication** → **Get started**
2. **Sign-in method** tab → enable **Google**
3. Set a project support email and save
4. **Settings** tab → **Authorized domains** → confirm `localhost` is listed, and add your production domain

## 7. Data Structure

```
firestore/
├── users/
│   └── {uid}                   ← user profile document
│       uid: string
│       displayName: string
│       email: string
│       photoURL: string | null
│       createdAt: string (ISO)
│       lastLoginAt: string (ISO)
│
└── snippets/
    └── {snippetId}             ← flat collection; userId field = relationship to user
        userId: string          ← FK → users/{uid}
        createdBy: string
        updatedBy: string
        title: string
        description: string
        content: string
        categories: string[]
        isFavorite: boolean
        createdAt: string (ISO)
        updatedAt: string (ISO)
```
