# Wordus - Multiplayer Typing Game

## Game Overview

**Wordus** is a real-time multiplayer competitive typing game where players race to type words faster than their opponents.

### Core Concept

Players compete in fast-paced typing races where multiple words appear on screen simultaneously. The goal is to type complete words correctly before other players do, earning points based on word length and combo multipliers.

### How It Works

- Multiple words (1-8) appear simultaneously on screen at random positions
- Players race to type any visible word correctly and press ENTER
- First player to complete a word wins points based on word length
- Wrong words result in point penalties
- Games run on a timer (30 seconds to 3 minutes)
- **Combo system**: Consecutive correct words increase your score multiplier (up to 3x!)

---

## Multiplayer Features

### Room System
- **Up to 6 players** per room
- **Room codes**: 4-character alphanumeric codes for easy joining
- **Shareable links**: Copy/paste invitation system
- **Host controls**: Room creator manages game settings and start/restart

### Real-time Interaction
- **Live typing indicators**: Colored circles show which opponents are typing each word
- **Dynamic scoreboard**: Scores update instantly as players complete words
- **Player customization**: Random avatars (18 options) and automatic color assignment
- **Disconnect handling**: Graceful handling of player exits and room owner disconnection

### Language Options
Choose between three word banks:
- **Latin**: ~2,600 words
- **English**: ~67,600 words
- **French**: ~318,800 words

---

## Game Mechanics

### Scoring System

**Base Points:**
- Points = word length
- Wrong words: **lose** points (word length ÷ 2)

**Combo Multiplier:**
Consecutive correct words increase your multiplier:
- 0 combos: 1x multiplier
- 1 combo: 1.5x multiplier
- 2 combos: 2x multiplier
- 3 combos: 2.5x multiplier
- 4+ combos: 3x multiplier

**Strategy:** Combos reset on mistakes, so accuracy matters as much as speed!

### Smart Word Generation

- Words positioned at 20 different screen locations to avoid overlap
- No duplicate first letters among visible words
- Instant word replacement when completed
- Words randomly selected from language-specific databases

### Input Controls

- **a-z keys**: Type characters
- **Backspace**: Delete last character
- **Ctrl + Backspace/Delete**: Clear all input
- **Ctrl + A**: Select all input
- **Enter**: Submit word

### Audio System

- Background music (menu in lobby, gameplay music during game)
- Success sound when word typed correctly
- Failure sound when word is wrong
- Volume toggle button

---

## Technical Architecture

### Technology Stack

**Backend:**
- Node.js
- Express.js (web server)
- Socket.IO (real-time WebSocket communication)
- HTTPS on port 443 with SSL certificates

**Frontend:**
- Vanilla JavaScript
- Browserify (module bundling)
- Custom CSS (component-based organization)

**Session Management:**
- Cookie-based sessions (UUID and room code)

### Architecture Pattern

Client-Server with Real-time Event-Driven Communication

### Key Classes

**Server-Side:**
- `Game.js` - Core game logic, timer, state management (WAITING, PLAYING, ENDED)
- `Room.js` - Room management, player lists, preferences
- `User.js` - Player data, combos, colors, avatars
- `Word.js` - Individual words with positions and typing status
- `GameStats.js` - Score tracking and multiplier calculations
- `Notification.js` - UI toast notifications and dialogs

**Factory Classes:**
- `RoomFactory`, `GameFactory`, `UserFactory`, `GameStatsFactory`
- Used to deserialize objects from Socket.IO events

### Application Structure

**Three Main Pages:**

1. **Home/Create** ([index.html](old/views/index.html))
   - Room creation with custom settings
   - Avatar randomization
   - Player name input

2. **Join** ([join.html](old/views/join.html))
   - Join existing room via code
   - Validates room existence
   - Auto-assigns player color

3. **Game** ([game.html](old/views/game.html))
   - Main gameplay interface
   - Real-time keyboard input handling
   - Live player list and scores
   - Word display with typing indicators
   - Final scoreboard

### File Organization

```
old/
├── index.js                 # Main server file with Socket.IO event handlers
├── package.json             # Dependencies
├── views/                   # HTML pages
│   ├── index.html          # Create room page
│   ├── join.html           # Join room page
│   └── game.html           # Game page
├── js/
│   ├── classe/             # Game entity classes
│   │   ├── Game.js
│   │   ├── Room.js
│   │   ├── User.js
│   │   ├── Word.js
│   │   ├── GameStats.js
│   │   └── Notification.js
│   ├── client/             # Client-side logic
│   │   ├── index.js        # Create room client
│   │   ├── join.js         # Join room client
│   │   ├── game.js         # Game client
│   │   ├── index_bundle.js # Browserify bundle
│   │   ├── join_bundle.js  # Browserify bundle
│   │   ├── game_bundle.js  # Browserify bundle
│   │   └── views/          # View rendering functions
│   ├── factories/          # Object factories
│   ├── words/              # Word bank text files
│   │   ├── lat.txt         # Latin words
│   │   ├── en.txt          # English words
│   │   └── fr.txt          # French words
│   └── functions.js        # Utility functions
├── css/                    # Stylesheets
│   ├── master.css          # Main stylesheet
│   ├── components/         # Reusable UI components
│   ├── layout/             # Page layouts
│   ├── pages/              # Page-specific styles
│   └── abstracts/          # Variables & animations
└── music/                  # Audio files
    ├── menu-song.mp3       # Lobby music
    ├── play-Song.mp3       # Gameplay music
    ├── succes.wav          # Success sound effect
    └── lose.wav            # Failure sound effect
```

---

## Real-time Synchronization

### Socket.IO Event System

