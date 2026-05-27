# Umami Analytics Tracking — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 10 custom analytics events covering the full player funnel, key interactions, and reliability signals — using Umami v3's programmatic and declarative APIs.

**Architecture:** Event constants centralized in one file, programmatic `track()` calls in the Pinia store's existing socket listeners, `data-umami-event` attributes on 3 UI elements. Web Vitals enabled via script attribute. No new dependencies, no build-time coupling.

**Tech Stack:** Nuxt 4, Pinia, Socket.IO, Umami v3 (self-hosted), TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `app/constants/analytics.ts` | Event name constants, `AnalyticsEvent` type |
| Modify | `app/stores/game.ts` | `track()` calls in 6 socket handlers + 1 action (7 total) |
| Modify | `app/plugins/umami.ts` | Add `data-performance="true"` for Web Vitals |
| Modify | `app/components/game/WaitingState.vue` | `data-umami-event` on copy button |
| Modify | `app/components/ThemeToggle.vue` | `data-umami-event` on toggle button |
| Modify | `app/components/LanguageSwitcher.vue` | `data-umami-event` on toggle button |

---

### Task 1: Event Constants

**Files:**
- Create: `app/constants/analytics.ts`

- [ ] **Step 1: Create the constants file**

```typescript
export const AnalyticsEvent = {
  ROOM_CREATED: 'room-created',
  ROOM_JOINED: 'room-joined',
  GAME_STARTED: 'game-started',
  GAME_ENDED: 'game-ended',
  GAME_RESTARTED: 'game-restarted',
  INVITE_COPIED: 'invite-copied',
  THEME_TOGGLED: 'theme-toggled',
  LANG_SWITCHED: 'lang-switched',
  SESSION_RESTORED: 'session-restored',
  SOCKET_ERROR: 'socket-error',
} as const

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent]

export const KNOWN_SOCKET_ERRORS: Record<string, string> = {
  'User not found': 'user-not-found',
  'Room not found or full': 'room-not-found-or-full',
  'Room not found': 'room-not-found',
  'Invalid input': 'invalid-input',
  'not found in room': 'not-found-in-room',
  'Failed to rejoin room': 'rejoin-failed',
}
```

- [ ] **Step 2: Commit**

```bash
git add app/constants/analytics.ts
git commit -m "feat(analytics): add event name constants"
```

---

### Task 2: Enable Web Vitals

**Files:**
- Modify: `app/plugins/umami.ts`

- [ ] **Step 1: Add `data-performance` attribute to the script tag**

In `app/plugins/umami.ts`, the `useHead` call currently has `src`, `data-website-id`, and `defer`. Add one attribute:

```typescript
useHead({
  script: [
    {
      src: `${umami.host}/script.js`,
      "data-website-id": umami.id,
      "data-performance": "true",
      defer: true,
    },
  ],
});
```

The only change is adding `"data-performance": "true"` to the existing object.

- [ ] **Step 2: Commit**

```bash
git add app/plugins/umami.ts
git commit -m "feat(analytics): enable Web Vitals collection"
```

---

### Task 3: Funnel Events in Store

**Files:**
- Modify: `app/stores/game.ts`

This task adds `track()` calls inside existing socket handlers. No new handlers, no new state, no structural changes — just inserting lines into existing functions. `game-restarted` is detected inside `handleGameStarted` by checking `room.value?.state` before the assignment (no separate action needed).

- [ ] **Step 1: Add imports at top of store file**

After the existing imports in `app/stores/game.ts`, add:

```typescript
import { AnalyticsEvent, KNOWN_SOCKET_ERRORS } from '~/constants/analytics'
```

- [ ] **Step 2: Add `useUmami` initialization in `initSocket`**

Inside `initSocket()`, after the line `t = useI18n().t`, add a store-level variable and its initialization:

Declare a new variable next to the existing `let t: any = null` line:

```typescript
let analytics: ReturnType<typeof useUmami> | null = null
```

Then in `initSocket()`, after `t = useI18n().t`:

```typescript
analytics = useUmami()
```

