<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const token = useLocalStorage('token', '')

const postId = route.params.id as string

const post = ref<null | {
  title: string
  description: string
  minBudget: number
  maxBudget: number
}>(null)

const loading = ref(true)
const error = ref('')

const fetchPostDetails = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${postId}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('فشل في تحميل تفاصيل الطلب')

    const data = await res.json()
    post.value = data
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل البيانات'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPostDetails)
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto text-center">
    <div v-if="loading">جاري التحميل...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="post" class="space-y-4">
      <h1 class="text-2xl font-bold bg-purple-950 rounded-full p-2 mx-auto text-center text-white">{{ post.title }}</h1>

      <div class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {{ post.description }}
      </div>

      <div class="text-sm text-white mt-4 bg-purple-950 rounded-full p-2 w-fit mx-auto">
        الميزانية: من
        <span class="font-semibold">{{ post.minBudget }}</span>
        إلى
        <span class="font-semibold">{{ post.maxBudget }}</span>
       {{ $t('Sar') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
