import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import type { Room, User, RoomSettings, Word } from '~/types'
import { loadSession, saveSession, clearSession, updateRoomCode, getOrCreateSessionId } from '~/utils/session'

export const useGameStore = defineStore('game', () => {
  // State
  const room = ref<Room | null>(null)
  const user = ref<User | null>(null)
  const isConnected = ref(false)
  const error = ref<string | null>(null)

  // Socket reference
  let socket: Socket | null = null
  let router: any = null
  let toast: any = null

  // ======================
  // Socket Lifecycle
  // ======================

  /**
   * Initialize socket and set up all event listeners
   * Call this once from app.vue onMounted
   */
  const initSocket = () => {
    console.log('[GameStore] Initializing socket...')

    // Get dependencies
    const { $socket } = useNuxtApp()
    socket = $socket
    router = useRouter()
    toast = useToast()

    // Set up all socket event listeners FIRST
    setupSocketListeners()

    // Check if socket is already connected (since autoConnect: true)
    if (socket.connected) {
      console.log('[GameStore] Socket already connected')
      isConnected.value = true

      // Attempt to restore session (listeners are now ready)
      attemptSessionRestore()
    }

    console.log('[GameStore] Socket initialized and listeners attached')
  }

  /**
   * Attempt to restore session from localStorage
   */
  const attemptSessionRestore = () => {
    if (!socket) {
      console.error('[GameStore] Cannot restore session: socket is null')
      return
    }

    const session = loadSession()
    if (!session || !session.currentRoomCode) {
      console.log('[GameStore] No session to restore')
      return
    }

    console.log('[GameStore] Attempting to restore session:', {
      sessionId: session.sessionId,
      roomCode: session.currentRoomCode,
      username: session.username
    })

    // Emit rejoin event
    socket.emit('rejoin_room', {
      sessionId: session.sessionId,
      roomCode: session.currentRoomCode
    })

    console.log('[GameStore] Rejoin room event emitted')
  }

  /**
   * Set up all socket event listeners
   */
  const setupSocketListeners = () => {
    if (!socket) {
      console.error('[GameStore] Cannot setup listeners: socket is null')
      return
    }

    // Connection events
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('error', handleError)

    // Room events
    socket.on('refresh_room', handleRefreshRoom)
    socket.on('game_started', handleGameStarted)
    socket.on('update_time', handleUpdateTime)
    socket.on('word_finish', handleWordFinish)
    socket.on('update_letter', handleUpdateLetter)
    socket.on('game_finish', handleGameFinish)

    // Success events
    socket.on('success_create_user', handleSuccessCreateUser)
    socket.on('success_host_room', handleSuccessHostRoom)
    socket.on('success_join', handleSuccessJoin)
    socket.on('success_rejoin', handleSuccessRejoin)

    console.log('[GameStore] All socket listeners attached')
  }

  /**
   * Clean up all socket event listeners
   * Call this from app.vue onUnmounted
   */
  const cleanupSocket = () => {
    if (!socket) return

    console.log('[GameStore] Cleaning up socket listeners...')

    // Remove all listeners
    socket.off('connect', handleConnect)
    socket.off('disconnect', handleDisconnect)
    socket.off('error', handleError)
    socket.off('refresh_room', handleRefreshRoom)
    socket.off('game_started', handleGameStarted)
    socket.off('update_time', handleUpdateTime)
    socket.off('word_finish', handleWordFinish)
    socket.off('update_letter', handleUpdateLetter)
    socket.off('game_finish', handleGameFinish)
    socket.off('success_create_user', handleSuccessCreateUser)
    socket.off('success_host_room', handleSuccessHostRoom)
    socket.off('success_join', handleSuccessJoin)
    socket.off('success_rejoin', handleSuccessRejoin)

    console.log('[GameStore] Socket listeners cleaned up')
  }

  // ======================
  // Event Handlers
  // ======================

  const handleConnect = () => {
    console.log('[Socket] Connected')
    isConnected.value = true

    // Attempt to restore session when socket connects
    attemptSessionRestore()

    toast?.info({
      title: 'Connected',
      message: 'You have been connected to the server'
    })
  }

  const handleDisconnect = () => {
    console.log('[Socket] Disconnected')
    isConnected.value = false
    // Don't clear session - we want to rejoin on reconnect
    toast?.info({
      title: 'Disconnected',
      message: 'You have been disconnected from the server'
    })
  }

  const handleError = (errorMessage: string) => {
    console.error('[Socket] Error:', errorMessage)
    error.value = errorMessage

    // If room not found during rejoin, clear session
    if (errorMessage.includes('Room not found') || errorMessage.includes('not found in room')) {
      console.log('[Socket] Room no longer exists, clearing session')
      clearSession()
      router?.push('/')
    }

    toast?.error({
      title: 'Error',
      message: errorMessage
    })
  }

  const handleRefreshRoom = (roomData: Room) => {
    console.log('[Socket] Refreshing room', roomData)
    room.value = roomData
  }

  const handleGameStarted = (data: { room: Room }) => {
    console.log('[Socket] Game started', data)
    room.value = data.room
  }

  const handleUpdateTime = (time: number) => {
    if (room.value) {
      room.value.timer = time
    }
  }

  const handleWordFinish = (data: { word_id: string, user_id: string }) => {
    console.log('[Socket] Word finished', data)
    // Additional logic can be added here if needed
  }

  const handleUpdateLetter = (data: { word_id: string, typed: string, user_id: string }) => {
    if (!room.value) return

    const word = room.value.words.find((w: Word) => w.id === data.word_id)
    if (word) {
      word.typed = data.typed
      word.owner = data.user_id
    }
  }

  const handleGameFinish = (data: { room: Room }) => {
    console.log('[Socket] Game finished', data)
    room.value = data.room
  }

  const handleSuccessCreateUser = (data: { user: User }) => {
    console.log('[Socket] User created', data)
    user.value = data.user

    // Save session to localStorage
    saveSession({
      sessionId: data.user.sessionId,
      username: data.user.username,
      avatar: data.user.avatar,
      color: data.user.color,
      currentRoomCode: null,
      timestamp: Date.now()
    })

    toast?.success({
      title: 'User created',
      message: 'You have been created'
    })
  }

  const handleSuccessHostRoom = (data: { room_id: string }) => {
    console.log('[Socket] Room created', data)

    // Update room code in localStorage
    updateRoomCode(data.room_id)

    toast?.success({
      title: 'Room created',
      message: `You have created room ${data.room_id}`
    })
    router?.push(`/game`)
  }

  const handleSuccessJoin = (data: { room: Room }) => {
    console.log('[Socket] Joined room', data)
    room.value = data.room

    // Update room code in localStorage
    updateRoomCode(data.room.id)

    toast?.success({
      title: 'Joined room',
      message: `You have joined room ${data.room.id}`
    })
    router?.push(`/game`)
  }

  const handleSuccessRejoin = (data: { room: Room; user: User }) => {
    console.log('[Socket] Successfully rejoined room', data)
    room.value = data.room
    user.value = data.user

    toast?.success({
      title: 'Reconnected',
      message: 'You have been reconnected to the room'
    })

    // Navigate to game page if not already there
    const currentPath = router?.currentRoute.value.path
    if (!currentPath?.includes(`/game`)) {
      router?.push(`/game`)
    }
  }

  // ======================
  // Actions (Emit Events)
  // ======================

  const createUser = (username: string, avatar?: string, color?: string) => {
    if (!socket) {
      console.error('[GameStore] Cannot create user: socket is null')
      return
    }

    // Get or create session ID
    const sessionId = getOrCreateSessionId()

    console.log('[GameStore] Creating user:', { username, avatar, color, sessionId })
    socket.emit('create_user', { username, avatar, color, sessionId })
  }

  const joinRoom = (code: string, username: string) => {
    if (!socket) {
      console.error('[GameStore] Cannot join room: socket is null')
      return
    }

    console.log('[GameStore] Joining room:', { code, username })
    socket.emit('join', { code, username })
  }

  const createRoom = (settings: RoomSettings, username: string) => {
    if (!socket) {
      console.error('[GameStore] Cannot create room: socket is null')
      return
    }

    console.log('[GameStore] Creating room:', { settings, username })
    socket.emit('host_room', { settings, username })
  }

  const startGame = () => {
    if (!socket) {
      console.error('[GameStore] Cannot start game: socket is null')
      return
    }

    console.log('[GameStore] Starting game')
    socket.emit('start_game')
  }

  const restartGame = (settings: RoomSettings) => {
    if (!socket) {
      console.error('[GameStore] Cannot restart game: socket is null')
      return
    }

    console.log('[GameStore] Restarting game with settings:', settings)
    socket.emit('start_game', { settings })
  }

  const sendInput = (input: string) => {
    if (!socket) {
      console.error('[GameStore] Cannot send input: socket is null')
      return
    }

    socket.emit('input', { input })
  }

  // ======================
  // Return Store API
  // ======================

  return {
    // State
    room,
    user,
    isConnected,
    error,

    // Lifecycle
    initSocket,
    cleanupSocket,

    // Actions
    createUser,
    joinRoom,
    createRoom,
    startGame,
    restartGame,
    sendInput
  }
})
