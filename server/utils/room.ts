import { v4 as uuidv4 } from 'uuid'
import type { Room, RoomSettings, User } from '~/types'
import { state } from './state'

export const createRoom = (owner: User, settings: RoomSettings): Room => {
  const roomId = uuidv4().substring(0, 6).toUpperCase()

  const room: Room = {
    id: roomId,
    users: [owner],
    state: 'WAITING',
    settings: {
      ...settings,
      maxPlayers: 6 // Hardcode here for security
    },
    words: [],
    timer: settings.duration
  }

  state.rooms[roomId] = room
  owner.room = roomId
  owner.isOwner = true

  return room
}

export const joinRoom = (user: User, roomId: string): Room | null => {
  const room = state.rooms[roomId]
  if (!room) return null

  if (room.users.length >= room.settings.maxPlayers) return null
  if (room.state !== 'WAITING') return null // Or handle joining mid-game?

  room.users.push(user)
  user.room = roomId
  user.isOwner = false

  return room
}

export const leaveRoom = (userId: string): Room | null => {
  const user = state.users[userId]
  if (!user || !user.room) return null

  const room = state.rooms[user.room]
  if (!room) return null

  room.users = room.users.filter(u => u.id !== userId)
  user.room = ''
  user.isOwner = false

  if (room.users.length === 0) {
    delete state.rooms[room.id]
    return null
  }

  // Assign new owner if owner left
  if (!room.users.some(u => u.isOwner)) {
    room.users[0].isOwner = true
  }

  return room
}

export const rejoinRoom = (
  sessionId: string,
  roomId: string,
  newSocketId: string
): { success: boolean; room?: Room; user?: User; error?: string } => {
  const room = state.rooms[roomId]

  // Room doesn't exist
  if (!room) {
    return { success: false, error: 'Room not found' }
  }

  // Find user by sessionId in this room
  const existingUser = room.users.find(u => u.sessionId === sessionId)

  if (!existingUser) {
    return { success: false, error: 'User not found in room' }
  }

  // Update socket ID in global state
  const oldSocketId = existingUser.id
  delete state.users[oldSocketId]
  existingUser.id = newSocketId
  state.users[newSocketId] = existingUser

  // Update reference in room.users array
  const userIndex = room.users.findIndex(u => u.sessionId === sessionId)
  if (userIndex !== -1) {
    room.users[userIndex] = existingUser
  }

  return { success: true, room, user: existingUser }
}
