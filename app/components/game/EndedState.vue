<template>
  <section class="flex-1 max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center">
    <div class="grid grid-cols-12 gap-8">
      <!-- Scoreboard -->
      <div class="col-span-7">
        <Scoreboard :players="room.users" />
      </div>

      <!-- Restart Settings (only for owner) -->
      <div class="col-span-5">
        <div v-if="isOwner" class="bg-gray-800 p-8 rounded-xl">
          <h3 class="text-2xl font-bold text-white mb-6">PREFERENCES DE PARTIE</h3>

          <form @submit.prevent="handleRestartGame" class="space-y-6">
            <RangeSlider
              id="new-duration"
              v-model="newDuration"
              label="Durée de la partie"
              :min="30"
              :max="180"
              :step="10"
              color="blue"
              unit="sec."
            />

            <RangeSlider
              id="new-wordCount"
              v-model="newWordCount"
              label="Mots affichés en même temps"
              :min="1"
              :max="8"
              :step="1"
              color="green"
              unit="mots"
            />

            <div>
              <label for="new-language" class="block mb-2 text-base font-medium text-word-font-fill">
                Langue des mots
              </label>
              <select
                id="new-language"
                v-model="newLanguage"
                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-player-blue"
              >
                <option value="lat">Latin (2600 mots)</option>
                <option value="en">Anglais (68000 mots)</option>
                <option value="fr">Français (320000 mots)</option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full px-8 py-3 bg-player-green hover:bg-player-green/80 text-white text-xl font-bold rounded-lg transition"
            >
              Relancer la partie !
            </button>
          </form>
        </div>
        <div v-else class="bg-gray-800 p-8 rounded-xl text-center">
          <p class="text-gray-400 text-lg">En attente que l'hôte relance la partie...</p>
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
