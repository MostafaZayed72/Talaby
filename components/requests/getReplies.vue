<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const route = useRoute()

const proposalId = route.params.id as string

const replies = ref<any[]>([])
const pageNumber = ref(1)
const pageSize = ref(5)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

const fetchReplies = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = new URL(`${config.public.API_BASE_URL}/project-proposals/${proposalId}/replies`)
    url.searchParams.set('pageNumber', pageNumber.value.toString())
    url.searchParams.set('pageSize', pageSize.value.toString())

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('فشل تحميل الردود')

    const data = await res.json()
    replies.value = data.items
    totalPages.value = data.totalPages
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل الردود'
  } finally {
    loading.value = false
  }
}

onMounted(fetchReplies)
watch(pageNumber, fetchReplies)
</script>

<template>
  <div class="mt-6 px-2">
    <h2 class="text-xl font-bold mb-4 text-purple-600">الردود على العرض:</h2>

    <div v-if="loading">جاري التحميل...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-if="!loading && replies.length === 0" class="text-gray-500">لا توجد ردود بعد.</div>

    <div v-for="reply in replies" :key="reply.id" class="border rounded p-4 mb-4 shadow-sm" style="border-color: #7733bc !important;"> 
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {{ reply.creatorEmail }}
        <span class="float-left text-xs text-gray-400">
          {{ new Date(reply.createdAt).toLocaleString() }}
        </span>
      </div>
      <div class="text-base text-gray-800 dark:text-white">
        {{ reply.content }}
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center gap-4 mt-6">
      <button
        class="btn"
        :disabled="pageNumber === 1"
        @click="pageNumber--"
      >
        السابق
      </button>
      <button
        class="btn"
        :disabled="pageNumber === totalPages"
        @click="pageNumber++"
      >
        التالي
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn {
  background-color: #4a3a6e;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 0.375rem;
}
.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
