<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Initialize game store and socket on app mount
onMounted(() => {
  console.log('[App] Initializing socket...')
  const gameStore = useGameStore()
  gameStore.initSocket()
})

onUnmounted(() => {
  console.log('[App] Cleaning up socket...')
  const gameStore = useGameStore()
  gameStore.cleanupSocket()
})
</script>
