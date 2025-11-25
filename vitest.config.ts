import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // you can optionally set nuxt specific environment options
    // environmentOptions: {
    //   nuxt: {
    //     test: true
    //   }
    // }
  }
})
