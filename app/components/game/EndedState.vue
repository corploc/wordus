<template>
  <section class="flex-1 max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center">
    <div class="grid grid-cols-12 gap-8">
      <!-- Scoreboard -->
      <div class="col-span-7">
        <Scoreboard :players="room.users" />
      </div>

      <!-- Restart Settings (only for owner) -->
      <div class="col-span-5">
        <div v-if="isOwner" class="bg-surface-alt p-8 rounded-xl transition-colors">
          <h3 class="text-2xl font-bold text-text-primary mb-6">{{ $t('settings.title') }}</h3>

          <form @submit.prevent="handleRestartGame" class="space-y-6">
            <RangeSlider
              id="new-duration"
              v-model="newDuration"
              :label="$t('settings.duration')"
              :min="30"
              :max="180"
              :step="10"
              color="blue"
              :unit="$t('settings.seconds')"
            />

            <RangeSlider
              id="new-wordCount"
              v-model="newWordCount"
              :label="$t('settings.wordCount')"
              :min="1"
              :max="8"
              :step="1"
              color="green"
              :unit="$t('settings.words')"
            />

            <div>
              <label for="new-language" class="block mb-2 text-base font-medium text-text-secondary">
                {{ $t('settings.language') }}
              </label>
              <select
                id="new-language"
                v-model="newLanguage"
                class="w-full px-4 py-3 bg-surface text-text-primary rounded-lg border border-border focus:outline-none focus:border-player-blue transition-colors"
              >
                <option value="lat">{{ $t('languages.latin') }}</option>
                <option value="en">{{ $t('languages.english') }}</option>
                <option value="fr">{{ $t('languages.french') }}</option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full px-8 py-3 bg-player-green hover:bg-player-green/80 text-white text-xl font-bold rounded-lg transition"
            >
              {{ $t('game.restartGame') }}
            </button>
          </form>
        </div>
        <div v-else class="bg-surface-alt p-8 rounded-xl text-center transition-colors">
          <p class="text-text-secondary text-lg">{{ $t('waiting.forRestart') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Room, RoomSettings } from '~/types'

interface Props {
  room: Room
  isOwner: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'restart-game': [settings: RoomSettings]
}>()

// Restart form state
const newDuration = ref(60)
const newWordCount = ref(5)
const newLanguage = ref<'en' | 'fr' | 'lat'>('lat')

// Handle restart game
const handleRestartGame = () => {
  emit('restart-game', {
    duration: newDuration.value,
    maxPlayers: 6,
    wordCount: newWordCount.value,
    language: newLanguage.value
  })
}
</script>
