const SESSION_KEY = 'wordus_session'

export interface SessionData {
  sessionId: string
  username: string
  avatar: string
  color: string
  currentRoomCode: string | null
  timestamp: number  // Date.now() when last saved
}

export function getOrCreateSessionId(): string {
  const session = loadSession()
  if (session?.sessionId) {
    return session.sessionId
  }

  // Generate new UUID v4
  const newSessionId = crypto.randomUUID()
  return newSessionId
}

export function saveSession(data: SessionData): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

export function loadSession(): SessionData | null {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    if (!data) return null

    const session = JSON.parse(data) as SessionData

    // Check if session is expired
    if (isSessionExpired(session)) {
      console.log('[Session] Session expired, clearing')
      clearSession()
      return null
    }

    return session
  } catch (error) {
    console.error('[Session] Error loading session:', error)
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function updateRoomCode(roomCode: string | null): void {
  const session = loadSession()
  if (session) {
    session.currentRoomCode = roomCode
    session.timestamp = Date.now()
    saveSession(session)
  }
}

export function isSessionExpired(session: SessionData): boolean {
  const EXPIRY_MS = 24 * 60 * 60 * 1000  // 24 hours
  return (Date.now() - session.timestamp) > EXPIRY_MS
}
