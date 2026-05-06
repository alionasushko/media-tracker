---
description: Show pending Firestore rules changes, then deploy after confirmation
---

Deploy Firestore security rules with a safety check first.

Steps:

1. Run `git diff HEAD -- firestore.rules` to show staged + unstaged changes vs the last commit. If empty, also run `git log -3 --oneline -- firestore.rules` so the user can see what's been committed but possibly not yet deployed.
2. Show the diff/log output to the user as a code block.
3. **STOP and ask the user to confirm** before deploying. Do not auto-deploy — Firestore rules changes are immediately live in production.
4. Once confirmed, run `npm run firebase:deploy:rules` and report the result.
5. If the deploy fails, surface the full error — don't try to "fix" rules silently.

Notes:
- `firestore.indexes.json` is deployed separately via `npm run firebase:deploy:indexes` — don't bundle them unless the user explicitly asks.
- This command targets the project Firebase pointed at by the current `firebase use` alias. Run `firebase use` first to confirm the active project if you're unsure.
