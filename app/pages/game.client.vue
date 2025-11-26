<template>
  <header class="py-6 px-8 bg-background border-b border-gray-700">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold flex items-center gap-2">
        <img src="/images/logo/logo.png" alt="Logo" class="w-12 h-12">
        <NuxtLink to="/" class="text-white hover:opacity-80 transition">
          WORDUS.xyz
        </NuxtLink>
      </h1>

      <nav class="flex items-center gap-6">
        <div v-if="room" class="flex gap-6 text-white">
          <p><span class="font-bold">Nombre de joueurs :</span> {{ room.users.length }}</p>
          <p><span class="font-bold">Temps restant :</span> {{ formatTime(room.timer) }}</p>
        </div>
      </nav>
    </div>
  </header>

  <main class="flex-1 h-full flex flex-col space-y-8 relative">
    <div v-if="!room" class="max-w-7xl mx-auto py-8">
      <div class="text-center text-white">
        <p class="text-2xl">{{ isReconnecting ? 'Reconnexion en cours...' : 'Chargement de la partie...' }}</p>
      </div>
    </div>

    <template v-else>
      <!-- Fixed Left Sidebar: Players -->
      <div v-if="room.state !== 'ENDED'" class="absolute left-0 w-auto h-full overflow-y-auto px-4 py-8 z-40">
        <!-- <h3 class="text-xl font-bold text-white mb-4">JOUEURS</h3> -->
        <div class="h-full flex flex-col justify-center">
          <PlayerCard v-for="player in sortedPlayers" :key="player.id" :player="player" size="small"
            :is-current-user="player.id === gameStore.user?.id" />
        </div>
      </div>

      <GameWaitingState v-if="room.state === 'WAITING'" :room="room" :user="gameStore.user" :is-owner="isOwner"
        @start-game="startGame" @copy-link="handleCopyLink" />

      <GamePlayingState v-else-if="room.state === 'PLAYING'" :room="room" :user="gameStore.user" />

      <GameEndedState v-else-if="room.state === 'ENDED'" :room="room" :is-owner="isOwner"
        @restart-game="handleRestartGame" />
    </template>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'game'
})

const toast = useToast()
const gameStore = useGameStore()

// Access room from store reactively
const room = computed(() => gameStore.room)
const isReconnecting = ref(false)

// Sorted players by score
const sortedPlayers = computed(() => {
  if (!gameStore.room) return []
  return [...gameStore.room.users].sort((a, b) => b.score - a.score)
})

// Computed
const isOwner = computed(() => {
  if (!room.value) return false
  const currentUser = room.value.users.find(u => u.id === gameStore.user?.id)
  return currentUser?.isOwner || false
})

// Methods
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Event handlers for child components
const handleCopyLink = () => {
  toast.success({
    title: 'Lien copié'
  })
}

const startGame = () => {
  console.log('Starting game...')
  toast.info({
    title: 'Lancement de la partie'
  })
  gameStore.startGame()
}

const handleRestartGame = (settings: any) => {
  console.log('Restarting game...')
  toast.info({
    title: 'Relance de la partie'
  })
  gameStore.restartGame(settings)
}


// Watch for room data to arrive
watch(() => room.value, (newRoom) => {
  if (newRoom && isReconnecting.value) {
    isReconnecting.value = false
    console.log('[Game Page] Reconnection successful')
  }
})

onMounted(() => {
  console.log('[Game Page] Mounted')
  console.log('[Game Page] Room:', gameStore.room)
  console.log('[Game Page] User:', gameStore.user)

  // If no room data, we might be reconnecting
  if (!gameStore.room) {
    isReconnecting.value = true
    console.log('[Game Page] No room data, waiting for reconnection...')
  }

  // All socket events are now handled in the game store
  // Room state updates automatically via reactive computed property
})
</script>
