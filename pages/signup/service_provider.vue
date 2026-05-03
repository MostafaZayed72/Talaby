<template>
  <div class="min-h-[calc(100vh-6rem)] relative flex items-start lg:items-center justify-center p-6 py-12 lg:py-6 overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-3xl">
      <!-- Signup Card -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl overflow-hidden">
        <div class="text-center mb-8 md:mb-10">
          <div class="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-yellow-400 rounded-2xl shadow-xl mb-4 md:mb-6">
            <Icon name="ph:briefcase-bold" class="text-2xl md:text-3xl text-violet-950" />
          </div>
          <h1 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
            {{ $t('Sign up as Store') }}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm md:text-base">
            {{ $t('Join our marketplace and reach thousands of customers.') }}
          </p>
        </div>

        <form @submit.prevent="registerStore" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Commercial Register Number -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Commercial Register Number') }}</label>
              <div class="relative group">
                <Icon name="ph:hash-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="commercialRegisterNumber" type="number" :placeholder="$t('Commercial Register Number')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white" />
              </div>
            </div>

            <!-- Trade Name -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Trade Name') }}</label>
              <div class="relative group">
                <Icon name="ph:storefront-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="firstName" :placeholder="$t('Trade Name')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white" />
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Email') }}</label>
              <div class="relative group">
                <Icon name="ph:envelope-simple-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="email" type="email" :placeholder="$t('Email')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white" />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Password') }}</label>
              <div class="relative group">
                <Icon name="ph:lock-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="password" type="password" :placeholder="$t('Password')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white" />
              </div>
            </div>

            <!-- Mobile -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Mobile Number') }}</label>
              <div class="relative group">
                <Icon name="ph:phone-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="mobile" :placeholder="$t('Mobile Number')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white" />
              </div>
            </div>

            <!-- City -->
            <div class="space-y-2 text-right">
              <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('City') }}</label>
              <div class="relative group">
                <Icon name="ph:map-pin-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="location" :placeholder="$t('City')" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white" />
              </div>
            </div>
          </div>

          <!-- Category Selection -->
          <div class="space-y-2 text-right">
            <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Select Store Category') }}</label>
            <div class="relative group">
              <Icon name="ph:grid-four-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select v-model="selectedCategoryId" class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl pl-12 pr-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white appearance-none">
                <option disabled value="">-- {{ $t('Select a category') }} --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ locale === 'ar' ? cat.nameAr : cat.nameEn }}
                </option>
              </select>
            </div>
          </div>

          <!-- Commercial Register Image Upload -->
          <div class="space-y-2 text-right">
            <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Commercial Register Image') }}</label>
            <div class="relative">
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-28 md:h-32 border-2 border-slate-200 dark:border-white/10 border-dashed rounded-xl md:rounded-2xl cursor-pointer bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all overflow-hidden relative">
                  <!-- Loading State -->
                  <div v-if="isUploadingImage" class="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-2">
                    <div class="animate-spin border-4 border-violet-600 border-t-transparent rounded-full w-8 h-8"></div>
                    <p class="text-[10px] font-black text-violet-600 uppercase tracking-widest">{{ $t('Image is being uploaded') }}</p>
                  </div>
                  
                  <div v-if="!commercialRegisterImageUrl && !isUploadingImage" class="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icon name="ph:cloud-arrow-up-bold" class="text-2xl md:text-3xl text-slate-400 mb-2" />
                    <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">{{ $t('Click to upload image') }}</p>
                  </div>
                  <div v-else-if="commercialRegisterImageUrl && !isUploadingImage" class="flex items-center gap-4 p-4">
                    <img :src="commercialRegisterImageUrl" class="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover" />
                    <span class="text-green-500 font-bold text-xs md:text-base flex items-center gap-2">
                      <Icon name="ph:check-circle-fill" />
                      {{ $t('Uploaded') }}
                    </span>
                  </div>
                  <input type="file" @change="handleImageUpload" accept="image/*" class="hidden" :disabled="isUploadingImage" />
                </label>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading || isUploadingImage"
            class="w-full bg-violet-800 hover:bg-violet-900 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <template v-if="!loading">
              {{ $t('Register Store') }}
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
          class="w-full bg-violet-800 hover:bg-violet-900 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          @click="goToHome"
        >
          {{ $t('Go to Dashboard') }}
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
    >
      <div class="p-6 md:p-8">
        <div class="max-h-[40vh] overflow-y-auto mb-8 pr-4 space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-indigo-500">
          <p class="font-bold text-slate-900 dark:text-white">{{ $t('By registering, you agree to our policies:') }}</p>
          <ul class="list-disc list-inside space-y-2">
            <li>{{ $t('Talaby acts as a mediator ensuring fair trade.') }}</li>
            <li>{{ $t('Stores must provide accurate information and services.') }}</li>
            <li>{{ $t('Personal and business data is handled with high security.') }}</li>
            <li>{{ $t('Compliance with local laws and platform regulations.') }}</li>
          </ul>
          <p>{{ $t('Please review our full Privacy Policy page for more details.') }}</p>
        </div>

        <div class="flex items-center gap-3 mb-8 p-4 bg-yellow-400/5 rounded-2xl border border-yellow-400/10">
          <input type="checkbox" v-model="agreeToTerms" id="terms-store" class="w-5 h-5 rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500" />
          <label for="terms-store" class="text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
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
            class="flex-1 bg-violet-800 hover:bg-violet-900 text-white font-black py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50"
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
const isDialogVisible = ref(false)
const showPolicyDialog = ref(false)
const agreeToTerms = ref(false)

