// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
   runtimeConfig: {
     public: {
      CLOUDINARY_CLOUD_NAME: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      API_BASE_URL: process.env.API_BASE_URL
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxt/icon',
    'nuxt-swiper',
    'vuetify-nuxt-module',
  ],
  primevue: {
    options: {
        theme: {
            preset: Aura
        }
    }
},
 i18n: {
  strategy: 'no_prefix',
  lazy: true,
  langDir: 'locales/',
  defaultLocale: 'ar',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
  },
  locales: [
    {
      code: 'ar',
      iso: 'ar-EG',
      name: 'Arabic',
      file: 'ar.json',
      dir: 'rtl', 
    },
    {
      code: 'en',
      iso: 'en-US',
      name: 'English',
      file: 'en.json',
      dir: 'ltr', 
    },
  ],
}

})