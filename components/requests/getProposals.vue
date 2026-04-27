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

const showDialog = ref(false)
const selectedProposalId = ref<string | null>(null)

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
    const response = await res.json()
    projectRequest.value = response.data
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

    const response = await res.json()
    const data = response.data
    proposals.value = data.items || []
    totalPages.value = data.totalPages || 1
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل العروض'
  } finally {
    loading.value = false
  }
}

const isRequestOwner = () => currentUser.value?.id === projectRequest.value?.creatorId

const openSelectDialog = (proposalId: string) => {
  selectedProposalId.value = proposalId
  showDialog.value = true
}

const confirmSelection = async () => {
  if (!selectedProposalId.value) return

  try {
    const headers = {
      Authorization: `Bearer ${token.value}`,
      'Content-Type': 'application/json',
    }

    await fetch(`${config.public.API_BASE_URL}/project-proposals/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id: selectedProposalId.value, newStatus: 2 }),
    })

    await fetch(`${config.public.API_BASE_URL}/project-requests/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id: postId, newStatus: 2 }),
    })

    showDialog.value = false
    await fetchProposals()
    await fetchRequest()
  } catch (err) {
    console.error('فشل التحديث', err)
  }
}

const navigateTo = (proposal: any) => {
  const isProposalOwner = proposal.creatorEmail === currentUser.value?.email
  const isReqOwner = projectRequest.value?.creatorId === currentUser.value?.id
  const isAcceptedProposal = proposal.statusValue === 2 || proposal.statusName?.toLowerCase() === 'accepted'

  if ((isProposalOwner || isReqOwner) && isAcceptedProposal) {
    router.push(`/replies/${proposal.id}`)
  }
}

watch(pageNumber, fetchProposals)

onMounted(async () => {
  await fetchCurrentUser()
  await fetchRequest()
  await fetchProposals()
  
  console.log('DEBUG: Current User ID:', currentUser.value?.id)
  console.log('DEBUG: Request Creator ID:', projectRequest.value?.creatorId)
  console.log('DEBUG: Project Status Name:', projectRequest.value?.statusName)
  console.log('DEBUG: Project Status Value:', projectRequest.value?.statusValue)
  console.log('DEBUG: Proposals:', proposals.value.map(p => ({ id: p.id, statusName: p.statusName, statusValue: p.statusValue })))
})

defineExpose({ fetchProposals })
</script>

<template>
  <div class="space-y-8">
    <div v-if="loading" class="space-y-6">
       <div v-for="i in 3" :key="i" class="h-32 bg-white/5 animate-pulse rounded-3xl border border-white/10"></div>
    </div>
    
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 font-bold text-center">
       {{ error }}
    </div>

    <div v-if="!loading && proposals.length === 0" class="text-center py-12 bg-white/5 rounded-[2.5rem] border border-white/10 border-dashed">
       <Icon name="ph:folder-open-bold" class="text-5xl text-slate-400 mb-3 opacity-20" />
       <p class="text-slate-400 font-bold">{{ $t('No proposals yet.') }}</p>
    </div>

    <div class="space-y-6">
      <div
        v-for="proposal in proposals"
        :key="proposal.id"
        @click="navigateTo(proposal)"
        class="group relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 cursor-pointer hover:bg-white/20 transition-all duration-500 shadow-xl overflow-hidden"
      >
        <div class="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div class="space-y-4 flex-1">
            <div class="flex items-center gap-3 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <Icon name="ph:identification-card-bold" class="text-lg text-indigo-500" />
              <span>ID: {{ proposal.creatorCommercialRegisterNumber || 'N/A' }}</span>
              <span class="opacity-30">•</span>
              <span>{{ new Date(proposal.createdAt).toLocaleDateString() }}</span>
            </div>
            
            <p class="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
              {{ proposal.content }}
            </p>

            <div class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-black">
               <Icon name="ph:money-bold" class="text-xl" />
               <span>{{ proposal.proposedAmount }} {{ $t('SAR') }}</span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-4">
            <!-- شارة الحالة: تظهر إذا كان العرض مقبولاً -->
            <div v-if="proposal.statusValue === 2 || proposal.statusName?.toLowerCase() === 'accepted'" class="flex items-center gap-2 px-6 py-2 rounded-full bg-green-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/20">
               <Icon name="ph:check-circle-fill" />
               {{ $t('Accepted') }}
            </div>
            
            <!-- زر المراسلة: يظهر فقط للعروض المقبولة -->
            <button
              v-if="(proposal.statusValue === 2 || proposal.statusName?.toLowerCase() === 'accepted') && isRequestOwner()"
              @click.stop="router.push(`/replies/${proposal.id}`)"
              class="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="ph:chat-circle-dots-bold" />
              {{ $t('Contact') }}
            </button>

            <!-- زر القبول: يظهر إذا كان العرض غير مقبول بعد والمستخدم هو صاحب الطلب -->
            <button
              v-if="isRequestOwner() && proposal.statusValue !== 2 && proposal.statusName?.toLowerCase() !== 'accepted'"
              @click.stop="openSelectDialog(proposal.id)"
              class="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="ph:check-bold" />
              {{ $t('Accept') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-4 pt-8">
      <button 
        class="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white disabled:opacity-30 hover:bg-indigo-600 transition-all shadow-xl" 
        :disabled="pageNumber === 1" 
        @click="pageNumber--"
      >
        <Icon name="ph:caret-left-bold" />
      </button>
      <button 
        class="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white disabled:opacity-30 hover:bg-indigo-600 transition-all shadow-xl" 
        :disabled="pageNumber === totalPages" 
        @click="pageNumber++"
      >
        <Icon name="ph:caret-right-bold" />
      </button>
    </div>

    <!-- Dialog -->
    <div v-if="showDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" @click="showDialog = false"></div>
      <div class="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-md w-full text-center space-y-8">
        <div class="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
           <Icon name="ph:question-bold" class="text-4xl" />
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-slate-900 dark:text-white italic">{{ $t('Confirm Selection') }}</h3>
          <p class="text-slate-500 dark:text-slate-400 font-medium">{{ $t('Are you sure you want to accept this proposal?') }}</p>
        </div>
        <div class="flex gap-4">
          <button
            class="flex-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-2xl font-black transition-all hover:bg-slate-200"
            @click="showDialog = false"
          >
            {{ $t('Cancel') }}
          </button>
          <button
            class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95"
            @click="confirmSelection"
          >
            {{ $t('Yes, Confirm') }}
          </button>
        </div>
      </div>
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
