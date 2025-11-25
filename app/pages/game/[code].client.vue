<template>
  <header class="py-6 px-8 bg-background border-b border-gray-700">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <h1 class="text-3xl font-bold flex items-center gap-2">
        <img src="/images/logo/logo_dark.png" alt="Logo" class="w-12 h-12">
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

  <main>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="!room" class="text-center text-white">
        <p class="text-2xl">Chargement de la partie...</p>
      </div>

      <!-- LOBBY STATE: Waiting for game to start -->
      <div v-else-if="room.state === 'WAITING'" class="grid grid-cols-12 gap-8">
        <!-- Players List -->
        <div class="col-span-4">
          <h3 class="text-2xl font-bold text-white mb-4">JOUEURS</h3>
          <PlayerCard v-for="player in room.users" :key="player.id" :player="player" />
        </div>

        <!-- Settings and Start Button -->
        <div class="col-span-8 bg-gray-800 p-8 rounded-xl">
          <h3 class="text-2xl font-bold text-white mb-6">PREFERENCES DE PARTIE</h3>

          <div class="space-y-4 mb-8">
            <p class="text-xl text-white">
              <span class="font-medium">Durée de la partie :</span>
              <span class="text-player-blue ml-2">{{ room.settings.duration }} sec.</span>
            </p>
            <p class="text-xl text-white">
              <span class="font-medium">Mots affichés en même temps :</span>
              <span class="text-player-green ml-2">{{ room.settings.wordCount }} mots</span>
            </p>
            <p class="text-xl text-white">
              <span class="font-medium">Langue des mots :</span>
              <span class="ml-2">{{ getLanguageName(room.settings.language) }}</span>
            </p>
          </div>

          <!-- Invite Link -->
          <div class="mb-8">
            <label class="block mb-3 text-base font-medium text-word-font-fill">
              Invite tes amis à jouer !
            </label>
            <div class="flex gap-3">
              <input :value="inviteLink" readonly
                class="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600" />
              <button @click="copyLink"
                class="px-6 py-3 bg-player-yellow hover:bg-player-yellow/80 text-white font-bold rounded-lg transition">
                COPIER
              </button>
            </div>
          </div>

          <!-- Start Button (only for owner) -->
          <button v-if="isOwner" @click="startGame"
            class="w-full px-8 py-4 bg-player-blue hover:bg-player-blue/80 text-white text-xl font-bold rounded-lg transition">
            Lancer la partie !
          </button>
          <p v-else class="text-center text-gray-400 text-lg">
            En attente du lancement de la partie...
          </p>
        </div>
      </div>

      <!-- PLAYING STATE: Game in progress -->
      <div v-else-if="room.state === 'PLAYING'" class="grid grid-cols-12 gap-8">
        <!-- Players List -->
        <div class="col-span-3">
          <h3 class="text-xl font-bold text-white mb-4">JOUEURS</h3>
          <PlayerCard v-for="player in sortedPlayers" :key="player.id" :player="player" />
        </div>

        <!-- Game Board -->
        <div class="col-span-9">
          <!-- Words Grid -->
          <div class="bg-gray-800 rounded-xl p-8 mb-6 min-h-[500px] grid grid-cols-4 grid-rows-5 gap-6">
            <GameWord v-for="word in room.words" :key="word.id" :word="word" />
          </div>

          <!-- Player Input -->
          <div class="bg-gray-800 rounded-xl p-6 flex items-center justify-between">
            <div class="flex items-center gap-4 flex-1">
              <p class="text-2xl font-bold text-player-dark-pink uppercase">MOI</p>
              <input v-model="currentInput" type="text" placeholder="..." autofocus
                class="flex-1 px-6 py-4 bg-gray-700 text-white text-xl rounded-lg border-2 border-player-dark-pink focus:outline-none" />
            </div>
            <div class="flex items-center gap-2 ml-6">
              <p class="text-5xl font-bold text-white">{{ currentUserScore }}</p>
              <p class="text-xl text-gray-400">pts</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ENDED STATE: Game results -->
      <div v-else-if="room.state === 'ENDED'" class="grid grid-cols-12 gap-8">
        <!-- Scoreboard -->
        <div class="col-span-7">
          <Scoreboard :players="room.users" />
        </div>

        <!-- Restart Settings (only for owner) -->
        <div class="col-span-5">
          <div v-if="isOwner" class="bg-gray-800 p-8 rounded-xl">
            <h3 class="text-2xl font-bold text-white mb-6">PREFERENCES DE PARTIE</h3>

            <form @submit.prevent="restartGame" class="space-y-6">
              <RangeSlider id="new-duration" v-model="newDuration" label="Durée de la partie" :min="30" :max="180"
                :step="10" color="blue" unit="sec." />

              <RangeSlider id="new-wordCount" v-model="newWordCount" label="Mots affichés en même temps" :min="1"
                :max="8" :step="1" color="green" unit="mots" />

              <div>
                <label for="new-language" class="block mb-2 text-base font-medium text-word-font-fill">
                  Langue des mots
                </label>
                <select id="new-language" v-model="newLanguage"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-player-blue">
                  <option value="lat">Latin (2600 mots)</option>
                  <option value="en">Anglais (68000 mots)</option>
                  <option value="fr">Français (320000 mots)</option>
                </select>
              </div>

              <button type="submit"
                class="w-full px-8 py-4 bg-player-green hover:bg-player-green/80 text-white text-xl font-bold rounded-lg transition">
                Relancer la partie !
              </button>
            </form>
          </div>
          <div v-else class="bg-gray-800 p-8 rounded-xl text-center">
            <p class="text-gray-400 text-lg">En attente que l'hôte relance la partie...</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'game'
})

