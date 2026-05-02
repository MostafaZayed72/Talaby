<template>
  <div class="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-2xl">
      <!-- Signup Card -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl mb-6">
            <Icon name="ph:user-plus-bold" class="text-3xl text-white" />
          </div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
            {{ $t('Create Client Account') }}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {{ $t('Join our community and discover professional services.') }}
          </p>
        </div>

        <form @submit.prevent="registerClient" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div class="space-y-2 text-right">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('First Name') }}</label>
              <div class="relative">
                <input v-model="firstName" :placeholder="$t('First Name')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
            <!-- Last Name -->
            <div class="space-y-2 text-right">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Last Name') }}</label>
              <div class="relative">
                <input v-model="lastName" :placeholder="$t('Last Name')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-2 text-right">
            <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Email') }}</label>
            <div class="relative group">
              <Icon name="ph:envelope-simple-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input v-model="email" :placeholder="$t('Email')" type="email" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2 text-right">
            <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Password') }}</label>
            <div class="relative group">
              <Icon name="ph:lock-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input v-model="password" :placeholder="$t('Password')" type="password" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mobile -->
            <div class="space-y-2 text-right">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Mobile Number') }}</label>
              <div class="relative group">
                <Icon name="ph:phone-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="mobile" :placeholder="$t('Mobile Number')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
            <!-- City -->
            <div class="space-y-2 text-right">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('City') }}</label>
              <div class="relative group">
                <Icon name="ph:map-pin-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="location" :placeholder="$t('City')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <template v-if="!loading">
              {{ $t('Register Account') }}
              <Icon name="ph:rocket-launch-bold" />
            </template>
            <span v-else class="animate-spin border-3 border-t-transparent border-white rounded-full w-6 h-6"></span>
          </button>
        </form>

        <p class="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium">
          {{ $t('already_have_account') }}
          <NuxtLink to="/login" class="text-indigo-600 dark:text-indigo-400 font-black hover:underline px-1">
            {{ $t('login_now') }}
          </NuxtLink>
        </p>
      </div>
    </div>

    <Toast />
    
    <!-- Modern Dialog for success -->
    <Dialog
      v-model:visible="isDialogVisible"
      modal
      :closable="false"
      class="rounded-3xl overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900"
      :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr', width: '90vw', maxWidth: '450px' }"
    >
      <div class="text-center p-8">
        <div class="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="ph:check-circle-bold" class="text-5xl" />
        </div>
        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ $t('Registered Successfully') }}</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          {{ $t('A link has been sent to your email to confirm your account') }}
        </p>
        <button 
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95"
          @click="goToHome"
        >
          {{ $t('Explore Talaby') }}
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import axios from 'axios'

const { locale } = useI18n()
const config = useRuntimeConfig()
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const isUploadingImage = ref(false)
const isDialogVisible = ref(false)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const mobile = ref('')
const location = ref('')

const token = useLocalStorage('token', '')
const userID = useLocalStorage('userID', '')
const roles = useLocalStorage('roles', [])

const loginUser = async (userEmail: string, userPassword: string) => {
  try {
    const response = await axios.post(`${config.public.API_BASE_URL}/identity/login`, {
      email: userEmail,
      password: userPassword
    })

    const userData = response.data.data
    const { token: newToken, roles: newRoles } = userData

    token.value = newToken
    userID.value = userData.userID || userData.id || ''
    roles.value = newRoles || []

    toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل الدخول بنجاح' })
  } catch (error: any) {
    const data = error.response?.data
    if (data?.errors && Array.isArray(data.errors)) {
      data.errors.forEach((err: any) => {
        toast.add({ severity: 'error', summary: 'خطأ', detail: err.message })
      })
    } else {
      const errorMsg = data?.message || data?.title || 'حدث خطأ أثناء تسجيل الدخول'
      toast.add({ severity: 'error', summary: 'خطأ', detail: errorMsg })
    }
    console.error('Login Error:', error)
  }
}

const registerClient = async () => {
  loading.value = true

  const payload = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    password: password.value,
    mobile: mobile.value.trim(),
    location: location.value.trim()
  }

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/identity/register/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) {
      if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach((err: any) => {
          toast.add({ severity: 'error', summary: 'خطأ', detail: err.message })
        })
      } else {
        toast.add({ severity: 'error', summary: 'خطأ', detail: data.message || data.title || 'حدث خطأ غير متوقع' })
      }
      return
    }

    toast.add({ severity: 'success', summary: 'تم التسجيل', detail: 'تم إرسال رابط التفعيل إلى بريدك الإلكتروني' })

    await loginUser(email.value, password.value)

    isDialogVisible.value = true
    resetForm()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'خطأ داخلي', detail: 'تحقق من الاتصال بالخادم' })
    console.error(err)
  } finally {
    loading.value = false
  }
}

const goToHome = () => {
  isDialogVisible.value = false
  router.push('/')
}

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  password.value = ''
  mobile.value = ''
  location.value = ''
}

definePageMeta({
  layout: 'login'
})
</script>
