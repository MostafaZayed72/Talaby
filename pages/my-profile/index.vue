<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const config = useRuntimeConfig()
const { t } = useI18n()

const token = useLocalStorage('token', '')
const loading = ref(false)
const editing = ref(false)
const success = ref(false)
const error = ref('')

const user = ref({
  id: '',
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  location: '',
  commercialRegisterImageUrl: '',
  commercialRegisterNumber: '',
  storeCategoryId: null as number | null
})

const fetchUser = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${config.public.API_BASE_URL}/identity/users/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    user.value = res.data
  } catch (err) {
    error.value = t('Failed to fetch user data.')
  } finally {
    loading.value = false
  }
}

const updateUser = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  const payload = {
    id: user.value.id,
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    mobile: user.value.mobile,
    location: user.value.location,
    commercialRegisterImageUrl: user.value.commercialRegisterImageUrl || '',
    commercialRegisterNumber: user.value.commercialRegisterNumber || '',
    storeCategoryId: user.value.storeCategoryId 
  }

  try {
    await axios.patch(`${config.public.API_BASE_URL}/identity/users`, payload, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    success.value = true
    editing.value = false
  } catch (err: any) {
    error.value = t('Failed to update user info.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchUser)
</script>

<template>
  <div class="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <!-- Profile Card -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <!-- Header / Avatar Section -->
        <div class="relative h-48 bg-gradient-to-r from-indigo-600 to-violet-700 flex items-end justify-center pb-8">
          <div class="absolute -bottom-16">
            <div class="relative group">
              <div class="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
                <img 
                  :src="`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=128`" 
                  class="w-full h-full rounded-2xl object-cover"
                  alt="Avatar"
                />
              </div>
              <div class="absolute bottom-2 right-2 bg-yellow-400 w-8 h-8 rounded-xl flex items-center justify-center text-violet-950 shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                <Icon name="ph:camera-bold" />
              </div>
            </div>
          </div>
        </div>

        <div class="pt-20 pb-12 px-8 md:px-16 text-center">
          <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {{ user.firstName }} {{ user.lastName }}
          </h1>
          <p class="text-indigo-600 dark:text-indigo-400 font-bold mb-10">{{ t('Member Since 2024') }}</p>

          <div v-if="error" class="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center justify-center gap-3">
             <Icon name="ph:warning-circle-bold" class="text-xl" />
             {{ error }}
          </div>
          
          <div v-if="success" class="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold flex items-center justify-center gap-3">
             <Icon name="ph:check-circle-bold" class="text-xl" />
             {{ t('Profile updated successfully.') }}
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
            <!-- First Name -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest px-2">
                <Icon name="ph:user-bold" />
                {{ t('First Name') }}
              </label>
              <div v-if="editing" class="relative">
                <input v-model="user.firstName" class="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
              </div>
              <div v-else class="bg-slate-50 dark:bg-white/5 rounded-2xl px-6 py-4 font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-transparent">
                {{ user.firstName || '---' }}
              </div>
            </div>

            <!-- Last Name -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest px-2">
                <Icon name="ph:identification-card-bold" />
                {{ t('Last Name') }}
              </label>
              <div v-if="editing" class="relative">
                <input v-model="user.lastName" class="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
              </div>
              <div v-else class="bg-slate-50 dark:bg-white/5 rounded-2xl px-6 py-4 font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-transparent">
                {{ user.lastName || '---' }}
              </div>
            </div>

            <!-- Mobile -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest px-2">
                <Icon name="ph:phone-bold" />
                {{ t('Mobile') }}
              </label>
              <div v-if="editing" class="relative">
                <input v-model="user.mobile" class="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
              </div>
              <div v-else class="bg-slate-50 dark:bg-white/5 rounded-2xl px-6 py-4 font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-transparent">
                {{ user.mobile || '---' }}
              </div>
            </div>

            <!-- Email (Non-editable) -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest px-2">
                <Icon name="ph:envelope-simple-bold" />
                {{ t('Email') }}
              </label>
              <div class="bg-slate-50/50 dark:bg-white/5 rounded-2xl px-6 py-4 font-bold text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-transparent">
                {{ user.email }}
              </div>
            </div>

            <!-- Location -->
            <div class="space-y-2 md:col-span-2">
              <label class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest px-2">
                <Icon name="ph:map-pin-bold" />
                {{ t('Location') }}
              </label>
              <div v-if="editing" class="relative">
                <input v-model="user.location" class="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
              </div>
              <div v-else class="bg-slate-50 dark:bg-white/5 rounded-2xl px-6 py-4 font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-transparent text-right">
                {{ user.location || '---' }}
              </div>
            </div>

            <!-- Commercial Register (Conditional) -->
            <div v-if="user.commercialRegisterNumber || editing" class="space-y-2 md:col-span-2">
              <label class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest px-2">
                <Icon name="ph:article-bold" />
                {{ t('Commercial Register Number') }}
              </label>
              <div v-if="editing" class="relative">
                <input v-model="user.commercialRegisterNumber" class="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
              </div>
              <div v-else class="bg-slate-50 dark:bg-white/5 rounded-2xl px-6 py-4 font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-transparent">
                {{ user.commercialRegisterNumber }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-12 flex flex-wrap justify-center gap-6">
            <button 
              v-if="!editing" 
              class="group relative bg-indigo-600 hover:bg-indigo-700 text-white font-black px-12 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-2xl active:scale-95 flex items-center gap-3"
              @click="editing = true"
            >
              <Icon name="ph:pencil-simple-line-bold" class="text-xl" />
              {{ t('Edit Profile') }}
            </button>

            <button 
              v-else 
              class="group relative bg-green-600 hover:bg-green-700 text-white font-black px-12 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-2xl active:scale-95 flex items-center gap-3"
              :disabled="loading" 
              @click="updateUser"
            >
              <template v-if="!loading">
                <Icon name="ph:check-bold" class="text-xl" />
                {{ t('Save Changes') }}
              </template>
              <span v-else class="animate-spin border-3 border-t-transparent border-white rounded-full w-6 h-6"></span>
            </button>

            <button 
              v-if="editing" 
              class="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-black px-12 py-5 rounded-2xl hover:bg-slate-300 dark:hover:bg-white/20 transition-all active:scale-95 flex items-center gap-3"
              @click="editing = false"
            >
              {{ t('Cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  color: white;
}

.btn {
  background-color: #4a3a6e;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: bold;
  transition: background-color 0.2s;
}
.btn:hover {
  background-color: #281750;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #e5e7eb;
  color: #111827;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: bold;
}
.btn-cancel:hover {
  background-color: #d1d5db;
}
</style>

