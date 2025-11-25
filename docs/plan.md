# Wordus Modernization Plan

## Document Information

**Version**: 1.0
**Date**: 2025-11-24
**Purpose**: Complete modernization from vanilla JS to Nuxt 3 + TypeScript + Tailwind CSS
**Status**: Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Target State](#target-state)
4. [Technology Stack](#technology-stack)
5. [Migration Strategy](#migration-strategy)
6. [Project Structure](#project-structure)
7. [Key Changes](#key-changes)
8. [Implementation Phases](#implementation-phases)
9. [Timeline & Resources](#timeline--resources)
10. [Risks & Mitigation](#risks--mitigation)
11. [Success Criteria](#success-criteria)

---

## Executive Summary

### Objective

Modernize Wordus from a vanilla JavaScript application to a modern, maintainable, and scalable Nuxt 3 full-stack application with TypeScript, Tailwind CSS, and comprehensive testing.

### Scope

**Complete rewrite** of the application with the following goals:

- Migrate from vanilla JS to **Nuxt 3 + Vue 3 + TypeScript**
- Replace custom CSS with **Tailwind CSS + Headless UI**
- Implement **Pinia** for state management
- Modernize Socket.IO integration with **nuxt-socket-io**
- Add comprehensive **testing** (Vitest + Playwright)
- Maintain **100% feature parity** with existing game
- Preserve **same UI/UX** (visual design)
- Improve **code quality, maintainability, and type safety**

### Why Modernize?

**Current Pain Points**:

- No type safety (vanilla JS)
- Manual DOM manipulation (error-prone)
- CSS organization challenges
- Difficult to test
- Hard to maintain and extend
- No component reusability
- Browserify bundling (outdated)

**Benefits of Modernization**:

- ✅ Type safety with TypeScript
- ✅ Reactive components (Vue 3)
- ✅ Modern build tooling (Vite)
- ✅ Utility-first styling (Tailwind)
- ✅ Better state management (Pinia)
- ✅ Comprehensive testing
- ✅ Better DX (Developer Experience)
- ✅ Easier to maintain and extend
- ✅ Modern deployment options

### Approach

**Strategy**: Full rewrite in phases, not incremental migration

**Rationale**:

- Old codebase is vanilla JS (no component structure to preserve)
- CSS architecture needs complete overhaul
- Socket.IO integration needs restructuring
- Clean slate allows for best practices from day one
- Can reference old code for logic/behavior

**Timeline**: 6-8 weeks (full-time development)

---

## Current State Analysis

### Technology Audit

#### Current Tech Stack

| Component     | Technology                                | Status                  |
| ------------- | ----------------------------------------- | ----------------------- |
| **Frontend**  | Vanilla JavaScript (ES6+)                 | ⚠️ Outdated             |
| **Bundler**   | Browserify                                | ⚠️ Outdated             |
| **Styling**   | Custom CSS (component-based organization) | ⚠️ Hard to maintain     |
| **Backend**   | Node.js + Express                         | ✅ Works but not modern |
| **Real-time** | Socket.IO (v4)                            | ✅ Modern               |
| **State**     | Global objects + closures                 | ⚠️ Not scalable         |
| **Testing**   | None                                      | ❌ No tests             |
| **Types**     | None (vanilla JS)                         | ❌ No type safety       |

#### File Structure (Current)

```
old/
├── index.js                  # Server file
├── views/                    # HTML pages (3 files)
├── js/
│   ├── classe/              # Class definitions (6 classes)
│   ├── factories/           # Factory classes (4 files)
│   ├── client/              # Client-side code (3 pages + bundles)
│   │   └── views/           # View rendering functions
│   ├── words/               # Word databases (3 files)
│   └── functions.js         # Utilities
├── css/
│   ├── master.css
│   ├── abstracts/           # Variables, animations
│   ├── layout/              # Header, sections
│   ├── pages/               # Page-specific styles
│   └── components/          # UI component styles
└── music/                   # Audio files
```

### Current Architecture Issues

**1. Manual DOM Manipulation**

```javascript
// Current approach (error-prone)
function updateWords(words) {
  const container = document.querySelector(".words-container");
  container.innerHTML = ""; // Wipe everything
  words.forEach((word) => {
    const elem = document.createElement("div");
    elem.className = "word";
    elem.textContent = word.word;
    container.appendChild(elem);
  });
}
```

**2. Global State**

```javascript
// Server-side (index.js)
const rooms = {}; // Global mutable state
const users = {}; // Global mutable state

// No structure, hard to test
```

**3. No Type Safety**

```javascript
// No way to know what properties exist
function updateScore(user, points) {
  user.score += points; // What if score doesn't exist?
}
```

**4. CSS Maintenance**

```css
/* Lots of custom CSS with magic numbers */
.word {
  position: absolute;
  top: calc(var(--position) * 50px); /* Hard to maintain */
  left: 50px;
  /* ... */
}
```

**5. Testing Challenges**

- No component boundaries to test in isolation
- Global state makes testing difficult
- No mocking framework
- Manual browser testing only

### What Works Well (To Preserve)

✅ **Game Logic**

- Word generation algorithm
- Scoring system (word length × multiplier)
- Combo system (reset on error)
- Timer mechanism
- Multiplayer synchronization logic

✅ **Socket.IO Events**

- Well-defined event contracts
- Good separation of concerns
- Reliable real-time updates

✅ **UI/UX Design**

- Clean, functional interface
- Good visual hierarchy
- Pleasant animations
- Effective audio feedback

✅ **Features**

- Room creation/joining flow
- 6-player multiplayer
- Multi-language support
- Customizable game settings
- Disconnect handling

**Goal**: Preserve all this functionality while improving code quality

---

## Target State

### Vision

A modern, type-safe, component-based application that:

- Maintains 100% feature parity
- Improves code maintainability
- Enables easy feature additions
- Provides excellent developer experience
- Supports comprehensive testing

### Technology Stack (Target)

| Component          | Technology                 | Version            | Rationale                                 |
| ------------------ | -------------------------- | ------------------ | ----------------------------------------- |
| **Framework**      | Nuxt 3                     | Latest (3.x)       | Modern full-stack framework, excellent DX |
| **Frontend**       | Vue 3                      | Latest (3.x)       | Composition API, better performance       |
| **Language**       | TypeScript                 | Latest (5.x)       | Type safety, better tooling               |
| **Styling**        | Tailwind CSS               | Latest (3.x)       | Utility-first, maintainable               |
| **Components**     | Headless UI                | Latest             | Accessible, unstyled components           |
| **State**          | Pinia                      | Latest             | Official Vue 3 state management           |
| **Real-time**      | Socket.IO + nuxt-socket-io | Latest             | Reliable WebSocket communication          |
| **Backend**        | Nitro (Nuxt server)        | Built-in           | Modern Node.js server                     |
| **Build Tool**     | Vite                       | Built-in with Nuxt | Fast HMR, modern bundling                 |
| **Testing (Unit)** | Vitest                     | Latest             | Fast, Vite-native testing                 |
| **Testing (E2E)**  | Playwright                 | Latest             | Reliable, multi-browser                   |
| **Deployment**     | Docker                     | Latest             | Containerized deployment                  |

### Architecture Overview (Target)

```
┌─────────────────────────────────────────────────────────────┐
│                    Nuxt 3 Application                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Client-Side (Browser)                     │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │ │
│  │  │ Vue 3        │  │ Pinia Stores │  │ Socket.IO  │  │ │
│  │  │ Components   │◄─┤ (State Mgmt) │◄─┤ Client     │  │ │
│  │  │ (TypeScript) │  │              │  │            │  │ │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │ │
│  │         │                                       │      │ │
│  │         │ Tailwind CSS                         │      │ │
│  │         ▼                                       │      │ │
│  │  ┌──────────────┐                              │      │ │
│  │  │ Headless UI  │                              │      │ │
│  │  │ Components   │                              │      │ │
│  │  └──────────────┘                              │      │ │
│  └────────────────────────────────────────────────┼──────┘ │
│                                                    │        │
│                                        WSS (Socket.IO)     │
│                                                    │        │
│  ┌────────────────────────────────────────────────┼──────┐ │
│  │              Server-Side (Nitro)               │      │ │
│  │                                                 │      │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────▼────┐ │ │
│  │  │ API Routes   │  │ Server Utils │  │ Socket.IO   │ │ │
│  │  │ (TypeScript) │  │ (TypeScript) │  │ Server      │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │         │                  │                │         │ │
│  │         └──────────────────┼────────────────┘         │ │
│  │                            │                          │ │
│  │                  ┌─────────▼──────────┐               │ │
│  │                  │  In-Memory State   │               │ │
│  │                  │  (Rooms, Users)    │               │ │
│  │                  └────────────────────┘               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Stack

#### Nuxt 3

**Why**:

- Full-stack framework with server-side rendering
- Built on Vite (fast HMR)
- File-based routing
- Auto-imports (components, composables)
- Excellent TypeScript support
- Great developer experience

#### Vue 3 (Composition API)

**Why**:

- Reactive, component-based UI
- Better TypeScript integration than Vue 2
- Composition API enables better code organization
- Smaller bundle size
- Better performance

#### TypeScript

**Why**:

- Type safety prevents bugs
- Better IDE support (IntelliSense)
- Self-documenting code
- Easier refactoring
- Catch errors at compile-time

#### Tailwind CSS

**Why**:

- Utility-first approach (rapid development)
- Consistent design system
- Smaller CSS bundle (purging unused styles)
- No naming conflicts
- Easy to customize
- Better than maintaining custom CSS

#### Headless UI

**Why**:

- Accessible components out of the box
- Unstyled (full Tailwind control)
- Works perfectly with Vue 3
- Focus on functionality, not appearance
- Reduces custom component code

### State Management

#### Pinia

**Why**:

- Official Vue 3 state management
- Better TypeScript support than Vuex
- Simpler API (no mutations)
- Modular stores
- DevTools integration
- Composition API compatible

### Backend Stack

#### Nitro (Nuxt Server)

**Why**:

- Built into Nuxt 3
- Modern Node.js server
- API routes with file-based routing
- Serverless-ready
- Great performance

#### Socket.IO + nuxt-socket-io

**Why**:

- Proven real-time library
- Reliable WebSocket communication
- Fallback to polling
- Room support
- Namespace support
- nuxt-socket-io provides Nuxt integration

### Testing Stack

#### Vitest

**Why**:

- Vite-native (fast)
- Jest-compatible API
- Great TypeScript support
- Component testing support
- Fast watch mode

#### Playwright

**Why**:

- Multi-browser support
- Reliable (auto-wait)
- Great API
- Screenshot/video capture
- Network interception
- Parallel execution

### Build & Deployment

#### Vite

**Why**:

- Blazing fast HMR
- Optimized builds
- Built into Nuxt 3
- Great plugin ecosystem

#### Docker

**Why**:

- Consistent environments
- Easy deployment
- Scalable
- Supports Socket.IO (persistent connections)

---

## Migration Strategy

### Approach: Clean Slate Rewrite

**Why not incremental migration?**

- No existing component structure to preserve
- Architecture fundamentally different
- CSS needs complete overhaul
- Fresh start allows best practices
- Can reference old code for logic

### Migration Principles

1. **Feature Parity First**: Implement all existing features before adding new ones
2. **Visual Fidelity**: Match existing UI/UX closely
3. **Incremental Development**: Build in testable phases
4. **Reference, Don't Copy**: Use old code as reference, not direct port
5. **Test as You Go**: Write tests alongside features

### What to Reuse (by reference)

✅ **Game Logic**:

- Word generation algorithm → Port to TypeScript
- Scoring calculations → Port to composable
- Combo system → Port to Pinia store
- Timer logic → Port to composable

✅ **Socket.IO Event Contracts**:

- Event names and payloads → Use as TypeScript interfaces
- Room management logic → Port to server utils
- State synchronization approach → Adapt to Pinia

✅ **Data Structures**:

- Room, User, Word, Game models → Convert to TypeScript interfaces
- Factory pattern → Replace with TypeScript type guards

✅ **UI Layout & Design**:

- Color schemes → Tailwind config
- Spacing & sizing → Tailwind utilities
- Animation timings → Tailwind animations
- Component placement → Vue component structure

### What to Replace Completely

❌ **DOM Manipulation**:

- Replace with Vue reactive templates

❌ **Global State**:

- Replace with Pinia stores

❌ **Manual Rendering Functions**:

- Replace with Vue components

❌ **Custom CSS**:

- Replace with Tailwind utilities

❌ **Browserify Bundles**:

- Replace with Vite builds

❌ **HTML Pages**:

- Replace with Nuxt pages/layouts

---

## Project Structure

### New Directory Structure

```
wordus/
├── .github/
│   └── workflows/           # CI/CD pipelines
├── .nuxt/                   # Nuxt build output (gitignored)
├── .output/                 # Production build (gitignored)
├── node_modules/            # Dependencies (gitignored)
│
├── assets/                  # Static assets processed by Vite
│   ├── audio/              # Music and sound effects
│   │   ├── menu-song.mp3
│   │   ├── play-song.mp3
│   │   ├── success.wav
│   │   └── lose.wav
│   └── images/             # Avatar images
│       └── avatars/
│
├── components/              # Vue components (auto-imported)
│   ├── game/               # Game-specific components
│   │   ├── GameBoard.vue
│   │   ├── GameTimer.vue
│   │   ├── GameWord.vue
│   │   ├── GameWords.vue
│   │   ├── GameInput.vue
│   │   ├── GameScoreboard.vue
│   │   ├── GameSettings.vue
│   │   └── GameControls.vue
│   ├── player/             # Player-related components
│   │   ├── PlayerList.vue
│   │   ├── PlayerCard.vue
│   │   ├── PlayerAvatar.vue
│   │   └── PlayerScore.vue
│   ├── room/               # Room management components
│   │   ├── RoomCode.vue
│   │   ├── RoomSettings.vue
│   │   └── RoomInvite.vue
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Slider.vue
│   │   ├── Select.vue
│   │   ├── Notification.vue
│   │   ├── Modal.vue
│   │   └── Toast.vue
│   └── layout/             # Layout components
│       ├── AppHeader.vue
│       └── AppFooter.vue
│
├── composables/             # Composition API reusable logic
│   ├── useSocket.ts        # Socket.IO integration
│   ├── useGame.ts          # Game logic
│   ├── useTimer.ts         # Timer logic
│   ├── useWords.ts         # Word generation
│   ├── useScoring.ts       # Scoring calculations
│   ├── useAudio.ts         # Audio management
│   ├── useRoom.ts          # Room management
│   └── useKeyboard.ts      # Keyboard input handling
│
├── layouts/                 # Nuxt layouts
│   ├── default.vue         # Default layout (header)
│   └── game.vue            # Game layout (full screen)
│
├── pages/                   # Nuxt pages (auto-routed)
│   ├── index.vue           # Home/Create room page
│   ├── join.vue            # Join room page
│   └── game/
│       └── [code].vue      # Game page (dynamic route)
│
├── plugins/                 # Nuxt plugins
│   ├── socket.io.client.ts # Socket.IO client setup
│   └── headlessui.ts       # Headless UI registration
│
├── public/                  # Static files (served as-is)
│   └── favicon.ico
│
├── server/                  # Nuxt server code
│   ├── api/                # API routes
│   │   ├── rooms/
│   │   │   ├── create.post.ts
│   │   │   ├── [code].get.ts
│   │   │   └── [code].delete.ts
│   │   └── health.get.ts
│   ├── socket/             # Socket.IO server logic
│   │   ├── index.ts        # Socket.IO setup
│   │   ├── handlers/       # Event handlers
│   │   │   ├── room.ts
│   │   │   ├── game.ts
│   │   │   ├── player.ts
│   │   │   └── disconnect.ts
│   │   └── middleware/     # Socket middleware
│   │       └── auth.ts
│   ├── utils/              # Server utilities
│   │   ├── room.ts         # Room management
│   │   ├── user.ts         # User management
│   │   ├── game.ts         # Game logic
│   │   ├── words.ts        # Word loading/generation
│   │   └── state.ts        # In-memory state
│   └── data/               # Static data
│       └── words/          # Word databases
│           ├── lat.txt
│           ├── en.txt
│           └── fr.txt
│
├── stores/                  # Pinia stores
│   ├── game.ts             # Game state
│   ├── room.ts             # Room state
│   ├── player.ts           # Player state
│   ├── ui.ts               # UI state (notifications, modals)
│   └── audio.ts            # Audio state
│
├── types/                   # TypeScript type definitions
│   ├── game.ts             # Game-related types
│   ├── room.ts             # Room-related types
│   ├── user.ts             # User-related types
│   ├── word.ts             # Word-related types
│   ├── socket.ts           # Socket.IO event types
│   └── index.ts            # Type exports
│
├── tests/                   # Test files
│   ├── unit/               # Vitest unit tests
│   │   ├── composables/
│   │   ├── components/
│   │   ├── stores/
│   │   └── utils/
│   ├── e2e/                # Playwright E2E tests
│   │   ├── create-room.spec.ts
│   │   ├── join-room.spec.ts
│   │   ├── gameplay.spec.ts
│   │   └── multiplayer.spec.ts
│   └── fixtures/           # Test data
│       ├── words.ts
│       └── rooms.ts
│
├── .dockerignore           # Docker ignore file
├── .env.example            # Environment variables example
├── .gitignore              # Git ignore
├── .prettierrc             # Prettier config
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── nuxt.config.ts          # Nuxt configuration
├── package.json            # Dependencies and scripts
├── playwright.config.ts    # Playwright configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Vitest configuration
└── README.md               # Project documentation
```

### Key Differences from Old Structure

| Old                    | New                            | Change                |
| ---------------------- | ------------------------------ | --------------------- |
| `old/views/*.html`     | `pages/*.vue`                  | Nuxt pages (SSR)      |
| `old/js/classe/`       | `types/`                       | TypeScript interfaces |
| `old/js/client/`       | `composables/` + `components/` | Composition API       |
| `old/js/client/views/` | Vue component templates        | Reactive templates    |
| `old/css/`             | Tailwind utilities             | Utility-first CSS     |
| `old/index.js`         | `server/`                      | Organized server code |
| `old/js/factories/`    | Type guards in `types/`        | TypeScript approach   |

---

## Key Changes

### 1. Component Architecture

#### Old: Manual DOM Manipulation

```javascript
// old/js/client/views/game_views.js
function updateWords(words) {
  const container = document.querySelector(".words-container");
  container.innerHTML = "";
  words.forEach((word) => {
    const div = document.createElement("div");
    div.className = "word";
    div.textContent = word.word;
    div.style.gridArea = `pos-${word.position}`;
    container.appendChild(div);
  });
}
```

#### New: Vue Components

```vue
<!-- components/game/GameWords.vue -->
<template>
  <div class="grid grid-cols-4 gap-4 p-8">
    <GameWord
      v-for="word in words"
      :key="word.id"
      :word="word"
      :typing-players="word.users"
      :class="`col-start-${getPosition(word.position).col} row-start-${
        getPosition(word.position).row
      }`"
    />
  </div>
</template>

<script setup lang="ts">
import type { Word } from "~/types/word";

const props = defineProps<{
  words: Word[];
}>();

const getPosition = (pos: number) => {
  // Convert position 1-20 to grid coordinates
  const row = Math.floor((pos - 1) / 4) + 1;
  const col = ((pos - 1) % 4) + 1;
  return { row, col };
};
</script>
```

### 2. State Management

#### Old: Global Objects

```javascript
// old/index.js
const rooms = {};
const users = {};

// Scattered state updates
rooms[code].users.push(user);
users[uuid] = user;
```

#### New: Pinia Stores

```typescript
// stores/room.ts
import { defineStore } from "pinia";
import type { Room, RoomPreferences } from "~/types/room";

export const useRoomStore = defineStore("room", () => {
  const currentRoom = ref<Room | null>(null);
  const players = computed(() => currentRoom.value?.users || []);

  const joinRoom = async (code: string, userName: string) => {
    const { data, error } = await useFetch(`/api/rooms/${code}`);
    if (data.value) {
      currentRoom.value = data.value;
    }
    return { error };
  };

  return {
    currentRoom,
    players,
    joinRoom,
  };
});
```

### 3. Styling

#### Old: Custom CSS

```css
/* old/css/components/words.css */
.word {
  position: absolute;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.word:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}
```

#### New: Tailwind CSS

```vue
<!-- components/game/GameWord.vue -->
<template>
  <div
    class="
      px-6 py-3
      bg-gradient-to-br from-purple-500 to-purple-700
      rounded-lg
      text-white
      text-lg
      font-semibold
      shadow-md
      transition-transform
      duration-200
      hover:-translate-y-0.5
      hover:shadow-lg
    "
  >
    {{ word.word }}
  </div>
</template>
```

### 4. Type Safety

#### Old: No Types

```javascript
// old/js/classe/User.js
class User {
  constructor(uuid, name, color, avatar) {
    this.uuid = uuid;
    this.name = name;
    this.color = color;
    this.avatar = avatar;
    this.combo = 0;
  }

  getInfos() {
    return {
      uuid: this.uuid,
      name: this.name,
      color: this.color,
      avatar: this.avatar,
      combo: this.combo,
    };
  }
}
```

#### New: TypeScript Interfaces

```typescript
// types/user.ts
export interface User {
  uuid: string;
  name: string;
  color: PlayerColor;
  avatar: string;
  combo: number;
}

export type PlayerColor =
  | "#FFD700" // Yellow
  | "#FF69B4" // Pink
  | "#9370DB" // Purple
  | "#4169E1" // Blue
  | "#32CD32" // Green
  | "#A0522D"; // Brown

export interface UserInfo {
  uuid: string;
  name: string;
  color: PlayerColor;
  avatar: string;
  combo: number;
}

// Utility functions with full type safety
export const getUserInfo = (user: User): UserInfo => ({
  uuid: user.uuid,
  name: user.name,
  color: user.color,
  avatar: user.avatar,
  combo: user.combo,
});
```

### 5. Socket.IO Integration

#### Old: Manual Setup

```javascript
// old/js/client/game.js
const socket = io();

socket.on("game_started", (data) => {
  const room = RoomFactory.create(data.room);
  updateWords(room.game.words);
  updatePlayerList(room);
});

socket.emit("press_enter", {
  uuid: userUuid,
  code: roomCode,
  word: inputValue,
  letters: inputValue.split(""),
});
```

#### New: Typed Composable

```typescript
// composables/useSocket.ts
export const useSocket = () => {
  const socket = useNuxtSocket({
    name: "main",
    reconnection: true,
  });

  const emit = <T extends keyof SocketEmitEvents>(
    event: T,
    data: SocketEmitEvents[T]
  ) => {
    socket.emit(event, data);
  };

  const on = <T extends keyof SocketListenEvents>(
    event: T,
    handler: (data: SocketListenEvents[T]) => void
  ) => {
    socket.on(event, handler);
  };

  return { socket, emit, on };
};

// Usage in component
const { emit, on } = useSocket();

on("game_started", (data) => {
  gameStore.setGameState(data.room.game);
  roomStore.setRoom(data.room);
});

const submitWord = (word: string) => {
  emit("press_enter", {
    uuid: playerStore.uuid,
    code: roomStore.code,
    word,
    letters: word.split(""),
  });
};
```

### 6. Testing

#### Old: No Tests

- Manual browser testing only
- No automated tests
- Bugs discovered in production

#### New: Comprehensive Testing

**Unit Tests (Vitest)**:

```typescript
// tests/unit/composables/useScoring.spec.ts
import { describe, it, expect } from "vitest";
import { useScoring } from "~/composables/useScoring";

describe("useScoring", () => {
  it("calculates base points as word length", () => {
    const { calculatePoints } = useScoring();
    expect(calculatePoints("hello", 0)).toBe(5);
    expect(calculatePoints("hi", 0)).toBe(2);
  });

  it("applies combo multiplier correctly", () => {
    const { calculatePoints } = useScoring();
    expect(calculatePoints("hello", 0)).toBe(5); // 5 × 1
    expect(calculatePoints("hello", 1)).toBe(7.5); // 5 × 1.5
    expect(calculatePoints("hello", 2)).toBe(10); // 5 × 2
    expect(calculatePoints("hello", 3)).toBe(12.5); // 5 × 2.5
    expect(calculatePoints("hello", 4)).toBe(15); // 5 × 3
  });
});
```

**E2E Tests (Playwright)**:

```typescript
// tests/e2e/gameplay.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Gameplay", () => {
  test("should complete word and gain points", async ({ page }) => {
    // Create room
    await page.goto("/");
    await page.fill('[data-testid="name-input"]', "Player 1");
    await page.click('[data-testid="create-room"]');

    // Start game
    await page.click('[data-testid="start-game"]');

    // Get first word
    const firstWord = await page
      .locator('[data-testid="word"]')
      .first()
      .textContent();

    // Type word
    await page.type('[data-testid="game-input"]', firstWord!);
    await page.press('[data-testid="game-input"]', "Enter");

    // Check score increased
    const score = await page
      .locator('[data-testid="player-score"]')
      .textContent();
    expect(parseInt(score!)).toBeGreaterThan(0);
  });
});
```

---

## Implementation Phases

### Phase 1: Project Setup (Week 1, Days 1-2)

**Goal**: Bootstrap Nuxt 3 project with all tooling

**Tasks**:

1. Initialize Nuxt 3 project
2. Configure TypeScript
3. Set up Tailwind CSS + Headless UI
4. Configure Pinia
5. Set up Vitest + Playwright
6. Configure Docker
7. Set up linting (ESLint + Prettier)
8. Initialize Git repository
9. Create project documentation

**Deliverables**:

- ✅ Working Nuxt 3 app (hello world)
- ✅ All dependencies installed
- ✅ All configs in place
- ✅ Development environment ready
- ✅ Docker working

**Acceptance Criteria**:

- `npm run dev` starts dev server
- `npm run test` runs unit tests
- `npm run test:e2e` runs E2E tests
- `npm run build` creates production build
- Docker container runs successfully

---

### Phase 2: Type System & Data Models (Week 1, Days 3-5)

**Goal**: Define all TypeScript types and interfaces

**Tasks**:

1. Create type definitions for all entities:
   - Room types
   - User types
   - Game types
   - Word types
   - Socket event types
   - API types
2. Create type guards and validators
3. Document type usage

**Deliverables**:

- ✅ Complete `types/` directory
- ✅ Socket.IO event types
- ✅ API request/response types
- ✅ Type documentation

**Files Created**:

- `types/room.ts`
- `types/user.ts`
- `types/game.ts`
- `types/word.ts`
- `types/socket.ts`
- `types/api.ts`
- `types/index.ts`

---

### Phase 3: Server Implementation (Week 2)

**Goal**: Implement backend logic with Nitro

**Tasks**:

1. Set up Socket.IO server
2. Implement room management logic
3. Implement user management logic
4. Implement game logic
5. Load word databases
6. Create API routes
7. Write server-side tests

**Deliverables**:

- ✅ Working Socket.IO server
- ✅ All event handlers
- ✅ Room/user state management
- ✅ Game logic (timer, scoring, words)
- ✅ API endpoints
- ✅ Server tests

**Files Created**:

- `server/socket/index.ts`
- `server/socket/handlers/*.ts`
- `server/api/rooms/*.ts`
- `server/utils/*.ts`
- `tests/unit/server/*.spec.ts`

---

### Phase 4: Core Composables (Week 3, Days 1-3)

**Goal**: Create reusable composition functions

**Tasks**:

1. Create `useSocket` composable
2. Create `useGame` composable
3. Create `useTimer` composable
4. Create `useWords` composable
5. Create `useScoring` composable
6. Create `useAudio` composable
7. Write composable tests

**Deliverables**:

- ✅ All composables implemented
- ✅ Full TypeScript support
- ✅ Unit tests for each

**Files Created**:

- `composables/useSocket.ts`
- `composables/useGame.ts`
- `composables/useTimer.ts`
- `composables/useWords.ts`
- `composables/useScoring.ts`
- `composables/useAudio.ts`
- `tests/unit/composables/*.spec.ts`

---

### Phase 5: Pinia Stores (Week 3, Days 4-5)

**Goal**: Implement state management

**Tasks**:

1. Create `game` store
2. Create `room` store
3. Create `player` store
4. Create `ui` store
5. Create `audio` store
6. Write store tests

**Deliverables**:

- ✅ All stores implemented
- ✅ Store actions and getters
- ✅ Store tests

**Files Created**:

- `stores/game.ts`
- `stores/room.ts`
- `stores/player.ts`
- `stores/ui.ts`
- `stores/audio.ts`
- `tests/unit/stores/*.spec.ts`

---

### Phase 6: UI Components (Week 4-5)

**Goal**: Build all Vue components

**Tasks**:

**Week 4: Core Game Components**

1. Create layout components (header, footer)
2. Create UI components (button, input, etc.)
3. Create game components:
   - GameBoard
   - GameTimer
   - GameWord
   - GameWords
   - GameInput
   - GameScoreboard
   - GameSettings
   - GameControls
4. Write component tests

**Week 5: Player & Room Components** 5. Create player components:

- PlayerList
- PlayerCard
- PlayerAvatar
- PlayerScore

6. Create room components:
   - RoomCode
   - RoomSettings
   - RoomInvite
7. Polish and test all components

**Deliverables**:

- ✅ 30+ Vue components
- ✅ Full Tailwind styling
- ✅ Component tests
- ✅ Storybook (optional)

**Files Created**:

- `components/**/*.vue`
- `tests/unit/components/**/*.spec.ts`

---

### Phase 7: Pages & Routing (Week 6, Days 1-3)

**Goal**: Implement all pages and navigation

**Tasks**:

1. Create home page (create room)
2. Create join page
3. Create game page (dynamic route)
4. Create layouts
5. Implement navigation
6. Add page transitions
7. Write E2E tests for each page

**Deliverables**:

- ✅ All pages implemented
- ✅ Routing working
- ✅ Page transitions
- ✅ E2E tests

**Files Created**:

- `pages/index.vue`
- `pages/join.vue`
- `pages/game/[code].vue`
- `layouts/default.vue`
- `layouts/game.vue`
- `tests/e2e/*.spec.ts`

---

### Phase 8: Integration & Polish (Week 6-7)

**Goal**: Connect everything and polish

**Tasks**:

**Week 6, Days 4-5: Integration**

1. Connect Socket.IO to components
2. Wire up all event handlers
3. Integrate stores with components
4. Test full user flows
5. Fix integration bugs

**Week 7: Polish** 6. Add animations 7. Optimize performance 8. Add loading states 9. Error handling 10. Audio integration 11. Mobile warnings 12. Final testing 13. Documentation

**Deliverables**:

- ✅ Fully working application
- ✅ All features functional
- ✅ Polished UI
- ✅ Comprehensive tests passing
- ✅ Documentation complete

---

### Phase 9: Deployment (Week 8)

**Goal**: Deploy to production

**Tasks**:

1. Finalize Docker configuration
2. Set up environment variables
3. Configure production build
4. Test production build locally
5. Deploy to server
6. Set up SSL
7. Configure domain
8. Monitor and fix issues
9. Performance optimization
10. Security audit

**Deliverables**:

- ✅ Production deployment
- ✅ SSL configured
- ✅ Domain working
- ✅ Monitoring in place
- ✅ Documentation updated

---

## Timeline & Resources

### Time Estimate

**Total Duration**: 6-8 weeks (full-time development)

| Phase                    | Duration    | Effort | Dependencies |
| ------------------------ | ----------- | ------ | ------------ |
| 1. Project Setup         | 2 days      | Low    | None         |
| 2. Type System           | 3 days      | Medium | Phase 1      |
| 3. Server Implementation | 5 days      | High   | Phase 2      |
| 4. Core Composables      | 3 days      | Medium | Phase 3      |
| 5. Pinia Stores          | 2 days      | Medium | Phase 4      |
| 6. UI Components         | 10 days     | High   | Phase 5      |
| 7. Pages & Routing       | 3 days      | Medium | Phase 6      |
| 8. Integration & Polish  | 7 days      | High   | Phase 7      |
| 9. Deployment            | 3 days      | Medium | Phase 8      |
| **Total**                | **38 days** |        |              |

**Breakdown**:

- Core development: 6 weeks
- Testing & polish: 1 week
- Deployment & monitoring: 1 week

### Resource Requirements

**Personnel**:

- 1 Full-stack developer (you)
- Optional: 1 QA tester (for comprehensive testing)

**Tools & Services**:

- Development machine
- Code editor (VS Code recommended)
- Git + GitHub
- Docker Desktop
- Server for deployment (VPS or cloud)
- Domain + SSL certificate

**Cost Estimate**:

- Development time: 6-8 weeks
- Server hosting: $10-50/month
- Domain: $12/year
- SSL: Free (Let's Encrypt)
- **Total initial cost**: ~$60-100 (excluding labor)

---

## Risks & Mitigation

### Technical Risks

#### RISK 1: Socket.IO Integration with Nuxt 3

**Probability**: Medium
**Impact**: High (core functionality)

**Description**: Socket.IO + SSR can be tricky with Nuxt 3

**Mitigation**:

- Use proven `nuxt-socket-io` module
- Test early (Phase 3)
- Have fallback plan (separate Socket server)
- Extensive testing

---

#### RISK 2: Type System Complexity

**Probability**: Low
**Impact**: Medium (development speed)

**Description**: TypeScript overhead might slow initial development

**Mitigation**:

- Define types early (Phase 2)
- Use `any` strategically during prototyping
- Refine types iteratively
- Comprehensive type documentation

---

#### RISK 3: Performance Regression

**Probability**: Medium
**Impact**: Medium (user experience)

**Description**: New stack might be slower than vanilla JS

**Mitigation**:

- Benchmark early and often
- Use Lighthouse for performance audits
- Optimize bundle size (Vite code splitting)
- Lazy load components
- Monitor production performance

---

#### RISK 4: Tailwind Learning Curve

**Probability**: Low
**Impact**: Low (can learn quickly)

**Description**: Tailwind approach is different from custom CSS

**Mitigation**:

- Reference Tailwind docs
- Use Tailwind IntelliSense (VS Code)
- Start with simple components
- Refer to old CSS for design specs

---

### Project Risks

#### RISK 5: Timeline Overrun

**Probability**: High
**Impact**: Medium (delayed launch)

**Description**: 8 weeks is aggressive for full rewrite

**Mitigation**:

- Build in 20% buffer (Phase 8 is flex time)
- Focus on MVP features first
- Defer nice-to-have features
- Track progress weekly
- Adjust scope if needed

---

#### RISK 6: Scope Creep

**Probability**: Medium
**Impact**: Medium (timeline/quality)

**Description**: Temptation to add new features during rewrite

**Mitigation**:

- Strict feature parity focus
- Document "Phase 2 features" separately
- No new features until MVP complete
- Regular scope reviews

---

#### RISK 7: Testing Gaps

**Probability**: Medium
**Impact**: High (bugs in production)

**Description**: Comprehensive testing is time-consuming

**Mitigation**:

- Test as you go (not at end)
- Focus on critical paths first
- Automate testing in CI/CD
- Manual testing before deployment
- Gradual rollout to users

---

### Deployment Risks

#### RISK 8: Cloudflare Workers + Socket.IO

**Probability**: High
**Impact**: Critical (blocks Cloudflare deployment)

**Description**: Cloudflare Workers don't natively support persistent WebSocket connections (Socket.IO requirement)

**Mitigation Options**:

**Option A: Docker Deployment (Recommended)**

- Primary deployment via Docker on VPS/cloud
- Full Socket.IO support
- Simpler architecture
- Better for initial launch

**Option B: Cloudflare Durable Objects**

- Use Durable Objects for WebSocket state
- More complex architecture
- Requires rewriting Socket.IO logic
- Consider for scaling phase

**Option C: Hybrid Approach**

- Cloudflare Workers for static/API
- Separate Socket.IO server on traditional host
- Adds complexity
- Best for high traffic scenarios

**Recommendation**: Start with Docker (Option A), evaluate Cloudflare later if needed

---

## Success Criteria

### Functional Requirements

✅ **Feature Parity**:

- [ ] All existing features working
- [ ] Room creation/joining
- [ ] 6-player multiplayer
- [ ] Real-time word typing
- [ ] Scoring system with combos
- [ ] Multi-language support
- [ ] Timer functionality
- [ ] Final scoreboard
- [ ] Audio feedback
- [ ] Disconnect handling

✅ **Visual Fidelity**:

- [ ] UI matches old design closely
- [ ] All animations preserved
- [ ] Color scheme consistent
- [ ] Layout identical
- [ ] Responsive design

### Technical Requirements

✅ **Performance**:

- [ ] Page load < 2s
- [ ] Socket latency < 100ms
- [ ] 60fps animations
- [ ] Lighthouse score > 90

✅ **Quality**:

- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] 80%+ test coverage
- [ ] All E2E tests passing

✅ **Developer Experience**:

- [ ] Hot module replacement working
- [ ] TypeScript IntelliSense working
- [ ] Tests run fast (< 10s)
- [ ] Build time < 30s

### Business Requirements

✅ **Launch Readiness**:

- [ ] Production deployment successful
- [ ] SSL configured
- [ ] Monitoring in place
- [ ] Documentation complete
- [ ] Migration plan for users (if needed)

✅ **Maintainability**:

- [ ] Code is well-organized
- [ ] Components are reusable
- [ ] Types are comprehensive
- [ ] Easy to add new features

---

## Next Steps

### Immediate Actions

1. **Review & Approve Plan**: Ensure all stakeholders agree
2. **Set Up Development Environment**: Install tools, configure machine
3. **Create Project Timeline**: Add specific dates to phases
4. **Backup Old Code**: Ensure old implementation is safely archived
5. **Begin Phase 1**: Initialize Nuxt 3 project

### Before Starting Development

- [ ] Review all documentation (about.md, requirements.md, etc.)
- [ ] Study old codebase thoroughly
- [ ] Set up development machine
- [ ] Create GitHub repository
- [ ] Set up project management (Trello/Jira/GitHub Projects)
- [ ] Block calendar for focused development time

### Support Documents Needed

- [ ] Detailed architecture diagram (see architecture.md)
- [ ] Component hierarchy map (see component-map.md)
- [ ] API specification document (see tech-stack.md)
- [ ] Testing strategy document
- [ ] Deployment guide

---

## Conclusion

This modernization plan provides a comprehensive roadmap to transform Wordus from a vanilla JavaScript application to a modern, type-safe, component-based Nuxt 3 application. The 8-week timeline is ambitious but achievable with focused effort.

**Key Success Factors**:

1. **Disciplined execution**: Follow the phases systematically
2. **Test as you go**: Don't defer testing until the end
3. **Reference, don't copy**: Use old code as guide, not template
4. **Focus on MVP**: Feature parity first, enhancements later
5. **Continuous integration**: Deploy early and often

The result will be a maintainable, scalable, and modern web application that preserves everything users love about Wordus while providing a solid foundation for future enhancements.

---

## Document Change History

| Version | Date       | Changes                    | Author    |
| ------- | ---------- | -------------------------- | --------- |
| 1.0     | 2025-11-24 | Initial modernization plan | Developer |

---
