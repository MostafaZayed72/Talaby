<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 font-sans">
    <div class="max-w-7xl mx-auto space-y-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter flex items-center gap-4">
            <Icon name="ph:shield-warning-fill" class="text-red-500 animate-pulse" />
            {{ $t('Policy Violations') }}
          </h1>
          <p class="text-slate-500 font-bold mt-2">{{ $t('Manage and review user violations and account status.') }}</p>
        </div>
      </div>

      <!-- Filters & Stats Summary -->
      <div class="flex flex-col lg:flex-row items-stretch gap-6">
         <!-- Small Stats Card -->
         <div class="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-600/20 flex flex-row lg:flex-col justify-between items-center lg:items-start min-w-[200px]">
            <p class="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">{{ $t('Total Violations') }}</p>
            <p class="text-3xl font-black text-white italic leading-none">{{ totalItemsCount }}</p>
         </div>

         <!-- Search & Filter Bar -->
         <div class="flex-1 bg-white dark:bg-slate-900 px-6 py-3 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-center gap-4">
            <div class="flex-1 flex items-center gap-4 w-full">
              <Icon name="ph:magnifying-glass-bold" class="text-xl text-slate-400" />
              <input 
                v-model="filters.UserId" 
                @input="debounceSearch"
                type="text" 
                :placeholder="$t('Search by User ID...')"
                class="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-900 dark:text-white"
              >
            </div>
            
            <div class="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

            <div class="flex items-center gap-3 w-full md:w-auto">
               <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{{ $t('Status') }}:</span>
               <select v-model="filters.ReviewStatus" @change="fetchData" class="flex-1 md:flex-none bg-slate-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all">
                  <option value="">{{ $t('All Statuses') }}</option>
                  <option value="PendingReview">{{ $t('Pending Review') }}</option>
                  <option value="Confirmed">{{ $t('Confirmed') }}</option>
                  <option value="Waived">{{ $t('Waived') }}</option>
               </select>
            </div>
         </div>
      </div>

      <!-- Table -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-right" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                <th class="px-8 py-6">{{ $t('User') }}</th>
                <th class="px-8 py-6">{{ $t('Violation Reason') }}</th>
                <th class="px-8 py-6 text-center">{{ $t('Status') }}</th>
                <th class="px-8 py-6 text-center">{{ $t('Date') }}</th>
                <th class="px-8 py-6 text-center">{{ $t('Actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                <td colspan="5" class="px-8 py-6">
                  <div class="h-12 bg-slate-100 dark:bg-white/5 rounded-2xl w-full"></div>
                </td>
              </tr>
              <template v-else>
                <tr v-for="item in items" :key="item.id" class="hover:bg-white/5 transition-all group">
                  <td class="px-8 py-6">
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-slate-900 dark:text-white">{{ item.userName || 'Unknown User' }}</span>
                      <span class="text-[10px] text-slate-500 font-bold uppercase">{{ item.userId }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <p class="text-xs font-bold text-slate-600 dark:text-slate-300 line-clamp-1 max-w-[250px]">{{ item.reason }}</p>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <span :class="statusClass(item.reviewStatus)">
                      {{ $t(item.reviewStatus) }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <span class="text-xs font-bold text-slate-500">{{ new Date(item.createdAt).toLocaleDateString() }}</span>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <button 
                      @click="openReviewModal(item)"
                      class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95"
                    >
                      {{ $t('Review') }}
                    </button>
                  </td>
                </tr>
              </template>
              <tr v-if="!loading && items.length === 0">
                <td colspan="5" class="px-8 py-20 text-center">
                   <div class="flex flex-col items-center gap-4 opacity-30">
                      <Icon name="ph:shield-check-bold" class="text-6xl" />
                      <p class="text-xl font-black uppercase italic">{{ $t('No violations found') }}</p>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-8 border-t border-white/10 flex justify-center gap-4">
           <button @click="prevPage" :disabled="filters.PageNumber === 1" class="p-4 bg-white/5 rounded-2xl disabled:opacity-30 hover:bg-indigo-600 transition-all">
              <Icon :name="locale === 'ar' ? 'ph:caret-right-bold' : 'ph:caret-left-bold'" />
           </button>
           <button @click="nextPage" :disabled="filters.PageNumber === totalPages" class="p-4 bg-white/5 rounded-2xl disabled:opacity-30 hover:bg-indigo-600 transition-all">
              <Icon :name="locale === 'ar' ? 'ph:caret-left-bold' : 'ph:caret-right-bold'" />
           </button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" @click="showModal = false"></div>
      <div class="relative bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-white/10 max-w-lg w-full space-y-8 animate-fade-in">
        <div class="flex items-center gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
          <div class="w-16 h-16 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
             <Icon name="ph:gavel-bold" class="text-3xl" />
          </div>
          <div>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">{{ $t('Review Violation') }}</h3>
            <p class="text-slate-500 font-bold text-xs uppercase tracking-widest">{{ $t('Taking action on user account') }}</p>
          </div>
        </div>

        <div class="space-y-6">
           <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('Action to Take') }}</label>
              <div class="grid grid-cols-2 gap-4">
                 <button 
                   @click="reviewForm.reviewStatus = 'Confirmed'"
                   :class="[reviewForm.reviewStatus === 'Confirmed' ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500']"
                   class="p-4 rounded-2xl font-black transition-all flex flex-col items-center gap-2 shadow-lg"
                 >
                    <Icon name="ph:prohibit-bold" class="text-2xl" />
                    {{ $t('Confirm & Ban') }}
                 </button>
                 <button 
                   @click="reviewForm.reviewStatus = 'Waived'"
                   :class="[reviewForm.reviewStatus === 'Waived' ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500']"
                   class="p-4 rounded-2xl font-black transition-all flex flex-col items-center gap-2 shadow-lg"
                 >
                    <Icon name="ph:check-circle-bold" class="text-2xl" />
                    {{ $t('Waive & Activate') }}
                 </button>
              </div>
           </div>

           <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('Review Note') }}</label>
              <textarea 
                v-model="reviewForm.reviewNote"
                :placeholder="$t('Add a note explaining your decision...')"
                class="w-full h-32 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all resize-none"
              ></textarea>
           </div>
        </div>

        <div class="flex gap-4 pt-4">
          <button @click="showModal = false" class="flex-1 px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-black transition-all hover:bg-slate-200">
            {{ $t('Cancel') }}
          </button>
          <button 
            @click="submitReview"
            :disabled="submitting || !reviewForm.reviewStatus"
            class="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Icon v-if="submitting" name="ph:circle-notch-bold" class="animate-spin" />
            {{ $t('Submit Decision') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const config = useRuntimeConfig()
const { locale, t } = useI18n()
const token = useLocalStorage('token', '')

const loading = ref(true)
const submitting = ref(false)
const items = ref([])
const totalItemsCount = ref(0)
const totalPages = ref(0)
const showModal = ref(false)
const selectedViolation = ref(null)

const filters = reactive({
  UserId: '',
  ReviewStatus: '',
  PageNumber: 1,
  PageSize: 10
})

const reviewForm = reactive({
  reviewStatus: '',
  reviewNote: ''
})

const fetchData = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.UserId) params.append('UserId', filters.UserId)
    if (filters.ReviewStatus) params.append('ReviewStatus', filters.ReviewStatus)
    params.append('PageNumber', filters.PageNumber)
    params.append('PageSize', filters.PageSize)

    const res = await fetch(`${config.public.API_BASE_URL}/admin/policy-violations?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    const response = await res.json()
    items.value = response.data.items
    totalItemsCount.value = response.data.totalItemsCount
    totalPages.value = response.data.totalPages
  } catch (err) {
    console.error('Failed to fetch violations:', err)
  } finally {
    loading.value = false
  }
}

let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.PageNumber = 1
    fetchData()
  }, 500)
}

const prevPage = () => { if (filters.PageNumber > 1) { filters.PageNumber--; fetchData() } }
const nextPage = () => { if (filters.PageNumber < totalPages.value) { filters.PageNumber++; fetchData() } }

const statusClass = (status) => {
  const base = 'px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest '
  switch (status) {
    case 'PendingReview': return base + 'bg-yellow-500/10 text-yellow-600'
    case 'Confirmed': return base + 'bg-red-500/10 text-red-600'
    case 'Waived': return base + 'bg-green-500/10 text-green-600'
    default: return base + 'bg-slate-500/10 text-slate-500'
  }
}

const openReviewModal = (violation) => {
  selectedViolation.value = violation
  reviewForm.reviewStatus = violation.reviewStatus === 'PendingReview' ? '' : violation.reviewStatus
  reviewForm.reviewNote = ''
  showModal.value = true
}

const submitReview = async () => {
  if (!selectedViolation.value) return
  submitting.value = true
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/admin/policy-violations/review`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        violationId: selectedViolation.value.id,
        reviewStatus: reviewForm.reviewStatus,
        reviewNote: reviewForm.reviewNote
      })
    })

    if (!res.ok) throw new Error('Failed to submit review')
    
    showModal.value = false
    await fetchData()
  } catch (err) {
    alert(t('Operation failed'))
  } finally {
    submitting.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
