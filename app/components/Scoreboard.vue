<template>
  <div class="scoreboard bg-background p-8 rounded-xl">
    <h2 class="text-3xl font-bold text-white mb-6 text-center">RESULTATS</h2>
    <div class="space-y-4">
      <div v-for="(player, index) in sortedPlayers" :key="player.id"
        class="flex items-center justify-between py-4 px-6 rounded-lg" :class="getPodiumClass(index)">
        <div class="flex items-center gap-4">
          <div class="text-2xl font-bold">
            {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}` }}
          </div>
          <img :src="`/images/avatars/${player.avatar}`" class="h-12 w-12 rounded-full bg-white border-2"
            :style="{ borderColor: player.color }" alt="Avatar" />
          <div class="text-xl font-medium text-white">
            {{ player.username }}
          </div>
        </div>
        <div class="text-2xl font-bold text-white">
          {{ player.score }} pts
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

interface Props {
  players: User[]
}

const props = defineProps<Props>()

const sortedPlayers = computed(() => {
  return [...props.players].sort((a, b) => b.score - a.score)
})

const getPodiumClass = (index: number) => {
  if (index === 0) return 'bg-podium-first/20 border-2 border-podium-first'
  if (index === 1) return 'bg-podium-second/20 border-2 border-podium-second'
  if (index === 2) return 'bg-podium-third/20 border-2 border-podium-third'
  return 'bg-gray-700/50'
}
</script>