- [ ] **Step 3: Track `room-created` in `handleSuccessHostRoom`**

In `handleSuccessHostRoom`, after `updateRoomCode(data.room_id)` and before the toast, add:

```typescript
analytics?.track(AnalyticsEvent.ROOM_CREATED)
```

No properties — `room.value` is not populated yet at `success_host_room` time (server only sends `{ room_id }`). Settings are captured later at `game-started`.

- [ ] **Step 4: Track `room-joined` in `handleSuccessJoin`**

In `handleSuccessJoin`, after `room.value = data.room`, add:

```typescript
analytics?.track(AnalyticsEvent.ROOM_JOINED, {
  'player-count': data.room.users.length,
})
```

- [ ] **Step 5: Track `game-started` + `game-restarted` in `handleGameStarted`**

Replace the body of `handleGameStarted` with the combined block from Step 7 below. The full handler becomes:

```typescript
const handleGameStarted = (data: { room: Room }) => {
  console.log('[Socket] Game started', data)

  const isRestart = room.value?.state === 'ENDED'
  room.value = data.room

  analytics?.track(AnalyticsEvent.GAME_STARTED, {
    'player-count': data.room.users.length,
    duration: data.room.settings.duration,
    'word-count': data.room.settings.wordCount,
    language: data.room.settings.language,
  })

  if (isRestart) {
    analytics?.track(AnalyticsEvent.GAME_RESTARTED)
  }

  toast?.success({
    title: t('toast.gameStarted')
  })
}
```

Check `room.value?.state` BEFORE the assignment. If previous state was `ENDED`, fire `game-restarted` after `game-started`. Both events only fire after server confirmation.

- [ ] **Step 6: Track `game-ended` in `handleGameFinish`**

In `handleGameFinish`, after `room.value = data.room`, add:

```typescript
if (user.value) {
  const sortedUsers = [...data.room.users].sort((a, b) => b.score - a.score)
  const me = sortedUsers.find(u => u.sessionId === user.value!.sessionId)
  const rank = me ? sortedUsers.indexOf(me) + 1 : 1

  analytics?.track(AnalyticsEvent.GAME_ENDED, {
    'player-count': data.room.users.length,
    duration: data.room.settings.duration,
    score: me?.score ?? 0,
    rank,
    language: data.room.settings.language,
  })
}
```

