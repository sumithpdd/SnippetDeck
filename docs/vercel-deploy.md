# Vercel Deployment

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial SnippetDeck Pro with Next.js + Firebase"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repo
4. Framework: **Next.js** (auto-detected)
5. Root directory: leave as `/`

## 3. Set Environment Variables

In Vercel → Project → **Settings → Environment Variables**, add all six Firebase variables from your `.env.local`:

| Key | Where to find it |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → Web app |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → Web app |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → Web app |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → Web app |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings → Web app |

Set these for **Production**, **Preview**, and **Development** environments.

## 4. Deploy

Click **Deploy**. Vercel runs `next build` and publishes your app.

## 5. Add your Vercel domain to Firebase Auth

After deploying, go to:
Firebase Console → Authentication → Settings → **Authorized domains**

Add your Vercel deployment domain (e.g. `your-app.vercel.app`).

## Automatic Deploys

Every `git push` to `main` triggers a new production deployment automatically.
Pull requests get isolated preview URLs.
