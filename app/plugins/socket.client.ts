import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  console.log('[Socket Plugin] Runtime Config Public Base URL:', config.public.baseURL)

  // Initialize socket connection
  const socket = io(config.public.baseURL, {
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