Guard: skip tracking if `user.value` is null (shouldn't happen, but avoids rank=0 contamination). Score comes from `data.room.users` (server-authoritative), not from `user.value.score` (local copy that can diverge under reconnects).

- [ ] **Step 7: Track `session-restored` in `handleSuccessRejoin`**

In `handleSuccessRejoin`, after `user.value = data.user`, add:

```typescript
analytics?.track(AnalyticsEvent.SESSION_RESTORED)
```

- [ ] **Step 8: Track `socket-error` in `handleError`**

In `handleError`, after `error.value = errorMessage` and before the `if (errorMessage.includes('Room not found'))` check, add:

```typescript
const errorKey = Object.entries(KNOWN_SOCKET_ERRORS).find(([k]) => errorMessage.includes(k))?.[1] ?? 'unknown'
analytics?.track(AnalyticsEvent.SOCKET_ERROR, { error: errorKey })
```

Allowlist of known server error strings → normalized kebab-case keys. Unknown errors map to `'unknown'` — no raw message forwarded (avoids leaking room codes or internal state).

- [ ] **Step 9: Commit**

```bash
git add app/stores/game.ts
git commit -m "feat(analytics): track funnel + reliability events in store"
```

---

### Task 4: Declarative Events on UI Components

**Files:**
- Modify: `app/components/game/WaitingState.vue`
- Modify: `app/components/ThemeToggle.vue`
- Modify: `app/components/LanguageSwitcher.vue`

These use `data-umami-event` attributes — no composable needed. Umami's script.js automatically intercepts clicks on elements with this attribute.

- [ ] **Step 1: Add `data-umami-event` on the copy button in WaitingState**

In `app/components/game/WaitingState.vue`, find the copy button (line 54):

```html
<button @click="handleCopyLink"
  class="px-6 py-3 bg-player-yellow hover:bg-player-yellow/80 text-white font-bold rounded-lg transition">
```

Add the attribute:

```html
<button @click="handleCopyLink"
  data-umami-event="invite-copied"
  class="px-6 py-3 bg-player-yellow hover:bg-player-yellow/80 text-white font-bold rounded-lg transition">
```

- [ ] **Step 2: Add `data-umami-event` on ThemeToggle**

In `app/components/ThemeToggle.vue`, find the button (line 2):

```html
<button
  @click="toggleTheme"
  class="p-2 rounded-lg transition-colors"
```

Add the attributes. Umami reads `data-umami-event-*` DOM attributes at click time, so binding them reactively with `:` gives the correct current value:

```html
<button
  @click="toggleTheme"
  data-umami-event="theme-toggled"
  :data-umami-event-theme="isDark ? 'light' : 'dark'"
  class="p-2 rounded-lg transition-colors"
```

Note: the value is the theme being switched TO (what the user chose), not the current theme.

- [ ] **Step 3: Add `data-umami-event` on LanguageSwitcher**

In `app/components/LanguageSwitcher.vue`, find the button (line 2):

```html
<button
  @click="toggleLocale"
  class="p-2 rounded-lg transition-colors bg-surface-alt hover:bg-surface"
```

Add the attributes:

```html
<button
  @click="toggleLocale"
  data-umami-event="lang-switched"
  :data-umami-event-lang="currentLocale === 'fr' ? 'en' : 'fr'"
  class="p-2 rounded-lg transition-colors bg-surface-alt hover:bg-surface"
```

Same logic — the value is the language being switched TO.

- [ ] **Step 4: Commit**

```bash
git add app/components/game/WaitingState.vue app/components/ThemeToggle.vue app/components/LanguageSwitcher.vue
git commit -m "feat(analytics): declarative tracking on invite/theme/lang UI"
```

---

### Task 5: Build Verification

- [ ] **Step 1: Run the build**

```bash
cd /home/hoka/ghq/github.com/corploc/wordus && pnpm build
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 2: Verify script injection**

Set env vars and rebuild to confirm the Umami script renders with `data-performance`:

```bash
NUXT_PUBLIC_UMAMI_HOST=https://analytics.minist.re NUXT_PUBLIC_UMAMI_ID=test-id pnpm build
```

Then inspect `.output/public/index.html` (or the SSR-rendered HTML) for:

```html
<script src="https://analytics.minist.re/script.js" data-website-id="test-id" data-performance="true" defer></script>
```

- [ ] **Step 3: Grep for all track calls to confirm placement**

```bash
grep -n 'analytics?.track\|data-umami-event' app/stores/game.ts app/components/game/WaitingState.vue app/components/ThemeToggle.vue app/components/LanguageSwitcher.vue
```

Expected: 7 `analytics?.track` calls in `game.ts`, 1 `data-umami-event` per component file (3 total). 10 events total.

---

## Event Reference

| # | Event Name | Trigger | Properties | Method |
|---|------------|---------|------------|--------|
| 1 | `room-created` | `handleSuccessHostRoom` | — | `track()` |
| 2 | `room-joined` | `handleSuccessJoin` | `player-count` | `track()` |
| 3 | `game-started` | `handleGameStarted` | `player-count`, `duration`, `word-count`, `language` | `track()` |
| 4 | `game-ended` | `handleGameFinish` | `player-count`, `duration`, `score`, `rank`, `language` | `track()` |
| 5 | `game-restarted` | `restartGame()` | — | `track()` |
| 6 | `invite-copied` | WaitingState copy button | — | `data-umami-event` |
| 7 | `theme-toggled` | ThemeToggle button | `theme` | `data-umami-event` |
| 8 | `lang-switched` | LanguageSwitcher button | `lang` | `data-umami-event` |
| 9 | `session-restored` | `handleSuccessRejoin` | — | `track()` |
| 10 | `socket-error` | `handleError` | `error` | `track()` |