const toast = useToast()
const route = useRoute()
const gameStore = useGameStore()

const roomCode = route.params.code as string

// Access room from store reactively
const room = computed(() => gameStore.room)
const currentInput = ref('')
const newDuration = ref(60)
const newWordCount = ref(5)
const newLanguage = ref<'en' | 'fr' | 'lat'>('lat')

// Computed
const inviteLink = computed(() => {
  return `${window.location.origin}/game/${roomCode}`
})

const isOwner = computed(() => {
  if (!room.value) return false
  const currentUser = room.value.users.find(u => u.id === gameStore.user?.id)
  return currentUser?.isOwner || false
})

const currentUserScore = computed(() => {
  if (!room.value) return 0
  const currentUser = room.value.users.find(u => u.id === gameStore.user?.id)
  return currentUser?.score || 0
})

const sortedPlayers = computed(() => {
  if (!room.value) return []
  return [...room.value.users].sort((a, b) => b.score - a.score)
})

// Methods
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getLanguageName = (lang: string) => {
  const names: Record<string, string> = {
    lat: 'latin',
    en: 'anglais',
    fr: 'français'
  }
  return names[lang] || lang
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value)
    toast.success({
      title: 'Lien copié !'
    })
  } catch (err) {
    console.error('Failed to copy:', err)
    toast.error({
      title: 'Erreur',
      message: 'Impossible de copier le lien.'
    })
  }
}

const startGame = () => {
  console.log('Starting game...')
  toast.info({
    title: 'Lancement de la partie...'
  })
  gameStore.startGame()
}

const restartGame = () => {
  console.log('Restarting game...')
  toast.info({
    title: 'Relance de la partie...'
  })
  gameStore.restartGame({
    duration: newDuration.value,
    maxPlayers: 6,
    wordCount: newWordCount.value,
    language: newLanguage.value
  })
}

// Keyboard input handling
const handleInput = (input: string) => {
  gameStore.sendInput(input)
}

// Watch input changes
watch(currentInput, (newVal) => {
  if (newVal) {
    handleInput(newVal)
  }
})

onMounted(() => {
  console.log('[Game Page] Mounted')
  console.log('[Game Page] Room:', gameStore.room)
  console.log('[Game Page] User:', gameStore.user)

  // All socket events are now handled in the game store
  // Room state updates automatically via reactive computed property
})
</script>