const commercialRegisterNumber = ref('')
const firstName = ref('')
const email = ref('')
const password = ref('')
const mobile = ref('')
const location = ref('')
const selectedCategoryId = ref('')
const commercialImageFile = ref<File | null>(null)
const commercialRegisterImageUrl = ref('')
const categories = ref<any[]>([])
const countdown = ref(0)

const token = useLocalStorage('token', '')
const userID = useLocalStorage('userID', '')
const roles = useLocalStorage('roles', [])

const isUploadingImage = ref(false)

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  isUploadingImage.value = true
  const file = target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.public.CLOUDINARY_UPLOAD_PRESET)

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${config.public.CLOUDINARY_CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    commercialRegisterImageUrl.value = data.secure_url
  } catch (error) {
    toast.add({ severity: 'error', summary: locale.value === 'ar' ? 'خطأ' : 'Error', detail: locale.value === 'ar' ? 'فشل رفع الصورة' : 'Image upload failed' })
  } finally {
    isUploadingImage.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories?PageNumber=1&PageSize=100`)
    const response = await res.json()
    categories.value = response.data?.items || []
  } catch (error) {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل التصنيفات' })
  }
}

onMounted(() => {
  fetchCategories()
})

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

const registerStore = () => {
  if (!commercialRegisterNumber.value || !/^\d+$/.test(commercialRegisterNumber.value)) {
    toast.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى إدخال رقم سجل تجاري صحيح' })
    return
  }

  if (!commercialRegisterImageUrl.value) {
    toast.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى رفع صورة السجل التجاري' })
    return
  }

  if (!selectedCategoryId.value) {
    toast.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى اختيار تصنيف المتجر' })
    return
  }

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
    commercialRegisterNumber: String(commercialRegisterNumber.value).trim(),
    firstName: firstName.value.trim(),
    email: email.value.trim(),
    password: password.value,
    mobile: String(mobile.value).trim(),
    location: location.value.trim(),
    commercialRegisterImageUrl: commercialRegisterImageUrl.value,
    storeCategoryId: parseInt(selectedCategoryId.value)
  }

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/identity/register/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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

    toast.add({ severity: 'success', summary: 'تم التسجيل', detail: 'تم إرسال رابط التفعيل إلى البريد الإلكتروني' })

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
  router.push('/dashboard')
}

const resetForm = () => {
  commercialRegisterNumber.value = ''
  firstName.value = ''
  email.value = ''
  password.value = ''
  mobile.value = ''
  location.value = ''
  commercialRegisterImageUrl.value = ''
  selectedCategoryId.value = ''
}

definePageMeta({
  layout: 'login'
})
</script>
