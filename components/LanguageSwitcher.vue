<template>
  <div class="language-switcher cursor-pointer" @click="toggleLanguage">
    <Icon name="mdi:web" class="text-2xl text-white transition-colors" />
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
