// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/scripts', '@pinia/nuxt', '@nuxtjs/tailwindcss'],
  ssr: false,
  hooks: {
    'prerender:routes' ({ routes }) {
      routes.clear()
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || '',
      siteUrl: process.env.SITE_URL || '',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      tinymceApiKey: process.env.TINYMCE_API_KEY || ''
    }
  },
    app: {
    head: {
      title: 'Morrgana',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'E-commerce Admin Dashboard' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  }
})