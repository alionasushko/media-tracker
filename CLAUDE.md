# Media Tracker — Claude Guide

Expo + React Native app for tracking movies, shows, books, and games. Backed by Firebase (Auth, Firestore, Storage).

## Stack

- **Runtime**: Expo SDK 54, React Native 0.81, React 19, `expo-dev-client` (NOT Expo Go).
- **Routing**: Expo Router with route groups `(auth)` and `(app)`, tab nav inside `(app)/(tabs)`, modal/card stacks for item detail and add.
- **UI**: Hybrid — `react-native-paper` provides theme infrastructure + `TextInput`/`HelperText`. Everything else is custom primitives in [src/shared/components/design/](src/shared/components/design/) (Button, Text, Chip, StatusPill, …) consuming tokens via `useAppTheme()`.
- **Theme tokens**: [src/shared/theme/tokens.ts](src/shared/theme/tokens.ts) — fonts (InstrumentSans + JetBrainsMono), spacing `s1`–`s8`, radii, semantic palette, per-media-type accents.
- **State**: Zustand for UI ([src/stores/ui.store.ts](src/stores/ui.store.ts) — theme + filters, persisted to AsyncStorage). TanStack Query for server state.
- **Forms**: react-hook-form + zod via `zodResolver`, `mode: 'onBlur'`. Schemas in `schema.ts` per feature.
- **Firebase**: `@react-native-firebase/*` only — never the JS SDK (`firebase/...`). Service layer in [src/shared/services/](src/shared/services/).

## Project layout

```
app/                          # Expo Router routes
  (auth)/                     # sign-in, sign-up
  (app)/                      # auth-gated; redirects to (auth) if signed out
    (tabs)/                   # home, library, stats, settings
    item/{add,[id]}.tsx       # modal/card stacks
src/
  features/{auth,media,settings}/    # feature folders: components, hooks, queries.ts, schema.ts, types.ts
  shared/{components,hooks,services,styles,theme,utils}/
  stores/                            # Zustand
```

Imports use the `@/...` alias (mapped to `src/`). No relative imports across feature boundaries.

## Conventions

### TanStack Query

- Query keys are **hierarchical and namespaced** — see `mediaKeys` in [src/features/media/queries.ts](src/features/media/queries.ts): `all` → `forOwner(uid)` → `list(...) | entry(id) | byOwner(...)`.
- Mutations apply **optimistic patches across `InfiniteData<MediaPage>` lists plus the `entry` and `byOwner` queries** in `onMutate`, snapshot for rollback in `onError`, and invalidate ancestor keys in `onSettled`. Follow this pattern for new mutations.
- Global error toasts wired via `QueryCache.onError` / `MutationCache.onError` in the root layout — don't add per-query error UI unless the case is special.

### Forms

- One zod schema per form, colocated in `schema.ts`. Strong rules go in `.refine(...)` (see auth password rules).
- Always use `Controller` with the custom `FormField` wrapper — don't pass refs into raw inputs.
- Unsaved-changes flow uses React Navigation's `usePreventRemove` + manual `dispatch(action)` (see [app/(app)/item/add.tsx](app/(app)/item/add.tsx)).

### Firebase

- Auth state via `useAuthUser()` (subscribes to `onAuthStateChanged`). Don't read `auth().currentUser` in render paths.
- Firestore: native modular API (`where`, `orderBy`, `limit`, `startAfter`) on `@react-native-firebase/firestore`.
- Storage: cover uploads run through `expo-image-manipulator` first; path is `covers/{ownerId}/{mediaId}_{timestamp}.jpg`. Use [src/shared/services/storage.ts](src/shared/services/storage.ts) helpers, don't reinvent.
- Emulator runs on `127.0.0.1` (firestore 8080, auth 9099) when `__DEV__`.

### UI

- Confirmation dialogs use the custom [ConfirmDialog](src/shared/components/ui/ConfirmDialog.tsx), which wraps a raw RN `Modal` — Paper's `Dialog` does NOT render above iOS modal sheets, so don't switch back to it.
- Online status via `useOnlineStatus()` + [OfflineBanner](src/shared/components/ui/OfflineBanner.tsx).
- Google Sign-In is the native picker — ID token → `GoogleAuthProvider.credential()` → Firebase Auth. No web OAuth flow.

## Commands

| Task | Command |
|---|---|
| iOS dev build | `npm run ios` |
| Android dev build | `npm run android` |
| Type-check | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Deploy Firestore rules | `npm run firebase:deploy:rules` |
| Seed emulator | `npx tsx scripts/seed-emulator.ts` |

**No test suite exists.** Don't run `npm test` or assume jest/RNTL.

## Don't

- Don't import from `firebase/...` (JS SDK). Always `@react-native-firebase/...`.
- Don't switch from `expo-dev-client` workflows to Expo Go — native modules require it.
- Don't bypass the theme tokens with hardcoded colors / spacing / fonts.
- Don't add backwards-compat shims, dead-code comments, or speculative abstractions.
- Don't add error handling beyond what already exists — global toasts cover query/mutation failures.
- Don't claim a UI change works from `tsc` passing alone. RN visual bugs (e.g. iOS Fabric `RefreshControl` issues we've hit) only surface in the simulator. If you didn't open it, say so.

## When making changes

- Cross-cutting changes (>2 files): plan first.
- Anchor edits to specific files / lines, follow existing patterns rather than inventing new ones.
- New screens: copy the structure of an existing one in [src/features/media/](src/features/media/) — feature folder + queries + schema + components.
- Touching [firestore.rules](firestore.rules) or query ownership logic: re-read the rules end-to-end; ownership bugs are silent.
