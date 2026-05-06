---
description: Seed the Firestore emulator with test data
---

Seed the local Firebase emulator with test data via the project's seed script.

Steps:

1. Check the Firestore emulator is reachable: `curl -s http://127.0.0.1:8080/ -o /dev/null -w '%{http_code}\n'`. If it doesn't return `200`, tell the user to start the Firebase emulator suite first (`firebase emulators:start`) and stop — don't try to start it yourself, since the emulator is a long-running foreground process and the user typically wants control of that terminal.
2. If the emulator is up, run `npx tsx scripts/seed-emulator.ts`.
3. Report the result. Surface any errors verbatim.
