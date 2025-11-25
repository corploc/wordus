// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  nitro: {
    experimental: {
      websocket: true
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', 'nuxt-toast'],
  toast: {
    settings: {
      rtl: true,
      position: 'topRight',
      timeout: 3000,
      closeOnEscape: true,
      closeOnClick: true,
      pauseOnHover: true
    }
  }
})