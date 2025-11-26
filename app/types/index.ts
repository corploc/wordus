export interface User {
  id: string;
  sessionId: string;
  username: string;
  avatar: string;
  color: string;
  score: number;
  combo: number;
  room: string;
  isOwner: boolean;
}

export interface Room {
  id: string;
  users: User[];
  state: 'WAITING' | 'PLAYING' | 'ENDED';
  settings: RoomSettings;
  words: Word[];
  timer: number;
}

export interface RoomSettings {
  maxPlayers: number;
  language: 'en' | 'fr' | 'lat';
  duration: number; // in seconds
  wordCount: number; // simultaneous words
}

export interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
  typed: string;
  owner: string | null; // User ID who is currently typing it
  typingUsers: {        // All users typing this word
    userId: string;
    typed: string;
  }[];
}

export interface GameState {
  rooms: Record<string, Room>;
  users: Record<string, User>;
}

export interface FloatingPoint {
  id: string;
  position: number;  // Grid position (1-20)
  points: number;
  correct: boolean;
}
