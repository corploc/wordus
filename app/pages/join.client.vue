<template>
  <div class="h-full max-w-6xl mx-auto px-4 py-12 flex flex-col justify-center">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Room Creation Section -->
      <section class="bg-surface-alt p-8 rounded-xl shadow-xl flex justify-between flex-col transition-colors">
        <h2 class="text-2xl font-bold text-text-primary mb-6">{{ $t('game.joinRoom') }}</h2>

          <p class="text-text-primary font-bold text-4xl text-center">
            {{ roomCode }}
          </p>

          <button @click="joinRoom"
            class="mt-8 w-full px-8 py-3 bg-player-green hover:bg-player-green/80 text-white text-xl font-bold rounded-lg transition">
            {{ $t('game.joinButton') }}
          </button>
      </section>

      <!-- User Choice Section (centered) -->
      <section class="bg-surface-alt p-8 rounded-xl shadow-xl flex flex-col items-center transition-colors">
        <AvatarPicker :avatar="avatar!" :color="avatarColor!" @random="randomizeAvatar" />

        <div class="w-full mt-8">
          <label for="username" class="block mb-3 text-center text-base font-medium text-text-secondary">
            {{ $t('user.chooseUsername') }}
          </label>
          <div class="relative w-full">
            <input
              id="username"
              v-model="username"
              type="text"
              :placeholder="$t('user.usernamePlaceholder')"
              maxlength="15"
              class="w-full px-4 py-3 pr-12 bg-surface text-text-primary text-center rounded-lg border border-border focus:outline-none focus:border-player-yellow transition-colors"
            />
            <!-- Random username icon button -->
            <button
              @click="randomizeUsername"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
              :title="$t('user.randomUsername')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateRandomUsername } from '~/utils/username'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const { t } = useI18n()

definePageMeta({
  layout: 'default'
})

// Extract room code from query params and convert to uppercase
const roomCode = computed(() => {
  const code = route.query.code as string
  return code ? code.toUpperCase() : ''
})

// Form State
const username = ref('')

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

// Join Room Handler
const joinRoom = () => {
  // Validate username
  if (!username.value.trim()) {
    toast.error({
      title: t('toast.usernameRequired'),
    })
    return
  }

  console.log({
    username: username.value.trim(),
    avatar: avatar.value,
    color: avatarColor.value,
    roomCode: roomCode.value
  })

  // Create user with avatar
  gameStore.createUser(
    username.value.trim(),
    avatar.value,
    avatarColor.value
  )

  // Join room with code from URL
  gameStore.joinRoom(
    roomCode.value,
    username.value.trim()
  )
}

onMounted(() => {
  // Randomize avatar on mount
  randomizeAvatar()

  // Validate room code format
  if (!roomCode.value || roomCode.value.length < 4) {
    toast.error({
      title: t('toast.invalidRoomCode'),
    })
    router.push('/')
  }
})
</script>
