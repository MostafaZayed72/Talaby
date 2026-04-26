<template>
  <div 
    class="flex items-center justify-center p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer group" 
    @click="toggleLanguage"
  >
    <Icon name="mdi:web" class="text-2xl text-white transition-transform group-hover:scale-110" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useCookie } from '#app'

const { locale } = useI18n()

const toggleLanguage = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  const langCookie = useCookie('i18n_redirected')
  langCookie.value = newLocale
  locale.value = newLocale
  
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
}
</style>
