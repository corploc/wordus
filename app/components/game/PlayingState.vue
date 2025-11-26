<template>
  <!-- NO section wrapper - fixed elements span full width -->
  <div class="flex-1 px-12 pb-8 flex flex-col min-h-0 relative">
    <!-- Center: Words Grid -->
    <div class="flex-1 bg-gray-800 rounded-xl p-12 flex relative">
      <div class="flex-1 grid grid-cols-4 grid-rows-5 gap-6">
        <GameWord v-for="word in room.words" :key="word.id" :word="word" />
      </div>

      <!-- Floating points overlay (same grid structure) -->
      <div class="absolute inset-12 grid grid-cols-4 grid-rows-5 gap-6 pointer-events-none">
        <FloatingPoint
          v-for="fp in gameStore.floatingPoints"
          :key="fp.id"
          :position="fp.position"
          :points="fp.points"
          :correct="fp.correct"
        />
      </div>
    </div>

    <!-- Fixed Bottom Input -->
    <div class="fixed bottom-8 left-0 right-0 h-20 z-50">
      <div class="max-w-7xl mx-auto px-6 h-full flex items-center justify-center">
        <div class="flex items-center gap-4 flex-1 max-w-4xl">
          <input
          v-model="localInput"
          type="text"
          placeholder="..."
          autofocus
          class="flex-1 px-6 py-3 bg-transparent text-white text-xl rounded-lg border-2 focus:outline-none"
          :style="{ borderColor: borderColor }"
          />
          <p class="text-2xl font-medium text-white">
            {{ user?.score || 0 }}
            pts
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Room, User } from '~/types'

interface Props {
  room: Room
  user: User | null
}

const props = defineProps<Props>()

// Access game store directly
const gameStore = useGameStore()

// Local input state (internal to component)
const localInput = ref('')

// Border color based on user color
const borderColor = computed(() => {
  const colorMap: Record<string, string> = {
    yellow: '#FFCC5E',
    blue: '#5E94FF',
    green: '#2CDA75',
    brown: '#BE7B67',
    purple: '#B85EFF',
    pink: '#FF5EBA'
  }
  return colorMap[props.user?.color!] || '#FFCC5E'
})

// Handle input submission
const handleInput = (input: string) => {
  gameStore.sendInput(input)
}

const submitWord = (word: string) => {
  gameStore.submitWord(word)
}

// Watch input changes
watch(localInput, (newVal) => {
  if (newVal) {
    handleInput(newVal)
  }
})

// Keyboard event handler function
const handleKeydown = (e: KeyboardEvent) => {
  // Only handle if we're in PLAYING state
  if (props.room.state !== 'PLAYING') return

  // Allow copy (Ctrl+C / Cmd+C)
  if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
    return
  }

  e.preventDefault()

  if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
    localInput.value += e.key.toLowerCase()
  } else if (e.key === 'Backspace') {
    if (e.ctrlKey || e.metaKey) {
      localInput.value = ''
    } else {
      localInput.value = localInput.value.slice(0, -1)
    }
  } else if (e.key === 'Enter') {
    if (localInput.value.trim()) {
      submitWord(localInput.value.trim())
      localInput.value = ''
    }
  }
}

// Setup keyboard listener
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

// Cleanup event listener
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
