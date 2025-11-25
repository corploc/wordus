import { v4 as uuidv4 } from 'uuid'
import type { User } from '~/types'
import { state } from './state'

const AVATARS = [
  'avatar_1.png', 'avatar_2.png', 'avatar_3.png', 'avatar_4.png',
  'avatar_5.png', 'avatar_6.png', 'avatar_7.png', 'avatar_8.png',
  'avatar_9.png', 'avatar_10.png', 'avatar_11.png', 'avatar_12.png',
  'avatar_13.png', 'avatar_14.png', 'avatar_15.png', 'avatar_16.png',
  'avatar_17.png', 'avatar_18.png'
]

const COLORS = [
  '#FFD700', // Yellow
  '#FF69B4', // Pink
  '#9370DB', // Purple
  '#4169E1', // Blue
  '#32CD32', // Green
  '#A0522D'  // Brown
]

export const createUser = (username: string, socketId: string, avatar?: string, color?: string): User => {
  const user: User = {
    id: socketId,
    username: username,
    avatar: avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
    color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
    score: 0,
    combo: 0,
    room: '',
    isOwner: false
  }
  state.users[socketId] = user
  return user
}

export const removeUser = (socketId: string) => {
  delete state.users[socketId]
}
