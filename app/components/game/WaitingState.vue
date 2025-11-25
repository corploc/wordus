<template>
  <section class="flex-1 max-w-xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
      <!-- Settings and Start Button -->
      <div class="bg-gray-800 p-8 rounded-xl">
        <h3 class="text-2xl font-bold text-white mb-6">PREFERENCES DE PARTIE</h3>

        <div class="space-y-4 mb-8">
          <p class="text-xl text-white">
            <span class="font-medium">Durée de la partie :</span>
            <span class="text-player-blue ml-2">{{ room.settings.duration }} sec.</span>
          </p>
          <p class="text-xl text-white">
            <span class="font-medium">Mots affichés en même temps :</span>
            <span class="text-player-green ml-2">{{ room.settings.wordCount }} mots</span>
          </p>
          <p class="text-xl text-white">
            <span class="font-medium">Langue des mots :</span>
            <span class="ml-2">{{ getLanguageName(room.settings.language) }}</span>
          </p>
        </div>

        <!-- Invite Link -->
        <div class="mb-8">
          <label class="block mb-3 text-base font-medium text-word-font-fill">
            Invite tes amis à jouer !
          </label>
          <div class="flex gap-3">
            <!-- Input with toggle icon -->
            <div class="relative flex-1">
              <input
                :value="isLinkVisible ? inviteLink : '•'.repeat(inviteLink.length)"
                readonly
                class="w-full px-4 py-3 pr-12 bg-gray-700 text-white rounded-lg border border-gray-600"
              />
              <!-- Toggle icon button inside input -->
              <button
                @click="isLinkVisible = !isLinkVisible"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <!-- Eye icon (visible) -->
                <svg v-if="isLinkVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                <!-- Eye-off icon (hidden) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              </button>
            </div>

            <button @click="handleCopyLink"
              class="px-6 py-3 bg-player-yellow hover:bg-player-yellow/80 text-white font-bold rounded-lg transition">
              COPIER
            </button>
          </div>
        </div>

        <!-- Start Button (only for owner) -->
        <button v-if="isOwner" @click="emit('start-game')"
          class="w-full px-8 py-3 bg-player-blue hover:bg-player-blue/80 text-white text-xl font-bold rounded-lg transition">
          Lancer la partie !
        </button>
        <p v-else class="text-center text-gray-400 text-lg">
          En attente du lancement de la partie...
        </p>
      </div>
  </section>
</template>

<script setup lang="ts">
import type { Room, User } from '~/types'

interface Props {
  room: Room
  user: User | null
  isOwner: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'start-game': []
  'copy-link': []
}>()

// Link visibility state
const isLinkVisible = ref(false)

// Computed invite link from room ID
const inviteLink = computed(() => {
  return `${window.location.origin}/join?code=${props.room.id}`
})

// Utility method
const getLanguageName = (lang: string) => {
  const names: Record<string, string> = {
    lat: 'latin',
    en: 'anglais',
    fr: 'français'
  }
  return names[lang] || lang
}

// Copy link handler
const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value)
    emit('copy-link')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
