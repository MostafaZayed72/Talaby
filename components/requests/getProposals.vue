<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useCurrentUser } from '~/composables/useCurrentUser'

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const route = useRoute()
const router = useRouter()

const postId = route.params.id as string

const proposals = ref<any[]>([])
const projectRequest = ref<any>(null)
const pageNumber = ref(1)
const pageSize = ref(5)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')
const currentUser = ref<any>(null)

const fetchCurrentUser = async () => {
  const { user } = await useCurrentUser()
  currentUser.value = user.value
}

const fetchRequest = async () => {
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${postId}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) throw new Error('فشل تحميل الطلب')

    projectRequest.value = await res.json()
  } catch (err: any) {
    console.error(err)
  }
}

const fetchProposals = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = new URL(`${config.public.API_BASE_URL}/project-requests/${postId}/proposals`)
    url.searchParams.set('pageNumber', pageNumber.value.toString())
    url.searchParams.set('pageSize', pageSize.value.toString())

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) throw new Error('فشل تحميل العروض')

    const data = await res.json()
    proposals.value = data.items
    totalPages.value = data.totalPages
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل العروض'
  } finally {
    loading.value = false
  }
}

const navigateTo = (proposal: any) => {
  const isProposalOwner = proposal.creatorEmail === currentUser.value?.email
  const isRequestOwner = projectRequest.value?.creatorId === currentUser.value?.id

  if (isProposalOwner || isRequestOwner) {
    router.push(`/replies/${proposal.id}`)
  } 
}
const canNavigate = (proposal: any) => {
  const isProposalOwner = proposal.creatorEmail === currentUser.value?.email
  const isRequestOwner = projectRequest.value?.creatorId === currentUser.value?.id
  return isProposalOwner || isRequestOwner
}

onMounted(async () => {
  await fetchCurrentUser()
  await fetchRequest()
  await fetchProposals()
})

watch(pageNumber, fetchProposals)
</script>


<template>
  <div class="mt-8">
    <h2 class="text-xl font-boldnpm mb-4 text-purple-950 dark:text-purple-400 mx-4">العروض :</h2>

    <div v-if="loading">جاري التحميل...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="!loading && proposals.length === 0" class="text-gray-400">
      لا توجد عروض بعد.
    </div>

    <div
  v-for="proposal in proposals"
  :key="proposal.id"
  :class="[
    'border rounded-lg p-4 mb-4 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800',
    canNavigate(proposal) ? 'cursor-pointer' : 'cursor-default'
  ]"
  @click="navigateTo(proposal)"
  style="border-color: #7733bc !important;"
>
      <div class="text-sm text-gray-500 mb-1">
        {{ '*********' + proposal.creatorCommercialRegisterNumber?.slice(-4) }} <span
          class="float-left text-xs text-gray-400">
          {{ new Date(proposal.createdAt).toLocaleString() }}
        </span>
      </div>
      <div class="text-base text-gray-800 dark:text-white mb-2">
        {{ proposal.content }}
      </div>
      <div class="text-sm font-bold text-purple-950 dark:text-purple-400">
        المبلغ المقترح: {{ proposal.proposedAmount }} {{ $t('SAR') }}
      </div>
      <div class="text-xs text-gray-500 mt-1">
        عدد الردود: {{ proposal.repliesCount }}
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center gap-4 mt-6">
      <button class="btn" :disabled="pageNumber === 1" @click="pageNumber--">
        السابق
      </button>
      <button class="btn" :disabled="pageNumber === totalPages" @click="pageNumber++">
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
