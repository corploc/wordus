<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Initialize game store and socket on app mount
const gameStore = useGameStore()

onMounted(() => {
  console.log('[App] Initializing socket...')
  gameStore.initSocket()
})

onUnmounted(() => {
  console.log('[App] Cleaning up socket...')
  gameStore.cleanupSocket()
})
</script>
