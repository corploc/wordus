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
