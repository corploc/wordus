<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Room Creation Section -->
      <section class="bg-surface-alt p-8 rounded-xl shadow-xl transition-colors">
        <h2 class="text-2xl font-bold text-text-primary mb-6">NOUVELLE PARTIE</h2>

        <form @submit.prevent="createRoom" class="space-y-6">
          <!-- Game Duration Slider -->
          <RangeSlider id="duration" v-model="duration" label="Durée de la partie" :min="30" :max="180" :step="10"
            color="blue" unit="sec." />

          <!-- Words Number Slider -->
          <RangeSlider id="wordCount" v-model="wordCount" label="Mots affichés en même temps" :min="1" :max="8"
            :step="1" color="green" unit="mots" />

          <!-- Language Selection -->
          <div>
            <label for="language" class="block mb-2 text-base font-medium text-text-secondary">
              Langue des mots
            </label>
            <select id="language" v-model="language"
              class="w-full px-4 py-3 bg-surface text-text-primary rounded-lg border border-border focus:outline-none focus:border-player-blue transition-colors">
              <option value="lat">Latin (2600 mots)</option>
              <option value="en">Anglais (68000 mots)</option>
              <option value="fr">Français (320000 mots)</option>
            </select>
          </div>

          <div class="flex justify-between items-center pt-4">
            <button type="submit"
              class="px-8 py-3 bg-player-blue hover:bg-player-blue/80 text-white font-bold rounded-lg transition w-full">
              Créer la partie !
            </button>
          </div>
        </form>
      </section>

      <!-- User Choice Section -->
      <section class="bg-surface-alt p-8 rounded-xl shadow-xl flex flex-col items-center justify-center transition-colors">
        <AvatarPicker :avatar="avatar!" :color="avatarColor!" @random="randomizeAvatar" />

        <div class="w-full mt-8">
          <label for="username" class="block mb-3 text-center text-base font-medium text-text-secondary">
            Choisis ton pseudo !
          </label>
          <div class="relative w-full">
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Clique sur l'icône pour générer →"
              maxlength="15"
              class="w-full px-4 py-3 pr-12 bg-surface text-text-primary text-center rounded-lg border border-border focus:outline-none focus:border-player-yellow transition-colors"
            />
            <!-- Random username icon button -->
            <button
              @click="randomizeUsername"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
              title="Générer un pseudo aléatoire"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Join Room Section -->
    <section class="mt-8 bg-surface-alt p-8 rounded-xl shadow-xl max-w-2xl mx-auto transition-colors">
      <h2 class="text-2xl font-bold text-text-primary mb-6 text-center">REJOINDRE UNE PARTIE</h2>
      <form @submit.prevent="joinRoom" class="flex gap-4">
        <input v-model="roomCode" type="text" placeholder="Code de la partie (ex: ABCDEF)" maxlength="6" minlength="6"
          class="flex-1 px-4 py-3 bg-surface text-text-primary text-center uppercase rounded-lg border border-border focus:outline-none focus:border-player-green transition-colors" />
        <button type="submit"
          class="px-8 py-3 bg-player-green hover:bg-player-green/80 text-white font-bold rounded-lg transition">
          Rejoindre
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { generateRandomUsername } from '~/utils/username'

const toast = useToast()
const gameStore = useGameStore()

definePageMeta({
  layout: 'default'
})

// Form State
const duration = ref(60)
const wordCount = ref(5)
const language = ref<'en' | 'fr' | 'lat'>('lat')
const username = ref('')
const roomCode = ref('')

// Avatar State
const avatarList = [
  'avatar_1.png', 'avatar_2.png', 'avatar_3.png', 'avatar_4.png',
  'avatar_5.png', 'avatar_6.png', 'avatar_7.png', 'avatar_8.png',
  'avatar_9.png', 'avatar_10.png', 'avatar_11.png', 'avatar_12.png',
  'avatar_13.png', 'avatar_14.png', 'avatar_15.png', 'avatar_16.png',
  'avatar_17.png', 'avatar_18.png'
]
const colorList = ['yellow', 'blue', 'green', 'brown', 'purple', 'pink']

const avatar = ref(avatarList[0])
const avatarColor = ref(colorList[0])

const randomizeAvatar = () => {
  avatar.value = avatarList[Math.floor(Math.random() * avatarList.length)]
  avatarColor.value = colorList[Math.floor(Math.random() * colorList.length)]
}

const randomizeUsername = () => {
  username.value = generateRandomUsername()
}

// Socket Event Handlers
const createRoom = () => {
  if (!username.value.trim()) {
    toast.error({
      title: 'Un pseudo est requis',
    })
    return
  }

  console.log({
    username: username.value.trim(),
    settings: {
      duration: duration.value,
      wordCount: wordCount.value,
      language: language.value
    }
  })

  gameStore.createUser(
    username.value.trim(),
    avatar.value,
    avatarColor.value
  )

  gameStore.createRoom(
    {
      duration: duration.value,
      maxPlayers: 6,
      wordCount: wordCount.value,
      language: language.value
    },
    username.value.trim()
  )
}

const joinRoom = () => {
  if (!username.value.trim()) {
    toast.error({
      title: 'Un pseudo est requis',
    })
    return
  }
  if (!roomCode.value.trim()) {
    toast.error({
      title: 'Un code de partie est requis',
    })
    return
  }

  gameStore.createUser(
    username.value.trim(),
    avatar.value,
    avatarColor.value
  )

  gameStore.joinRoom(
    roomCode.value.toUpperCase(),
    username.value.trim()
  )
}

onMounted(() => {
  // Randomize avatar on mount
  randomizeAvatar()
})
</script>
