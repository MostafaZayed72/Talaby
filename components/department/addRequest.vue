<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const route = useRoute()
const { t } = useI18n()

const storeCategoryId = route.params.department

const showDialog = ref(false)
const loading = ref(false)
const success = ref(false)
const error = ref('')

const requestData = ref({
  title: '',
  description: '',
  imageUrl: '',
  minBudget: 0,
  maxBudget: 0
})

const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.public.CLOUDINARY_UPLOAD_PRESET)

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${config.public.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    )
    requestData.value.imageUrl = response.data.secure_url
  } catch (err) {
    error.value = t('Image upload failed.')
  }
}

const submitRequest = async () => {
  if (!storeCategoryId) {
    error.value = 'Category ID not found.'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await axios.post(`${config.public.API_BASE_URL}/project-requests`, {
      ...requestData.value,
      minBudget: 0,
      maxBudget: 0,
      storeCategoryId: storeCategoryId
    }, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    success.value = true
    showDialog.value = false

    requestData.value = {
      title: '',
      description: '',
      imageUrl: '',
      minBudget: 0,
      maxBudget: 0
    }

  } catch (err: any) {
    error.value = err?.response?.data?.message || t('An error occurred while submitting the request.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button class="btn" @click="showDialog = true">{{ t('Add New Request') }}</button>
    <!-- Dialog -->
    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ t('Add New Request') }}</h2>

        <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>
        <div v-if="success" class="text-green-600 mb-2">{{ t('Request submitted successfully.') }}</div>

        <div class="space-y-4">
          <div>
            <label class="block font-medium">{{ t('Request Title') }}</label>
            <input v-model="requestData.title" class="input" />
          </div>

          <div>
            <label class="block font-medium">{{ t('Description') }}</label>
            <textarea v-model="requestData.description" class="input" rows="3"></textarea>
          </div>

          <div>
            <label class="block font-medium">{{ t('Upload Image') }}</label>
            <input type="file" class="input" @change="handleFileChange" accept="image/*" />
            <div v-if="requestData.imageUrl" class="mt-2">
              <img :src="requestData.imageUrl" alt="Uploaded" class="w-32 h-32 object-cover rounded" />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button class="btn-cancel" @click="showDialog = false">{{ t('Cancel') }}</button>
          <button class="btn" :disabled="loading" @click="submitRequest">
            <span v-if="!loading">{{ t('Submit Request') }}</span>
            <span v-else class="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5 inline-block"></span>
          </button>
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
}
.btn {
  background-color: #4a3a6e;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: bold;
}
.btn:hover {
  background-color: #281750;
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
