# Media Tracker

> Expo + Firebase app to track movies, shows, books, and games.

## Stack

- Expo (React Native), Expo Router
- React Native Paper
- Zustand + TanStack Query
- Firebase Auth + Firestore

## Features

- Sign In / Sign Up: Google OAuth flow via Expo Auth Session → routes to your library.
- Library: Card list of your media; quick access to details; supports search, filters, sort.
- Item Details: View full info, notes, status, and rating; open edit/delete actions.
- Add / Edit Item: Form to create or update media entries; persists to Firestore.
- Settings: App preferences and account actions (e.g., sign out).

## Setup

```bash
git clone <repo-url>
cd media-tracker
npm i
cp .env.example .env
npx expo start
```

### Firebase

- Create a Firebase project → copy config to .env (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
- Authentication → enable Google (set support email).
- Google OAuth clients (Google Cloud Console → Credentials):
- Web/Expo: add the redirect URIs printed by Expo; set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID.
- iOS/Android (for native builds): create clients and set EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID / EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID (add SHA‑1/256).
- App scheme for redirects: process.env.EXPO_PUBLIC_SCHEME || "mediatracker".
- Firestore: create DB (test mode for dev), add rules (firestore.rules) and composite indexes for queries (firestore.indexes.json)
