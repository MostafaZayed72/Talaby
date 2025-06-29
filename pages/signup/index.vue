<template>
  <div class="min-h-screen flex items-center justify-center  p-6">
    <div class="bg-purple-300 rounded-2xl shadow-xl p-10 w-full max-w-md text-center space-y-6">
      <h1 class="text-2xl font-bold text-black mb-2">{{ $t('Choose the registration type') }}</h1>

      <NuxtLink to="/signup/client">
        <Button :label="$t('Register as a client')" class="w-full p-button-lg bg-blue text-white" />
      </NuxtLink>

      <NuxtLink to="/signup/service_provider" >
        <Button :label="$t('Register as a service provider')" class="w-full p-button-lg p-button-outlined bg-green-darken-3 mt-2 text-white" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// تأكد إن PrimeVue Button معرف
import Button from 'primevue/button'
</script>

<style scoped>
/* اختياري: ممكن تعدل الألوان حسب تصميمك */
</style>
