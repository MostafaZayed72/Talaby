<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <div class="max-w-md p-6 shadow-md rounded-lg bg-purple-300">
      <h1 class="text-2xl font-bold mb-6 text-center text-violet-600">
        {{ $t('Sign up new client') }}
      </h1>

      <form @submit.prevent="registerClient" class="space-y-4">
        <InputText v-model="firstName" :placeholder="$t('First Name')" required class="w-full bg-white" />
        <InputText v-model="lastName" :placeholder="$t('Last Name')" required class="w-full bg-white" />
        <InputText v-model="email" :placeholder="$t('Email')" type="email" required class="w-full bg-white" />
        <InputText v-model="password" :placeholder="$t('Password')" type="password" required class="w-full bg-white" />
        <InputText v-model="mobile" :placeholder="$t('Mobile Number')" required class="w-full bg-white" />
        <InputText v-model="location" :placeholder="$t('City')" required class="w-full bg-white" />

        <Button type="submit" label="تسجيل" class="w-full bg-purple-darken-2 text-white" />
      </form>

      <Toast />
      <Loader v-if="loading" />
      <Dialog v-model:visible="isDialogVisible" :header="$t('Registered Successfully')" modal :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr' }">
        <p>{{ $t('A link has been sent to your email to confirm your account') }}</p>
        <Button :label="$t('Ok')" @click="goToHome" />
      </Dialog>
    </div>
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
const isDialogVisible = ref(false)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const mobile = ref('')
const location = ref('')

// Local Storage for login
const token = useLocalStorage('token', '')
const userID = useLocalStorage('userID', '')
const roles = useLocalStorage('roles', [])

// تسجيل حساب جديد
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
      if (res.status === 400 && data.errors) {
        for (const field in data.errors) {
          const messages = data.errors[field]
          messages.forEach((msg: string) => {
            toast.add({ severity: 'error', summary: 'error', detail: msg })
          })
        }
      } else {
        toast.add({
          severity: 'error',
          summary: 'خطأ في التسجيل',
          detail: data.title || 'حدث خطأ غير متوقع'
        })
      }
      return
    }

    toast.add({
      severity: 'success',
      summary: 'تم التسجيل',
      detail: 'تم إرسال رابط التفعيل للبريد الإلكتروني'
    })

    // تسجيل دخول أوتوماتيك بعد النجاح
    await loginUser(email.value, password.value)

    resetForm()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'خطأ داخلي', detail: 'تحقق من الاتصال بالخادم' })
    console.error('Request failed:', err)
  } finally {
    loading.value = false
  }
}

// تسجيل الدخول مباشرة بعد التسجيل
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

    toast.add({
      severity: 'success',
      summary: 'نجاح',
      detail: 'تم تسجيل الدخول بنجاح'
    })

    router.push('/')
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.errors?.[Object.keys(error.response.data.errors)[0]]?.[0] ||
      error.response?.data?.title ||
      'حدث خطأ أثناء تسجيل الدخول'

    toast.add({ severity: 'error', summary: 'خطأ', detail: errorMsg })
    console.error('Login Error:', error)
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
