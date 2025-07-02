<template>
  <div class="p-4 md:p-10 flex flex-col justify-center items-center my-auto h-screen">
    <div class="max-w-md mx-auto p-6 shadow-md rounded-lg my-auto" style="background-color: #4a3a6e;">
      <h1 class="text-2xl font-bold mb-6 text-center text-white">{{ $t('Login') }}</h1>

      <form @submit.prevent="loginUser" class="space-y-4">
        <InputText
          v-model="email"
          :placeholder="$t('E-mail')"
          type="email"
          required
          class="w-full bg-white py-1 rounded-xl px-4"
        />
        <InputText
          v-model="password"
:placeholder="$t('Password')"
          type="password"
          required
          class="w-full bg-white py-1 rounded-xl px-4"
        />

        <h1
          class="w-fit bg-green-300 hover:bg-green-400 delayed text-center text-black py-1 rounded-full mx-auto px-6 font-bold cursor-pointer"
          @click="loginUser"
        >
          {{ $t('Login') }}
        </h1>

        <h1 class="text-center text-white text-sm delayed underline cursor-pointer hover:text-blue-400"
            @click="navigateTo('/forget-password')">
          {{ $t('Forgot password?') }}
        </h1>

        <h1 class="text-center text-white text-sm">
          {{ $t("don't have an account?") }}
          <nuxtLink class="text-blue-300 hover:text-blue-400 delayed underline" to="/signup">
            {{ $t('Sign up now') }}
          </nuxtLink>
        </h1>
      </form>

      <Toast />
      <Loader v-if="loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'

definePageMeta({
  layout: 'login'
})

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

    // يفترض هنا إن الريسبونس يحتوي على هذه البيانات (عدّل حسب الاستجابة الحقيقية)
    const { token: newToken, userID: newUserID, roles: newRoles } = response.data

    token.value = newToken
    userID.value = newUserID
    roles.value = newRoles || []

    toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل الدخول بنجاح' })

    router.push('/')
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
