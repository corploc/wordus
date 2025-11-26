<template>
  <header class="py-6 px-8 bg-background border-b border-border transition-colors">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold flex items-center gap-2">
        <img :src="logoSrc" alt="Logo" class="w-12 h-12">
        <NuxtLink to="/" class="text-text-primary hover:opacity-80 transition">
          Wordus.xyz
        </NuxtLink>
      </h1>

      <div class="flex items-center gap-6">
        <div v-if="room" class="flex gap-6 text-text-primary">
          <p><span class="font-bold">Nombre de joueurs :</span> {{ room.users.length }}</p>
          <p><span class="font-bold">Temps restant :</span> {{ formatTime(room.timer) }}</p>
        </div>
      </div>

      <nav class="flex items-center gap-6">
        <ClientOnly>
          <ThemeToggle />
        </ClientOnly>
        <a
          href="https://github.com/corploc/wordus"
          target="_blank"
          rel="noopener noreferrer"
          class="text-text-secondary hover:text-text-primary transition"
          title="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </nav>
    </div>
  </header>

  <main class="flex-1 h-full flex flex-col space-y-8 relative">
    <div v-if="!room" class="max-w-7xl mx-auto py-8">
      <div class="text-center text-text-primary">
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
const colorMode = useColorMode()

// Dynamic logo based on theme
const logoSrc = computed(() =>
  colorMode.value === 'dark'
    ? '/images/logo/logo.png'
    : '/images/logo/logo_dark.png'
)

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
