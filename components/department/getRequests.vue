<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const token = useLocalStorage('token', '')

// استخرج departmentId من الرابط وحوله لرقم
const departmentId = Number(route.params.department)

const requests = ref<any[]>([])
const pageNumber = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const searchPhrase = ref('')

const loading = ref(false)
const error = ref('')

const fetchRequests = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = new URL(`${config.public.API_BASE_URL}/project-requests`)
    url.searchParams.set('PageNumber', pageNumber.value.toString())
    url.searchParams.set('PageSize', pageSize.value.toString())
    if (searchPhrase.value) {
      url.searchParams.set('SearchPhrase', searchPhrase.value)
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('فشل في تحميل الطلبات')

    const data = await res.json()

    // فلترة الطلبات الخاصة بالقسم الحالي فقط
    requests.value = data.items.filter(
      (item: any) => item.storeCategoryId === departmentId
    )
    totalPages.value = data.totalPages
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل البيانات'
  } finally {
    loading.value = false
  }
}

// إعادة تحميل البيانات عند تغيير الصفحة أو البحث
watch([pageNumber, searchPhrase], fetchRequests)

onMounted(fetchRequests)

const goToRequest = (id: string) => {
  router.push(`/requests/${id}`)
}
</script>

<template>
  <div class="p-4">
    <input
      v-model="searchPhrase"
      class="input mb-4"
      placeholder="ابحث عن طلب..."
    />

    <div v-if="loading">جاري التحميل...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul v-if="requests.length" class="space-y-2">
      <li
        v-for="req in requests"
        :key="req.id"
        @click="goToRequest(req.id)"
        class="p-3 cursor-pointer border-b border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {{ req.title }}
      </li>
    </ul>

    <div v-if="totalPages > 1" class="mt-4 flex gap-2">
      <button
        :disabled="pageNumber === 1"
        @click="pageNumber--"
        class="btn"
      >
        السابق
      </button>
      <button
        :disabled="pageNumber === totalPages"
        @click="pageNumber++"
        class="btn"
      >
        التالي
      </button>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: fit;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}

.btn {
  background-color: #4a3a6e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
