<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
    <Icon name="ph:circle-notch-bold" class="text-4xl text-indigo-600 animate-spin" />
  </div>
  <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-red-500 text-center">
    <Icon name="ph:warning-circle-bold" class="text-4xl mb-4" />
    <p class="font-black italic text-xl uppercase">{{ error }}</p>
    <button @click="fetchData" class="mt-6 px-8 py-3 bg-red-500 text-white rounded-2xl font-bold">{{ $t('Retry') }}</button>
  </div>
  <DashboardAdminView v-else-if="dashboardData" :data="dashboardData" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const loading = ref(true)
const error = ref(null)
const dashboardData = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/dashboard/admin`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (!res.ok) throw new Error('Failed to fetch dashboard data')
    const response = await res.json()
    dashboardData.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
