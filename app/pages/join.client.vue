<template>
  <div class="h-full max-w-6xl mx-auto px-4 py-12 flex flex-col justify-center">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Page Title -->
      <!-- <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Rejoindre la partie</h1>
        <p class="text-3xl text-player-yellow font-bold">Code: {{ roomCode }}</p>
      </div> -->

      <!-- Room Creation Section -->
      <section class="bg-gray-800 p-8 rounded-xl shadow-xl flex justify-between flex-col">
        <h2 class="text-2xl font-bold text-white mb-6">REJOINDRE LA PARTIE</h2>

          <p class="text-white font-bold text-4xl text-center">
            {{ roomCode }}
          </p>

          <button @click="joinRoom"
            class="mt-8 w-full px-8 py-3 bg-player-green hover:bg-player-green/80 text-white text-xl font-bold rounded-lg transition">
            Rejoindre la partie !
          </button>
      </section>

      <!-- User Choice Section (centered) -->
      <section class="bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col items-center">
        <AvatarPicker :avatar="avatar!" :color="avatarColor!" @random="randomizeAvatar" />

        <div class="w-full mt-8">
          <label for="username" class="block mb-3 text-center text-base font-medium text-word-font-fill">
            Choisis ton pseudo !
          </label>
          <input id="username" v-model="username" type="text" placeholder="..." maxlength="15"
            class="w-full px-4 py-3 bg-gray-700 text-white text-center rounded-lg border border-gray-600 focus:outline-none focus:border-player-yellow" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

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

// Join Room Handler
const joinRoom = () => {
  // Validate username
  if (!username.value.trim()) {
    toast.error({
      title: 'Error',
      message: 'Please enter a username'
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
      title: 'Error',
      message: 'Invalid room code'
    })
    router.push('/')
  }
})
</script>
