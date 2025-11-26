<template>
  <div
    class="floating-point place-self-center pointer-events-none font-bold text-2xl"
    :class="[`case-${position}`, correct ? 'float-up text-green-500' : 'float-down text-red-500']"
  >
    {{ correct ? '+' : '' }}{{ points }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  position: number
  points: number
  correct: boolean
}>()
</script>

<style scoped>
/* Animation duration - change this to adjust speed */
.floating-point {
  --animation-duration: 1.2s;
}

.float-up {
  animation: floatUp var(--animation-duration) ease-out forwards;
}

.float-down {
  animation: floatDown var(--animation-duration) ease-out forwards;
}

@keyframes floatUp {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  20% { opacity: 1; transform: translateY(-10px) scale(1.2); }
  100% { opacity: 0; transform: translateY(-50px) scale(0.8); }
}

@keyframes floatDown {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  20% { opacity: 1; transform: translateY(10px) scale(1.2); }
  100% { opacity: 0; transform: translateY(50px) scale(0.8); }
}

/* Grid positioning (same as GameWord.vue) */
.floating-point.case-1 { grid-column: 1; grid-row: 1; }
.floating-point.case-2 { grid-column: 1; grid-row: 2; }
.floating-point.case-3 { grid-column: 1; grid-row: 3; }
.floating-point.case-4 { grid-column: 1; grid-row: 4; }
.floating-point.case-5 { grid-column: 1; grid-row: 5; }
.floating-point.case-6 { grid-column: 2; grid-row: 1; }
.floating-point.case-7 { grid-column: 2; grid-row: 2; }
.floating-point.case-8 { grid-column: 2; grid-row: 3; }
.floating-point.case-9 { grid-column: 2; grid-row: 4; }
.floating-point.case-10 { grid-column: 2; grid-row: 5; }
.floating-point.case-11 { grid-column: 3; grid-row: 1; }
.floating-point.case-12 { grid-column: 3; grid-row: 2; }
.floating-point.case-13 { grid-column: 3; grid-row: 3; }
.floating-point.case-14 { grid-column: 3; grid-row: 4; }
.floating-point.case-15 { grid-column: 3; grid-row: 5; }
.floating-point.case-16 { grid-column: 4; grid-row: 1; }
.floating-point.case-17 { grid-column: 4; grid-row: 2; }
.floating-point.case-18 { grid-column: 4; grid-row: 3; }
.floating-point.case-19 { grid-column: 4; grid-row: 4; }
.floating-point.case-20 { grid-column: 4; grid-row: 5; }
</style>
