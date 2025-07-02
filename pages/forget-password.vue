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
 <div  class="min-h-screen flex items-center justify-center">
   <div class="container mx-auto p-6 max-w-md">
        <p v-if="isError" class="text-red-500 mx-auto text-center">{{ message }}</p>

    <h1 class="text-2xl font-bold mb-4 text-center">{{ $t('Reset password') }}</h1>

    <label class="block text-sm font-medium mb-2">{{ $t('E-mail') }}</label>
    <input
      type="email"
      v-model="email"
      :placeholder="$t('E-mail')"
      class="input-text"
      :disabled="loading"
    />

<div class=" w-full flex">
        <button
      @click="sendEmail"
      class="btn-green mx-auto"
      :disabled="loading"
    >
      <span v-if="!loading" class="text-end">{{ $t('Send') }}</span>
      <span v-else>جاري الإرسال...</span>
    </button>
</div>


    <Dialog
      v-model:visible="showDialog"
      header="تم الإرسال"
      :closable="false"
      class="text-center"
      :style="$i18n.locale === 'ar' ? 'direction: rtl' : ''"
    >
      <p>تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني</p>
      <button
        @click="showDialog = false"
        class="btn-green w-full mt-4"
      >
        موافق
      </button>
    </Dialog>
  </div>
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
