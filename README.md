# Media Tracker

> Expo + Firebase app to track movies, shows, books, and games.

https://github.com/user-attachments/assets/3308201e-6de0-4f91-90df-6dcc1d749675

## Stack

- Expo SDK 54 (React Native, Expo Router) on `expo-dev-client`
- UI: custom design system with theme tokens (InstrumentSans + JetBrainsMono fonts) in `src/shared/components/design/`; React Native Paper provides the theme provider plus `TextInput` / `HelperText` for forms
- State: Zustand (UI/theme/filters, persisted) + TanStack Query (server state, optimistic updates)
- Forms: react-hook-form + zod via `zodResolver`
- React Native Firebase (Auth + Firestore + Storage)
- Native Google Sign-In via `@react-native-google-signin/google-signin`
- Offline detection: `@react-native-community/netinfo`

## Features

Organised around a four-tab navigation:

- **Home**: Personalised greeting, activity heatmap, and an "Up Next" shelf of in-progress media.
- **Library**: Tile grid of all your media with search, filter, and sort.
- **Stats**: Hero summary, streaks, completion funnel, type donut, monthly activity bars, rating histogram, and tag cloud.
- **Settings**: Theme selection, account info, and sign-out.

Plus:

- **Sign In / Sign Up**: Email/password + native Google account picker.
- **Item Details**: Full info, notes, status, and rating with edit / delete actions.
- **Add / Edit Item**: Form with cover upload (via `expo-image-manipulator` + Firebase Storage) and unsaved-changes protection.
- **Offline banner**: Surfaces when the device loses connectivity.

## Setup

```bash
git clone <repo-url>
cd media-tracker
npm i
cp .env.example .env
# Place GoogleService-Info.plist + google-services.json at the repo root (see below)
npx expo run:ios       # first build compiles a dev client and installs on the simulator
```

> This project uses `expo-dev-client` and native modules (React Native Firebase,
> Google Sign-In), so it **cannot run in Expo Go**. Always use `npx expo run:ios`
> or `npx expo run:android` to build a development client, then `npx expo start`
> to iterate.

### Firebase & Google Auth Setup

This app uses [React Native Firebase](https://rnfirebase.io/) for Auth, Firestore,
and Storage, plus [@react-native-google-signin/google-signin](https://github.com/react-native-google-signin/google-signin)
for the native Google account picker. Firebase is configured via the platform
credential files, **not** via `.env`.

#### 1) Firebase Console

- Create (or open) your Firebase project.
- **Authentication → Sign-in method → Google** → Enable, set a support email.
- **Project settings → Your apps**:
  - Add an **iOS app**. Bundle ID: `com.<yourname>.mediatracker` (matches
    `app.json` → `ios.bundleIdentifier`). Download `GoogleService-Info.plist`.
  - Add an **Android app**. Package name: `com.<yourname>.mediatracker` (matches
    `app.json` → `android.package`). Add your debug and release SHA-1 fingerprints
    (`eas credentials` or `./gradlew signingReport`). Download `google-services.json`.
- **Firestore** → create database (test mode for dev). Add rules
  (`firestore.rules`) and composite indexes (`firestore.indexes.json`) as needed.

#### 2) Google Cloud Console

Select the same GCP project that backs your Firebase project.

- **APIs & Services → OAuth consent screen**
  - User type: External. Fill in app name, support email, developer contact.
  - Scopes: `openid`, `email`, `profile`.
  - Add yourself as a **test user** while the app is in Testing mode.
- **APIs & Services → Credentials**
  - Firebase auto-creates a **Web OAuth client** when you enable Google sign-in.
    Copy its **Client ID** — you'll need it for `.env`.
  - iOS and Android OAuth clients are also auto-created when you register those
    apps in Firebase.

#### 3) Place credential files at the repo root

```
./GoogleService-Info.plist     # iOS
./google-services.json         # Android
```

Both are referenced from `app.json` via `ios.googleServicesFile` and
`android.googleServicesFile`. They are **gitignored** — do not commit them.

#### 4) Environment variables (`.env`)

Everything else comes from the credential files.

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=<Web client ID from step 2>
EXPO_PUBLIC_USE_EMULATOR=false
```

The Web client ID is required by `GoogleSignin.configure()` so that the Google
SDK requests an ID token that Firebase Auth can accept.

Set `EXPO_PUBLIC_USE_EMULATOR=true` to point Auth and Firestore at the local
Firebase emulator suite (`127.0.0.1:9099` and `127.0.0.1:8080`). Only takes
effect in `__DEV__` builds. Leave as `false` to talk to your real Firebase
project.

#### 5) Build the dev client

After the credential files are in place and `.env` is set:

```bash
npx expo run:ios        # or: npx expo run:android
```

Expo runs `prebuild` to regenerate `ios/` (and `android/`) with the Firebase
config plugins wired in, then compiles and installs the dev client on your
simulator. Subsequent runs can use:

```bash
npx expo start
# press i (iOS) or a (Android) to open the installed dev client
```

### Notes on `app.json`

The project uses a few config plugins that are load-bearing for auth:

- `@react-native-firebase/app`, `@react-native-firebase/auth` — wire the native
  Firebase SDKs in.
- `expo-build-properties` with `ios.useFrameworks: "static"` +
  `ios.buildReactNativeFromSource: true` — needed for React Native Firebase to
  compile alongside Google Sign-In's Swift SDK on Expo SDK 54. **Without
  `buildReactNativeFromSource`, the iOS build fails with Clang module errors in
  `RNFBFirestore` headers.** The first iOS build is a few minutes slower because
  React Native is compiled from source; subsequent builds are normal speed.
- `@react-native-google-signin/google-signin` with `iosUrlScheme` set to the
  `REVERSED_CLIENT_ID` from `GoogleService-Info.plist`.

### Error handling

Firebase auth errors are surfaced as toasts via `src/shared/utils/toast.ts`.
Common codes:

- `auth/invalid-credential`, `auth/wrong-password` — wrong email or password.
- `auth/account-exists-with-different-credential` — the email is already
  registered with a different sign-in method.
- `auth/operation-not-allowed` — Google provider is not enabled in Firebase.
- `auth/too-many-requests` — temporarily rate-limited.
- `auth/network-request-failed` — no internet.
