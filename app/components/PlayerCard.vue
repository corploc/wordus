<template>
  <div class="player_box flex mt-4 items-center">
    <div class="player-picture rounded-full w-min flex items-center -ml-[5%] p-2"
      :style="{ backgroundColor: playerColor }">
      <img :src="`/images/avatars/${player.avatar}`" class="h-20 rounded-full bg-white border-[3px]"
        :style="{ borderColor: playerColor }" alt="Player avatar" />
    </div>

    <div class="player-infos ml-4 flex-1">
      <p class="player-name text-2xl font-medium text-white">
        {{ player.username }}
        <span v-if="player.isOwner" class="ml-2 text-yellow-400">👑</span>
      </p>
      <div class="flex items-end gap-3 mt-2">
        <p class="player-score text-2xl font-medium text-white">
          {{ player.score }} pts
        </p>
        <p v-if="player.combo > 0" class="text-sm text-gray-300">
          x{{ getMultiplier(player.combo) }}
        </p>
      </div>
      <!-- Combo bar -->
      <div class="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
        <div class="h-full bg-player-yellow transition-all duration-300"
          :style="{ width: `${Math.min(player.combo * 25, 100)}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

interface Props {
  player: User
}

const props = defineProps<Props>()

const playerColor = computed(() => {
  const colorMap: Record<string, string> = {
    '#FFCC5E': '#FFCC5E', // yellow
    '#5E94FF': '#5E94FF', // blue
    '#2CDA75': '#2CDA75', // green
    '#BE7B67': '#BE7B67', // brown
    '#B85EFF': '#B85EFF', // dark pink / purple
    '#FF5EBA': '#FF5EBA'  // light pink
  }
  return colorMap[props.player.color] || '#FFCC5E'
})

const getMultiplier = (combo: number) => {
  if (combo >= 4) return 3
  if (combo >= 3) return 2.5
  if (combo >= 2) return 2
  if (combo >= 1) return 1.5
  return 1
}
</script>
