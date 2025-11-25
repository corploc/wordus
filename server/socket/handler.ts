import type { Server, Socket } from 'socket.io'
import { createUser, removeUser } from '../utils/user'
import { createRoom, joinRoom, leaveRoom, rejoinRoom } from '../utils/room'
import { startGame, handleInput } from '../utils/game'
import { getUser, getRoom } from '../utils/state'

// Track timer intervals per room to prevent multiple intervals
const roomTimers = new Map<string, NodeJS.Timeout>()

export const registerSocketHandlers = (io: Server) => {
  console.log('Socket.IO server initialized with WebSocket support')

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id)

    socket.on('create_user', (data: { username: string, avatar?: string, color?: string, sessionId?: string }) => {
      console.log('Create user:', data)

      const user = createUser(data.username, socket.id, data.avatar, data.color, data.sessionId)

      socket.emit('success_create_user', { user })
    })

    socket.on('host_room', (data: { username: string, settings: any }) => {

      console.log('Host room:', data)

      const user = getUser(socket.id)
      if (!user) {
        socket.emit('error', { message: 'User not found' })
        return
      }

      const room = createRoom(user, data.settings)

      socket.join(room.id)
      socket.emit('success_host_room', { room_id: room.id })

      io.to(room.id).emit('refresh_room', room)
    })

    socket.on('join', (data: { username: string, code: string }) => {
      console.log('Join room:', data)

      const user = getUser(socket.id)
      if (!user) {
        socket.emit('error', { message: 'User not found' })
        return
      }

      const room = joinRoom(user, data.code)

      if (room) {
        socket.join(room.id)
        socket.emit('success_join', { room })
        io.to(room.id).emit('refresh_room', room)
      } else {
        socket.emit('error', { message: 'Room not found or full' })
      }
    })

    socket.on('start_game', (data?: { settings?: any }) => {
      console.log('Start game:', data)

      const user = getUser(socket.id)
      if (!user || !user.isOwner) return

      const room = getRoom(user.room)
      if (!room) return

      // Update room settings if provided (for restart)
      if (data?.settings) {
        room.settings = {
          ...room.settings,
          duration: data.settings.duration,
          wordCount: data.settings.wordCount,
          language: data.settings.language
        }
      }

      // Clear old timer interval if exists
      if (roomTimers.has(room.id)) {
        clearInterval(roomTimers.get(room.id)!)
        roomTimers.delete(room.id)
      }

      startGame(room)
      io.to(room.id).emit('game_started', { room })

      // Start timer loop
      const timerInterval = setInterval(() => {
        if (room.state !== 'PLAYING') {
          clearInterval(timerInterval)
          roomTimers.delete(room.id)
          return
        }

        room.timer--
        io.to(room.id).emit('update_time', room.timer)

        if (room.timer <= 0) {
          room.state = 'ENDED'
          io.to(room.id).emit('game_finish', { room })
          clearInterval(timerInterval)
          roomTimers.delete(room.id)
        }
      }, 1000)

      // Store the timer interval
      roomTimers.set(room.id, timerInterval)
    })

    socket.on('input', (data: { input: string }) => {
      console.log('Input:', data)

      const user = getUser(socket.id)
      if (!user || !user.room) return

      const room = getRoom(user.room)
      if (!room || room.state !== 'PLAYING') return

      const result = handleInput(room, user, data.input)

      if (result.type === 'word_finish') {
        io.to(room.id).emit('word_finish', {
          word: result.word,
          user_id: user.id,
          score: user.score,
          combo: user.combo
        })
        io.to(room.id).emit('refresh_room', room) // Sync full state
      } else if (result.type === 'update_letter') {
        io.to(room.id).emit('update_letter', {
          word_id: result.word?.id,
          user_id: user.id,
          typed: result.word?.typed
        })
      }
    })

    socket.on('rejoin_room', (data: { sessionId: string, roomCode: string }) => {
      console.log('Rejoin room:', data)

      const result = rejoinRoom(data.sessionId, data.roomCode, socket.id)

      if (result.success && result.room && result.user) {
        // Join socket.io room
        socket.join(result.room.id)

        // Send success response
        socket.emit('success_rejoin', {
          room: result.room,
          user: result.user
        })

        // Notify other users in room
        io.to(result.room.id).emit('refresh_room', result.room)
      } else {
        socket.emit('error', result.error || 'Failed to rejoin room')
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)

      const user = getUser(socket.id)
      if (!user) return

      // Add grace period before removing user (allows for page refresh)
      setTimeout(() => {
        const stillDisconnected = !getUser(socket.id)
        if (stillDisconnected && user) {
          console.log('User did not reconnect, removing:', socket.id)
          const room = leaveRoom(socket.id)
          removeUser(socket.id)

          if (room) {
            io.to(room.id).emit('refresh_room', room)
          }
        }
      }, 10000) // 10 second grace period
    })
  })
}
