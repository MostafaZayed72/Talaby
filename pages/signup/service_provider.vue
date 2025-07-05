<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <div class="max-w-md p-6 shadow-md rounded-lg bg-purple-300 mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center text-violet-600">
        {{ $t('Sign up new store') }}
      </h1>

      <form @submit.prevent="registerStore" class="space-y-4">
        <!-- رقم السجل التجاري -->
        <InputText
          v-model="commercialRegisterNumber"
          :placeholder="$t('Commercial Register Number')"
          required
          class="w-full bg-white"
            type="number"

        />

        <InputText v-model="firstName" :placeholder="$t('Trade Name')" required class="w-full bg-white" />
        <InputText v-model="email" :placeholder="$t('Email')" type="email" required class="w-full bg-white" />
        <InputText v-model="password" :placeholder="$t('Password')" type="password" required class="w-full bg-white" />
        <InputText v-model="mobile" :placeholder="$t('Mobile Number')" required class="w-full bg-white" />
        <InputText v-model="location" :placeholder="$t('City')" required class="w-full bg-white" />

        <div>
          <label class="block text-sm text-black mb-1">{{ $t('Commercial Register Image') }}</label>
          <input type="file" @change="handleImageUpload" accept="image/*" class="w-full bg-white p-1" />
        </div>

        <div>
          <label class="block text-sm text-black mb-1">{{ $t('Select Store Category') }}</label>
          <select v-model="selectedCategoryId" class="w-full bg-white p-2 rounded">
            <option disabled value="">-- {{ $t('Select a category') }} --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ `${cat.nameEn} / ${cat.nameAr}` }}
            </option>
          </select>
        </div>

        <Button
          type="submit"
          :label="loading ? $t('Sending...') : $t('Register')"

          class="w-full bg-purple-darken-2 text-white"
          :disabled="loading"
        />
      </form>

      <Toast />
      <Loader v-if="loading" />
      <Dialog
        v-model:visible="isDialogVisible"
        :header="$t('Registered Successfully')"
        modal
        :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr' }"
      >
        <p>{{ $t('A link has been sent to your email to confirm your account') }}</p>
        <Button class=" w-full" :label="$t('Ok')" @click="goToHome" />
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import axios from 'axios'

const { locale } = useI18n()
const config = useRuntimeConfig()
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const isDialogVisible = ref(false)

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

const token = useLocalStorage('token', '')
const userID = useLocalStorage('userID', '')
const roles = useLocalStorage('roles', [])

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

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
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل رفع الصورة' })
  }
}

const fetchCategories = async () => {
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories?PageNumber=1&PageSize=100`)
    const data = await res.json()
    categories.value = data.items
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

    const { token: newToken, userID: newUserID, roles: newRoles } = response.data

    token.value = newToken
    userID.value = newUserID
    roles.value = newRoles || []

    toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل الدخول بنجاح' })

  } catch (error: any) {
    const errorMsg =
      error.response?.data?.errors?.[Object.keys(error.response.data.errors)[0]]?.[0] ||
      error.response?.data?.title ||
      'حدث خطأ أثناء تسجيل الدخول'

    toast.add({ severity: 'error', summary: 'خطأ', detail: errorMsg })
    console.error('Login Error:', error)
  }
}

const registerStore = async () => {
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

  loading.value = true

  const payload = {
    commercialRegisterNumber: commercialRegisterNumber.value.trim(),
    firstName: firstName.value.trim(),
    email: email.value.trim(),
    password: password.value,
    mobile: mobile.value.trim(),
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
      if (res.status === 400 && data.errors) {
        for (const field in data.errors) {
          data.errors[field].forEach((msg: string) => {
            toast.add({ severity: 'error', summary: 'خطأ', detail: msg })
          })
        }
      } else {
        toast.add({ severity: 'error', summary: 'خطأ', detail: data.title || 'حدث خطأ غير متوقع' })
      }
      return
    }

    toast.add({ severity: 'success', summary: 'تم التسجيل', detail: 'تم إرسال رابط التفعيل إلى البريد الإلكتروني' })

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
