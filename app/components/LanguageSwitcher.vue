<template>
  <button
    @click="toggleLocale"
    class="p-2 rounded-lg transition-colors bg-surface-alt hover:bg-surface"
    :title="currentLocale === 'fr' ? $t('languages.switchToEnglish') : $t('languages.switchToFrench')"
  >
    <!-- French Flag -->
    <svg v-if="currentLocale === 'fr'" class="w-5 h-5 rounded-sm" viewBox="0 0 640 480">
      <rect width="213.3" height="480" fill="#002654"/>
      <rect x="213.3" width="213.4" height="480" fill="#fff"/>
      <rect x="426.7" width="213.3" height="480" fill="#ce1126"/>
    </svg>
    <!-- UK Flag -->
    <svg v-else class="w-5 h-5 rounded-sm" viewBox="0 0 640 480">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"/>
      <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

const currentLocale = computed(() => locale.value)

const toggleLocale = () => {
  setLocale(locale.value === 'fr' ? 'en' : 'fr')
}
</script>
