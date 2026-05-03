<template>
  <div class="min-h-[calc(100vh-6rem)] relative flex items-start lg:items-center justify-center p-6 py-12 lg:py-6 overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-2xl">
      <!-- Signup Card -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl">
        <div class="text-center mb-8 md:mb-10">
          <div class="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-indigo-600 rounded-2xl shadow-xl mb-4 md:mb-6">
            <Icon name="ph:user-plus-bold" class="text-2xl md:text-3xl text-white" />
          </div>
          <h1 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
            {{ $t('Create Client Account') }}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm md:text-base">
            {{ $t('Join our community and discover professional services.') }}
          </p>
        </div>

        <form @submit.prevent="registerClient" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('First Name') }}</label>
              <div class="relative">
                <input v-model="firstName" :placeholder="$t('First Name')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
            <!-- Last Name -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Last Name') }}</label>
              <div class="relative">
                <input v-model="lastName" :placeholder="$t('Last Name')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-2 text-right">
            <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Email') }}</label>
            <div class="relative group">
              <Icon name="ph:envelope-simple-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input v-model="email" :placeholder="$t('Email')" type="email" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2 text-right">
            <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Password') }}</label>
            <div class="relative group">
              <Icon name="ph:lock-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input v-model="password" :placeholder="$t('Password')" type="password" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mobile -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Mobile Number') }}</label>
              <div class="relative group">
                <Icon name="ph:phone-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="mobile" :placeholder="$t('Mobile Number')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>
            <!-- City -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('City') }}</label>
              <div class="relative group">
                <Icon name="ph:map-pin-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="location" :placeholder="$t('City')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
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
      :pt="{
        root: 'border-none bg-white dark:bg-slate-900',
        header: 'bg-white dark:bg-slate-900 border-none pt-8',
        content: 'bg-white dark:bg-slate-900 border-none'
      }"
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
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          @click="goToHome"
        >
          {{ $t('Explore Talaby') }}
          <span v-if="countdown > 0" class="text-xs opacity-70">({{ countdown }}s)</span>
        </button>
      </div>
    </Dialog>

    <!-- Privacy Policy Dialog -->
    <Dialog
      v-model:visible="showPolicyDialog"
      modal
      class="rounded-3xl overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900"
      :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr', width: '90vw', maxWidth: '600px' }"
      :header="$t('Privacy Policy & Terms')"
      :pt="{
        root: 'border-none bg-white dark:bg-slate-900',
        header: 'bg-white dark:bg-slate-900 border-none p-6 md:p-8 text-slate-900 dark:text-white font-black',
        content: 'bg-white dark:bg-slate-900 border-none'
      }"
    >
      <div class="p-6 md:p-8">
        <div class="max-h-[40vh] overflow-y-auto mb-8 pr-4 space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-indigo-500">
          <p class="font-bold text-slate-900 dark:text-white">{{ $t('By registering, you agree to our policies:') }}</p>
          <ul class="list-disc list-inside space-y-2">
            <li>{{ $t('We collect and use your data to facilitate orders.') }}</li>
            <li>{{ $t('We ensure the security of your personal information.') }}</li>
            <li>{{ $t('Talaby acts as a mediator between you and the stores.') }}</li>
            <li>{{ $t('You have the right to manage your data at any time.') }}</li>
          </ul>
          <p>{{ $t('Please review our full Privacy Policy page for more details.') }}</p>
        </div>

        <div class="flex items-center gap-3 mb-8 p-4 bg-indigo-600/5 rounded-2xl border border-indigo-600/10">
          <input type="checkbox" v-model="agreeToTerms" id="terms" class="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" />
          <label for="terms" class="text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
            {{ $t('I agree to the Privacy Policy and Terms of Use') }}
          </label>
        </div>

        <div class="flex gap-4">
          <button 
            class="flex-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
            @click="showPolicyDialog = false"
          >
            {{ $t('Cancel') }}
          </button>
          <button 
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50"
            :disabled="!agreeToTerms"
            @click="confirmRegistration"
          >
            {{ $t('Confirm & Register') }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
const { locale } = useI18n()
const config = useRuntimeConfig()
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const isUploadingImage = ref(false)
const isDialogVisible = ref(false)
const showPolicyDialog = ref(false)
const agreeToTerms = ref(false)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const mobile = ref('')
const location = ref('')
const countdown = ref(0)

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

    toast.add({ severity: 'success', summary: locale.value === 'ar' ? 'نجاح' : 'Success', detail: locale.value === 'ar' ? 'تم تسجيل الدخول تلقائياً' : 'Logged in automatically' })
  } catch (error: any) {
    console.error('Auto-login Error:', error)
  }
}

const registerClient = () => {
  showPolicyDialog.value = true
}

const confirmRegistration = async () => {
  if (!agreeToTerms.value) {
    toast.add({ severity: 'warn', summary: locale.value === 'ar' ? 'تنبيه' : 'Warning', detail: locale.value === 'ar' ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to the terms and conditions' })
    return
  }
  
  showPolicyDialog.value = false
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

    // Auto redirect after 3 seconds
    countdown.value = 3
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        if (isDialogVisible.value) {
          goToHome()
        }
      }
    }, 1000)
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
