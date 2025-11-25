import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  // Initialize socket connection
  const socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling'],
    autoConnect: true
  })

  console.log('[Socket Plugin] Socket initialized')

  // Provide socket instance to the app
  // All event handling is done in the game store
  return {
    provide: {
      socket
    }
  }
})
