<template>
  <div class="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/30 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <div class="relative z-10 w-full max-w-md">
      <!-- Login Card -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-3xl shadow-xl mb-6 transform -rotate-6">
            <Icon name="ph:lock-key-fill" class="text-4xl text-violet-950" />
          </div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
            {{ $t('Welcome Back') }}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {{ $t('Login to your account') }}
          </p>
        </div>

        <form @submit.prevent="loginUser" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2 text-right">
            <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">
              {{ $t('E-mail') }}
            </label>
            <div class="relative group">
              <Icon name="ph:envelope-simple-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                v-model="email" 
                type="email" 
                :placeholder="$t('Enter your email')"
                class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2 text-right">
            <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">
              {{ $t('Password') }}
            </label>
            <div class="relative group">
              <Icon name="ph:lock-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                v-model="password" 
                type="password" 
                :placeholder="$t('Enter your password')"
                class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div class="text-right">
            <button 
              type="button"
              @click="navigateTo('/forget-password')"
              class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {{ $t('Forgot password?') }}
            </button>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <template v-if="!loading">
              {{ $t('Login') }}
              <Icon name="ph:arrow-right-bold" />
            </template>
            <span v-else class="animate-spin border-3 border-t-transparent border-white rounded-full w-6 h-6"></span>
          </button>

          <!-- Sign Up Link -->
          <p class="text-center text-slate-500 dark:text-slate-400 font-medium">
            {{ $t("don't have an account?") }}
            <NuxtLink to="/signup" class="text-indigo-600 dark:text-indigo-400 font-black hover:underline px-1">
              {{ $t('Sign up now') }}
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
    
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'


const { t } = useI18n()
const config = useRuntimeConfig()
const email = ref('')
const password = ref('')
const loading = ref(false)
const toast = useToast()
const router = useRouter()

const token = useLocalStorage('token', '')
const userID = useLocalStorage('userID', '')
const roles = useLocalStorage('roles', [])

const loginUser = async () => {
  loading.value = true

  try {
    const response = await axios.post(`${config.public.API_BASE_URL}/identity/login`, {
      email: email.value,
      password: password.value
    })

    // Extract data from the new response structure (response.data.data)
    const userData = response.data.data
    const { token: newToken, roles: newRoles, userTypeName, userTypeValue } = userData

    token.value = newToken
    userID.value = userData.userID || userData.id || '' // Handle different ID keys if necessary
    roles.value = newRoles || []

    toast.add({ severity: 'success', summary: t('Success'), detail: t('Login successful') })

    // Redirect based on role or type
    if (newRoles?.includes('Admin') || userTypeName === 'Admin' || userTypeValue === 1) {
      router.push('/admin/departments')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.errors?.[Object.keys(error.response.data.errors)[0]]?.[0] ||
      error.response?.data?.title ||
      'حدث خطأ أثناء تسجيل الدخول'

    toast.add({ severity: 'error', summary: 'خطأ', detail: errorMsg })
    console.error('Login Error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input {
  color: black !important;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