**Server → Client Events:**
- `success_host_room` - Room created successfully
- `room_exist` - Room validation response
- `created_user` - User created in room
- `new_join` - Player joined room
- `game_started` - Game has begun
- `update_letter` - Player typed a character
- `word_finish` - Word completed/validated
- `update_time` - Timer tick (every second)
- `game_finish` - Time expired, show results
- `game_restarted` - New game initiated
- `user_left` - Player disconnected
- `owner_left` - Room owner disconnected (40s countdown)
- `disconnect` - Server disconnection

**Client → Server Events:**
- `host_room` - Create new room with preferences
- `exist_room` - Check if room code exists
- `create_user` - Create player in room
- `join` - Join game page
- `start_game` - Begin countdown
- `input` - Character typed (sends current input)
- `press_enter` - Word submission attempt
- `restart_game` - Start new round

### Data Flow Example (Word Completion)

1. Player types word and presses Enter
2. Client sends `press_enter` event with word, letters, UUID
3. Server validates word against current game words
4. Server calculates points with combo multiplier
5. Server updates user combos and game stats
6. Server removes completed word, generates new one
7. Server broadcasts `word_finish` event to all clients
8. All clients update UI (word display, scores, animations)

---

## UI Components

### Visual Elements

- **Player Boxes**: Animated panels showing avatars, names, and current scores
- **Word Display**: Floating words at various positions with typing progress indicators
- **Game Info Panel**: Timer countdown and current game settings
- **Scoreboard**: Final rankings with animated horizontal bars
- **Toast Notifications**: Game events and errors
- **Settings Display**: Current preferences (duration, word count, language)

### Player Colors

Automatically assigned colors for visual distinction:
- Yellow (#FFD700)
- Pink (#FF69B4)
- Purple (#9370DB)
- Blue (#4169E1)
- Green (#32CD32)
- Brown (#A0522D)

### Avatar System

18 different avatar images randomly assigned to players

---

## Host Controls & Customization

### Adjustable Settings

**Game Duration:**
- Range: 30 seconds to 180 seconds
- Increment: 10 seconds
- Adjustable via slider

**Word Count:**
- Range: 1 to 8 simultaneous words
- More words = more chaotic gameplay
- Adjustable via slider

**Language:**
- Latin, English, or French
- Selectable via dropdown

**Permissions:**
- Only room owner (host) can modify settings
- Settings can be changed between games
- Host controls game start/restart

---

## Game States & Flow

### State Management

**Room States:**
1. **Lobby** - Players joining, host configuring
2. **Playing** - Active gameplay
3. **Results** - Final scoreboard displayed

**Game Class States:**
- `WAITING` - Lobby phase
- `PLAYING` - Active game
- `ENDED` - Game finished

### Typical Game Flow

1. **Create Room**
   - Host enters name, selects settings
   - Room code generated (4 characters)
   - Shareable link created

2. **Lobby Phase**
   - Players join via code/link
   - All players see current settings
   - Player list updates in real-time
   - Background music plays

3. **Game Start**
   - Host clicks start button
   - Words appear on screen
   - Timer begins countdown
   - Gameplay music starts

4. **Active Gameplay**
   - Players type words simultaneously
   - Real-time updates for all actions
   - Scores update instantly
   - Words continuously replaced

5. **Game End**
   - Timer reaches zero
   - Final scoreboard displayed
   - Animated ranking bars
   - Option to restart

6. **Restart**
   - Host can start new round
   - Scores reset
   - Same players continue
   - Settings can be adjusted

---

## Key Features Summary

### What Makes Wordus Special

1. **Fast-paced Competitive Gameplay**
   - No waiting, constant action
   - Multiple targets available simultaneously
   - Instant feedback

2. **Risk/Reward Combo System**
   - Rewards accuracy and speed
   - Strategic decision-making (play safe vs. go fast)
   - High skill ceiling

3. **Social Multiplayer**
   - Easy room sharing
   - Supports small groups (2-6 players)
   - Real-time opponent awareness

4. **Massive Word Variety**
   - 388,000+ total words across languages
   - Especially rich French database
   - Adjustable difficulty via language choice

5. **Clean Architecture**
   - Well-organized, maintainable code
   - Clear separation of concerns
   - Reusable components

6. **Polish & Feedback**
   - Smooth animations
   - Audio feedback
   - Real-time typing indicators
   - Professional UI design

---

## Technical Highlights

### Performance Considerations

- Real-time synchronization across all clients
- Efficient Socket.IO event handling
- Minimal server-side validation overhead
- Instant UI updates without lag

### Security Features

- HTTPS/SSL encryption
- Cookie-based session management
- Room code validation
- Input sanitization (only a-z characters)

### Error Handling

- Disconnect recovery
- Room owner succession planning (40s countdown)
- Mobile device warnings
- Room existence validation
- Graceful degradation

---

## Development Notes

### Dependencies

**Server:**
- express
- socket.io
- cookie-parser
- cors
- body-parser

**Build Tools:**
- Browserify (for client-side bundling)
- Nodemon (for development)

### Browser Compatibility

- Modern browser required (ES6+ support)
- Desktop optimized (keyboard required)
- Mobile detected and warned

### Deployment

- HTTPS required (wordus.xyz domain)
- Port 443
- SSL certificates configured
- Static file serving via Express

---

## Conclusion

Wordus is a polished, engaging multiplayer typing game with solid technical implementation. The real-time synchronization works smoothly, the combo system adds strategic depth, and the codebase is cleanly structured with proper separation of concerns. The game successfully combines competitive gameplay with social interaction, making it an excellent party game or skill-building tool for typing practice.
