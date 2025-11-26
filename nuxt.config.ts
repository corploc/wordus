// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Wordus - Jeu de frappe multijoueur en temps réel",
      htmlAttrs: { lang: "fr" },
      link: [
        { rel: "canonical", href: "https://wordus.xyz" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Sacramento&display=swap",
        },
        {
          rel: "sitemap",
          type: "application/xml",
          title: "Sitemap",
          href: "/sitemap.xml",
        },
      ],
      meta: [
        {
          name: "description",
          content:
            "Wordus est un jeu de frappe multijoueur en temps réel : crée ta partie (langue FR/EN/latin, 30–180 s, 1–8 mots), choisis ton avatar/pseudo, partage le code d’invitation et grimpe au scoreboard en devinant les mots plus vite que tes amis",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { name: "theme-color", content: "#353f54" },
        { name: "msapplication-TileColor", content: "#353f54" },
        { name: "msapplication-config", content: "/browserconfig.xml" },

        { name: 'robots', content: 'index, follow, max-image-preview:large' },

        { property: "icon", content: "/favicon.ico" },

        { property: "og:site_name", content: "Wordus.xyz" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fr_FR" },
        { property: 'og:title', content: "Wordus - Jeu de frappe multijoueur en temps réel" },
        { property: 'og:description', content: "Wordus.xyz — Tape plus vite que tes amis : 30 à 180 s, 1 à 8 mots, FR/EN/latin, jusqu’à 6 joueurs" },
        { property: 'og:url', content: "https://wordus.xyz" },
        { property: 'og:image', content: "https://wordus.xyz/images/ogs/index.png" },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:alt', content: "Wordus.xyz OG image" },
        { property: 'og:image:type', content: 'image/png' },

        { name: "twitter:title", content: 'Wordus - Jeu de frappe multijoueur en temps réel' },
        { name: "twitter:description", content: 'Wordus.xyz — Tape plus vite que tes amis : 30 à 180 s, 1 à 8 mots, FR/EN/latin, jusqu’à 6 joueurs' },
        { name: "twitter:image", content: "https://wordus.xyz/images/ogs/index.png" },
        { name: "twitter:creator", content: "@hokanosekai" },
        { name: "twitter:site", content: "@hokanosekai" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    },
  },

  site: { url: "https://wordus.xyz", name: "Wordus.xyz" },

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "nuxt-toast",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-umami",
  ],

  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'fr',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'wordus-lang',
      redirectOn: 'root',
      fallbackLocale: 'fr'
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
    storageKey: 'wordus-theme'
  },

  toast: {
    settings: {
      rtl: true,
      position: "topRight",
      timeout: 3000,
      closeOnEscape: true,
      closeOnClick: true,
      pauseOnHover: true,
    },
  },

  robots: {
    groups: [
      {
        userAgent: "*",
        allow: ["/", "/join"],
        disallow: ["/game"],
      },
    ],
  },

  sitemap: {
    autoLastmod: true,
    discoverImages: true,
    discoverVideos: true,
    debug: false,
    exclude: ["/game"],
    include: ["/**", "/images/**"],
    urls: [
      {
        loc: "/",
        images: [
          {
            loc: "https://wordus.xyz/images/ogs/index.png",
            caption: "Wordus - Jeu de frappe multijoueur en temps réel",
            title: "Wordus.xyz",
            license: "https://github.com/corploc/wordus/blob/main/LICENSE",
          },
        ],
      },
      {
        loc: "/join",
        images: [
          {
            loc: "https://wordus.xyz/images/ogs/index.png",
            caption:
              "Wordus - Rejoindre une partie de frappe multijoueur en temps réel",
            title: "Wordus.xyz",
            license: "https://github.com/corploc/wordus/blob/main/LICENSE",
          },
        ],
      },
    ],
  },

  umami: {
    id: process.env.NUXT_UMAMI_WEBSITE_ID,
    host: process.env.NUXT_UMAMI_HOST || "https://cloud.umami.is",
    autoTrack: true,
  },

  runtimeConfig: {
    public: {
      baseURL: "http://localhost:3000",
    },
  },
});
