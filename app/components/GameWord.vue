<template>
  <div class="word place-self-center flex flex-col items-center select-none" :class="`case-${word.x}`">
    <!-- Players typing indicator circles (MULTIPLE DOTS) -->
    <div v-if="typingUsers.length > 0" class="players-circles flex mb-2 gap-1">
      <div
        v-for="typingUser in typingUsers"
        :key="typingUser.userId"
        class="circle w-2.5 h-2.5 rounded-full"
        :style="{ backgroundColor: getUserColor(typingUser.userId) }"
      />
    </div>

    <!-- Word container with dynamic border color -->
    <div
      class="word-container py-3 px-12 rounded-3xl bg-white border-[3px]"
      :style="{ borderColor: borderColor }"
    >
      <p class="text-word-font-fill text-xl font-semibold lowercase">
        <span class="text-green-600">{{ word.typed }}</span>{{ word.text.slice(word.typed.length) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Word } from '~/types'

interface Props {
  word: Word
}

const props = defineProps<Props>()

// Access game store to get user colors
const gameStore = useGameStore()

// Get all users typing this word
const typingUsers = computed(() => {
  return props.word.typingUsers || []
})

// Border color = color of primary owner (most progress)
const borderColor = computed(() => {
  if (!props.word.owner) {
    return '#D6D6D6' // default gray
  }
  return getUserColor(props.word.owner)
})

// Get user color from room data
const getUserColor = (userId: string) => {
  const room = gameStore.room
  if (!room) return '#FF5E73' // fallback red

  const user = room.users.find(u => u.id === userId)
  if (!user) return '#FF5E73' // fallback red

  const colorMap: Record<string, string> = {
    'yellow': '#FFCC5E',
    'blue': '#5E94FF',
    'green': '#2CDA75',
    'brown': '#BE7B67',
    'purple': '#B85EFF',
    'pink': '#FF5EBA'
  }

  return colorMap[user.color] || '#FF5E73'
}
</script>

<style scoped>
/* Grid positioning for 4x5 grid (20 positions) */
.word.case-1 {
  grid-column: 1;
  grid-row: 1;
}

.word.case-2 {
  grid-column: 1;
  grid-row: 2;
}

.word.case-3 {
  grid-column: 1;
  grid-row: 3;
}

.word.case-4 {
  grid-column: 1;
  grid-row: 4;
}

.word.case-5 {
  grid-column: 1;
  grid-row: 5;
}

.word.case-6 {
  grid-column: 2;
  grid-row: 1;
}

.word.case-7 {
  grid-column: 2;
  grid-row: 2;
}

.word.case-8 {
  grid-column: 2;
  grid-row: 3;
}

.word.case-9 {
  grid-column: 2;
  grid-row: 4;
}

.word.case-10 {
  grid-column: 2;
  grid-row: 5;
}

.word.case-11 {
  grid-column: 3;
  grid-row: 1;
}

.word.case-12 {
  grid-column: 3;
  grid-row: 2;
}

.word.case-13 {
  grid-column: 3;
  grid-row: 3;
}

.word.case-14 {
  grid-column: 3;
  grid-row: 4;
}

.word.case-15 {
  grid-column: 3;
  grid-row: 5;
}

.word.case-16 {
  grid-column: 4;
  grid-row: 1;
}

.word.case-17 {
  grid-column: 4;
  grid-row: 2;
}

.word.case-18 {
  grid-column: 4;
  grid-row: 3;
}

.word.case-19 {
  grid-column: 4;
  grid-row: 4;
}

.word.case-20 {
  grid-column: 4;
  grid-row: 5;
}
</style>
