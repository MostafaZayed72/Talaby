<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import Dialog from 'primevue/dialog'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const email = ref('')
const showDialog = ref(false)
const isError = ref(false)
const message = ref('')
const loading = ref(false)

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const sendEmail = async () => {
  isError.value = false
  message.value = ''

  if (!email.value || !validateEmail(email.value)) {
    isError.value = true
    message.value = 'يرجى إدخال بريد إلكتروني صحيح.'
    return
  }

  loading.value = true

  try {
    await axios.post(`${config.public.API_BASE_URL}/identity/forgot-password`, {
      email: email.value
    })
    showDialog.value = true
  } catch (error) {
    isError.value = true
    message.value = 'حدث خطأ أثناء إرسال البريد. تأكد من صحة البيانات.'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-md">
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-xl mb-6">
            <Icon name="ph:key-bold" class="text-4xl text-white" />
          </div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight italic">
            {{ $t('Reset Password') }}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            {{ $t('Enter your email to receive a password reset link.') }}
          </p>
        </div>

        <div v-if="isError" class="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-center">
          {{ message }}
        </div>

        <form @submit.prevent="sendEmail" class="space-y-6">
          <div class="space-y-2 text-right">
            <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Email') }}</label>
            <div class="relative group">
              <Icon name="ph:envelope-simple-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                v-model="email" 
                type="email" 
                :placeholder="$t('Enter your email')"
                class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                required
                :disabled="loading"
              />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <template v-if="!loading">
              {{ $t('Send Reset Link') }}
              <Icon name="ph:paper-plane-tilt-bold" />
            </template>
            <span v-else class="animate-spin border-3 border-t-transparent border-white rounded-full w-6 h-6"></span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <NuxtLink to="/login" class="text-indigo-600 dark:text-indigo-400 font-black hover:underline px-1 flex items-center justify-center gap-2">
            <Icon name="ph:arrow-left-bold" />
            {{ $t('Back to Login') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="showDialog"
      modal
      :closable="false"
      class="rounded-3xl overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900"
      :style="{ direction: $i18n.locale === 'ar' ? 'rtl' : 'ltr', width: '90vw', maxWidth: '400px' }"
    >
      <div class="text-center p-8">
        <div class="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="ph:check-circle-bold" class="text-5xl" />
        </div>
        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ $t('Email Sent') }}</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          {{ $t('We have sent a password reset link to your email.') }}
        </p>
        <button 
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95"
          @click="showDialog = false; navigateTo('/login')"
        >
          {{ $t('Ok') }}
        </button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.input-text {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.btn-green {
  background-color: #4a3a6e;
  transition: background-color 0.2s;
  text-align: center;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
}

.btn-green:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-green:hover:enabled {
  background-color: #281750;
}
</style>
