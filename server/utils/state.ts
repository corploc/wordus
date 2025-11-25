import type { GameState } from '~/types'

// Global in-memory state
// In a production environment with multiple instances, this should be Redis
export const state: GameState = {
  rooms: {},
  users: {}
}

export const getRoom = (id: string) => state.rooms[id]
export const getUser = (id: string) => state.users[id]
