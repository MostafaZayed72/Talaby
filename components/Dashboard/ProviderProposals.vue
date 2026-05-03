<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header & Search -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="text-center md:text-right">
        <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight flex items-center justify-center md:justify-start gap-3 md:gap-4">
          <Icon name="ph:file-text-fill" class="text-indigo-600" />
          {{ $t('My Proposals') }}
        </h2>
        <p class="text-slate-500 font-bold mt-1 text-sm md:text-base">{{ $t('Manage and track your project offers') }}</p>
      </div>

      <div class="w-full md:w-80 lg:w-96 relative group">
        <Icon name="ph:magnifying-glass-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <input 
          v-model="filters.SearchPhrase"
          @input="debounceSearch"
          type="text" 
          :placeholder="$t('Search projects...')"
          class="w-full pl-12 pr-6 py-3 md:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl font-bold shadow-sm focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none text-sm md:text-base"
        >
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <th @click="toggleSort('ProjectTitle')" class="px-4 md:px-8 py-4 md:py-6 cursor-pointer hover:text-indigo-600 transition-colors">
                <div class="flex items-center gap-2">
                  {{ $t('Project') }}
                  <Icon v-if="filters.SortBy === 'ProjectTitle'" :name="filters.SortDirection === 'Ascending' ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
                </div>
              </th>
              <th @click="toggleSort('ProposedAmount')" class="px-4 md:px-8 py-4 md:py-6 text-center cursor-pointer hover:text-indigo-600 transition-colors">
                <div class="flex items-center justify-center gap-2">
                  {{ $t('Offer') }}
                  <Icon v-if="filters.SortBy === 'ProposedAmount'" :name="filters.SortDirection === 'Ascending' ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
                </div>
              </th>
              <th class="px-4 md:px-8 py-4 md:py-6 text-center">{{ $t('Status') }}</th>
              <th class="px-4 md:px-8 py-4 md:py-6 text-center hidden lg:table-cell">{{ $t('My Offer') }}</th>
              <th @click="toggleSort('CreatedAt')" class="px-4 md:px-8 py-4 md:py-6 text-center cursor-pointer hover:text-indigo-600 transition-colors hidden sm:table-cell">
                <div class="flex items-center justify-center gap-2">
                  {{ $t('Date') }}
                  <Icon v-if="filters.SortBy === 'CreatedAt'" :name="filters.SortDirection === 'Ascending' ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
                </div>
              </th>
              <th class="px-4 md:px-8 py-4 md:py-6 text-center">{{ $t('Replies') }}</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-white/5">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
               <td colspan="6" class="px-8 py-6">
                  <div class="h-10 bg-slate-100 dark:bg-white/5 rounded-2xl w-full"></div>
               </td>
            </tr>
            
            <template v-else>
              <tr v-for="(item, index) in items" :key="item.id" 
                @click="router.push(`/requests/${item.projectRequestId}`)" 
                class="hover:bg-indigo-600/10 transition-all group cursor-pointer border-b border-white/5 last:border-0"
                :class="index % 2 === 0 ? 'bg-indigo-600/[0.03]' : 'bg-transparent'"
              >
                <td class="px-4 md:px-8 py-4 md:py-6">
                  <div class="flex flex-col">
                    <span class="text-xs md:text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate max-w-[120px] md:max-w-[300px]">{{ item.projectTitle }}</span>
                    <span class="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate max-w-[120px] md:max-w-[300px]">{{ item.creatorEmail }}</span>
                  </div>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center">
                  <span class="px-2 md:px-4 py-1 md:py-2 bg-indigo-600/10 text-indigo-600 rounded-lg md:rounded-xl font-black text-[10px] md:text-xs">
                    ${{ item.proposedAmount }}
                  </span>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center">
                  <span :class="statusClass(item.status)">
                    {{ $t(item.status) }}
                  </span>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center hidden lg:table-cell">
                  <p class="text-xs text-slate-500 font-medium line-clamp-1 max-w-[200px] mx-auto">{{ item.content }}</p>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center hidden sm:table-cell">
                  <div class="flex flex-col items-center">
                    <span class="text-xs text-slate-900 dark:text-white font-bold">{{ new Date(item.createdAt).toLocaleDateString() }}</span>
                    <span class="text-[10px] text-slate-500 font-bold">{{ new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                  </div>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center">
                   <div class="flex items-center justify-center gap-3">
                     <button
                       v-if="item.status.toLowerCase() === 'accepted'"
                       @click.stop="markAsDone(item.projectRequestId)"
                       :title="$t('Mark as Done')"
                       class="w-8 h-8 flex items-center justify-center bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors"
                     >
                       <Icon name="ph:check-circle-bold" />
                     </button>
                     <div 
                      @click.stop="(item.status.toLowerCase() === 'accepted' || item.status.toLowerCase() === 'completed') ? router.push(`/replies/${item.id}`) : null"
                      class="flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      :title="(item.status.toLowerCase() === 'accepted' || item.status.toLowerCase() === 'completed') ? $t('Open Chat') : ''"
                     >
                        <Icon name="ph:chat-circle-dots-fill" :class="{'text-indigo-600': item.status.toLowerCase() === 'accepted' || item.status.toLowerCase() === 'completed'}" />
                        <span class="text-xs font-black">{{ item.repliesCount }}</span>
                     </div>
                   </div>
                </td>
              </tr>
            </template>

            <tr v-if="!loading && items.length === 0">
               <td colspan="6" class="px-8 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                     <Icon name="ph:folder-open-light" class="text-6xl text-slate-300" />
                     <p class="text-slate-500 font-black italic uppercase">{{ $t('No proposals found') }}</p>
                  </div>
               </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="p-6 md:p-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p class="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">
           {{ $t('Showing') }} {{ (filters.PageNumber - 1) * filters.PageSize + 1 }} - {{ Math.min(filters.PageNumber * filters.PageSize, totalItemsCount) }} {{ $t('of') }} {{ totalItemsCount }}
        </p>
        <div class="flex gap-2">
          <button 
            @click="prevPage" 
            :disabled="filters.PageNumber === 1"
            class="p-2 md:p-3 bg-slate-100 dark:bg-white/5 rounded-lg md:rounded-xl disabled:opacity-50 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Icon :name="locale === 'ar' ? 'ph:caret-right-bold' : 'ph:caret-left-bold'" />
          </button>
          
          <div class="flex items-center gap-1">
             <button 
               v-for="p in displayedPages" :key="p"
               @click="filters.PageNumber = p; fetchData()"
               class="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl font-black text-[10px] md:text-xs transition-all"
               :class="p === filters.PageNumber ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200'"
             >
               {{ p }}
             </button>
          </div>
          <button 
            @click="nextPage" 
            :disabled="filters.PageNumber === totalPages"
            class="p-2 md:p-3 bg-slate-100 dark:bg-white/5 rounded-lg md:rounded-xl disabled:opacity-50 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Icon :name="locale === 'ar' ? 'ph:caret-left-bold' : 'ph:caret-right-bold'" />
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog إتمام المهمة الاحترافي -->
    <div v-if="showMarkDoneDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" @click="showMarkDoneDialog = false"></div>
      <div class="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div class="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
           <Icon name="ph:check-circle-bold" class="text-4xl" />
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-slate-900 dark:text-white italic">{{ $t('Complete Request') }}</h3>
          <p class="text-slate-500 dark:text-slate-400 font-medium">{{ $t('Are you sure you have completed the task and want to mark it as done?') }}</p>
        </div>
        <div class="flex gap-4">
          <button
            class="flex-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-2xl font-black transition-all hover:bg-slate-200"
            @click="showMarkDoneDialog = false"
          >
            {{ $t('Cancel') }}
          </button>
          <button
            class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            @click="confirmMarkAsDone"
          >
            {{ $t('Yes, Done') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRuntimeConfig, useRouter } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const config = useRuntimeConfig()
const router = useRouter()
const { locale, t } = useI18n()
const token = useCookie('token')

const loading = ref(true)
const items = ref([])
const totalPages = ref(0)
const totalItemsCount = ref(0)
const showMarkDoneDialog = ref(false)
const selectedRequestId = ref(null)

const filters = reactive({
  SearchPhrase: '',
  PageNumber: 1,
  PageSize: 10,
  SortBy: 'CreatedAt',
  SortDirection: 'Descending'
})

const fetchData = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams(filters).toString()
    const res = await fetch(`${config.public.API_BASE_URL}/project-proposals/me?${params}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    if (!res.ok) throw new Error('Failed to fetch proposals')
    
    const response = await res.json()
    items.value = response.data.items
    totalPages.value = response.data.totalPages
    totalItemsCount.value = response.data.totalItemsCount
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const isMarkingDone = ref(false)
const confirmMarkAsDone = async () => {
  if (!selectedRequestId.value) return
  showMarkDoneDialog.value = false
  isMarkingDone.value = true
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${selectedRequestId.value}/mark-done`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    if (!res.ok) throw new Error('فشل إتمام الطلب')
    await fetchData()
  } catch (err) {
    alert(err.message || 'حدث خطأ')
  } finally {
    isMarkingDone.value = false
    selectedRequestId.value = null
  }
}

const markAsDone = (requestId) => {
  selectedRequestId.value = requestId
  showMarkDoneDialog.value = true
}

let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.PageNumber = 1
    fetchData()
  }, 500)
}

const toggleSort = (field) => {
  if (filters.SortBy === field) {
    filters.SortDirection = filters.SortDirection === 'Ascending' ? 'Descending' : 'Ascending'
  } else {
    filters.SortBy = field
    filters.SortDirection = 'Descending'
  }
  fetchData()
}

const prevPage = () => {
  if (filters.PageNumber > 1) {
    filters.PageNumber--
    fetchData()
  }
}

const nextPage = () => {
  if (filters.PageNumber < totalPages.value) {
    filters.PageNumber++
    fetchData()
  }
}

const statusClass = (status) => {
  const base = 'px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider '
  switch (status.toLowerCase()) {
    case 'completed': return base + 'bg-green-500/10 text-green-500'
    case 'accepted': return base + 'bg-indigo-500/10 text-indigo-500'
    case 'pending': return base + 'bg-yellow-500/10 text-yellow-500'
    case 'rejected': return base + 'bg-red-500/10 text-red-500'
    case 'cancelled': return base + 'bg-slate-500/10 text-slate-500'
    default: return base + 'bg-slate-500/10 text-slate-500'
  }
}

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, filters.PageNumber - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

onMounted(fetchData)
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
