<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'
import Dialog from 'primevue/dialog'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const email = ref('')
const token = ref('')

const newPassword = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const errorMsg = ref('')
const successDialog = ref(false)

onMounted(() => {
  email.value = route.query.email as string || ''
  token.value = route.query.token as string || ''
})

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'كلمتا المرور غير متطابقتين.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await axios.post(`${config.public.API_BASE_URL}/identity/reset-password`, {
      email: email.value,
      token: token.value,
      newPassword: newPassword.value
    })
    successDialog.value = true

    // تحويل تلقائي بعد 3 ثوانٍ
    setTimeout(() => {
      router.push('/login')
    }, 3000)

  } catch (error) {
    errorMsg.value = 'فشل في إعادة تعيين كلمة المرور. تحقق من صحة الرابط أو حاول مرة أخرى.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto max-w-md p-6 mt-24">
    <h1 class="text-2xl font-bold mb-6 text-center">إعادة تعيين كلمة المرور</h1>

    <div v-if="errorMsg" class="text-red-500 mb-4 text-center">{{ errorMsg }}</div>

    <label class="block mb-2 text-sm font-medium">كلمة المرور الجديدة</label>
    <input
      type="password"
      v-model="newPassword"
      class="input-text"
      placeholder="كلمة المرور الجديدة"
      :disabled="loading"
    />

    <label class="block mb-2 text-sm font-medium mt-4">تأكيد كلمة المرور</label>
    <input
      type="password"
      v-model="confirmPassword"
      class="input-text"
      placeholder="تأكيد كلمة المرور"
      :disabled="loading"
    />

    <button
      @click="resetPassword"
      class="btn-green mt-6 flex justify-center items-center gap-2"
      :disabled="loading"
    >
      <span v-if="!loading">تأكيد</span>
      <span v-else class="animate-spin border-2 border-t-transparent border-black rounded-full w-5 h-5"></span>
    </button>

    <Dialog
      v-model:visible="successDialog"
      header="تم التغيير"
      :closable="false"
      class="text-center"
    >
      <p>تم تعيين كلمة المرور بنجاح! سيتم تحويلك إلى صفحة تسجيل الدخول...</p>
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
  color: #000;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.btn-green:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-green:hover:enabled {
  background-color: #281750;
}
</style>
