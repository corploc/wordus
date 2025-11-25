<template>
  <div class="word place-self-center flex flex-col items-center" :class="`case-${word.x}`">
    <!-- Players typing indicator circles -->
    <div v-if="word.owner" class="players-circles flex mb-2">
      <div class="circle w-2.5 h-2.5 rounded-full mr-2" :style="{ backgroundColor: getPlayerColor(word.owner) }" />
    </div>

    <!-- Word container -->
    <div class="word-container py-3 px-12 rounded-3xl bg-white border-[3px]"
      :class="word.owner ? 'border-red' : 'border-word-default'">
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

defineProps<Props>()

const getPlayerColor = (userId: string) => {
  // This will be provided by parent or store
  // For now return a default
  return '#FF5E73'
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
