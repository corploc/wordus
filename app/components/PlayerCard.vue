<template>
  <div class="player_box flex mt-4 items-center rounded-lg p-2 transition-all h-min"
    :class="{ 'ring-2 bg-surface-alt/30': props.isCurrentUser }" :style="{
      borderColor: playerColor
    }">
    <div class="player-picture rounded-full w-auto flex items-center p-.5" :style="{ backgroundColor: playerColor }">
      <img :src="`/images/avatars/${player.avatar}`" class="rounded-full bg-word-bg border-[1px]" :class="avatarSizeClass"
        :style="{ borderColor: playerColor }" alt="Player avatar" />
    </div>

    <div class="player-infos ml-4">
      <p class="player-name font-medium text-text-primary" :class="textSizeClass">
        {{ player.username }}
        <span v-if="player.isOwner" class="ml-2 text-yellow-400">👑</span>
      </p>
      <div class="flex items-end gap-3 mt-2">
        <p class="player-score font-medium text-text-primary" :class="scoreSizeClass">
          {{ player.score }} pts
        </p>
        <p v-if="player.combo > 0" class="text-text-secondary" :class="comboSizeClass">
          x{{ getMultiplier(player.combo) }}
        </p>
      </div>
      <!-- Combo bar -->
      <div class="w-full bg-surface-alt h-1 mt-2 rounded-full overflow-hidden">
        <div class="h-full transition-all duration-300"
          :style="{ width: `${Math.min(player.combo * 25, 100)}%`, backgroundColor: playerColor }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

interface Props {
  player: User
  size: 'small' | 'medium' | 'large'
  isCurrentUser?: boolean
}

const props = defineProps<Props>()

const playerColor = computed(() => {
  const colorMap: Record<string, string> = {
    'yellow': '#FFCC5E', // yellow
    'blue': '#5E94FF', // blue
    'green': '#2CDA75', // green
    'brown': '#BE7B67', // brown
    'purple': '#B85EFF', // dark pink / purple
    'pink': '#FF5EBA'  // light pink
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

const textSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'text-sm'
    case 'medium':
      return 'text-lg'
    case 'large':
      return 'text-2xl'
    default:
      return 'text-base'
  }
})

const scoreSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'text-base'
    case 'medium':
      return 'text-xl'
    case 'large':
      return 'text-2xl'
    default:
      return 'text-base'
  }
})

const comboSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'text-xs'
    case 'medium':
      return 'text-sm'
    case 'large':
      return 'text-base'
    default:
      return 'text-xs'
  }
})

const avatarSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'h-10'
    case 'medium':
      return 'h-16'
    case 'large':
      return 'h-20'
    default:
      return 'h-10'
  }
})
</script>
