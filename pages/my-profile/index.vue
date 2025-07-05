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
  <div class="max-w-4xl text-white text-center mx-auto p-6 mt-12 bg-purple-700 dark:bg-purple-600 rounded-xl shadow">
    <h1 class="text-2xl font-bold mb-6 text-center">{{ t('My Profile') }}</h1>

    <div v-if="error" class="text-red-500 mb-4 text-center">{{ error }}</div>
    <div v-if="success" class="text-green-300 mb-4 text-center">{{ t('Profile updated successfully.') }}</div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-if="user.firstName">
        <label class="font-medium block mb-1">{{ t('First Name') }}:</label>
        <div v-if="editing">
          <input v-model="user.firstName" class="input" />
        </div>
        <div v-else>{{ user.firstName }}</div>
      </div>

      <div v-if="user.lastName">
        <label class="font-medium block mb-1">{{ t('Last Name') }}:</label>
        <div v-if="editing">
          <input v-model="user.lastName" class="input" />
        </div>
        <div v-else>{{ user.lastName }}</div>
      </div>

      <div v-if="user.mobile">
        <label class="font-medium block mb-1">{{ t('Mobile') }}:</label>
        <div v-if="editing">
          <input v-model="user.mobile" class="input" />
        </div>
        <div v-else>{{ user.mobile }}</div>
      </div>

      <div v-if="user.email">
        <label class="font-medium block mb-1">{{ t('Email') }}:</label>
        <div>{{ user.email }}</div>
      </div>

      <div v-if="user.location">
        <label class="font-medium block mb-1">{{ t('Location') }}:</label>
        <div v-if="editing">
          <input v-model="user.location" class="input" />
        </div>
        <div v-else>{{ user.location }}</div>
      </div>

      <div v-if="user.commercialRegisterNumber">
        <label class="font-medium block mb-1">{{ t('Commercial Register Number') }}:</label>
        <div v-if="editing">
          <input v-model="user.commercialRegisterNumber" class="input" />
        </div>
        <div v-else>{{ user.commercialRegisterNumber }}</div>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap justify-center gap-4">
      <button v-if="!editing" class="btn" @click="editing = true">{{ t('Edit') }}</button>

      <button v-else class="btn" :disabled="loading" @click="updateUser">
        <span v-if="!loading">{{ t('Save') }}</span>
        <span v-else class="animate-spin border-2 border-t-transparent border-white rounded-full w-5 h-5"></span>
      </button>

      <button v-if="editing" class="btn-cancel" @click="editing = false">{{ t('Cancel') }}</button>
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

