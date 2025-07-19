<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const token = useLocalStorage('token', '')

const loading = ref(false)
const errorMessage = ref('')
const showDialog = ref(false)
const projectRequestId = ref('')

// أخذ ID من URL
const proposalId = route.params.id as string

const cancelProposal = async () => {
  if (!confirm('هل أنت متأكد أنك تريد إلغاء الصفقة؟')) return

  loading.value = true
  errorMessage.value = ''
  showDialog.value = false

  try {
    // 1. إرسال طلب الإلغاء
    const patchRes = await fetch(`${config.public.API_BASE_URL}/project-proposals/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: proposalId,
        newStatus: 3,
      }),
    })

    if (!patchRes.ok) throw new Error('فشل في إرسال طلب الإلغاء')

    // 2. جلب projectRequestId من الردود
    const repliesRes = await fetch(
      `${config.public.API_BASE_URL}/project-proposals/${proposalId}/replies?pageNumber=1&pageSize=5`,
      {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      }
    )

    if (!repliesRes.ok) throw new Error('فشل في جلب بيانات الصفقة')

    const data = await repliesRes.json()
    projectRequestId.value = data.projectRequestId

    if (!projectRequestId.value) throw new Error('لم يتم العثور على معرف الطلب')

    // عرض Dialog النجاح
    showDialog.value = true

  } catch (err: any) {
    errorMessage.value = err.message || 'حدث خطأ أثناء الإلغاء.'
  } finally {
    loading.value = false
  }
}

const confirmRedirect = () => {
  router.push(`/requests/${projectRequestId.value}`)
}
</script>

<template>
  <div class="my-4">
    <button
      @click="cancelProposal"
      :disabled="loading"
      class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      <!-- أيقونة الحذف -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <span>{{ loading ? 'جاري الإلغاء...' : 'إلغاء الصفقة' }}</span>
    </button>

    <p v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</p>

    <!-- Dialog النجاح -->
    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
        <p class="mb-4 text-green-700 font-semibold">تم إلغاء الصفقة بنجاح</p>
        <button
          class="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
          @click="confirmRedirect"
        >
          موافق
        </button>
      </div>
    </div>
  </div>
</template>
