<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header & Search -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="text-center md:text-right">
        <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight flex items-center justify-center md:justify-start gap-3 md:gap-4">
          <Icon name="ph:shopping-bag-fill" class="text-indigo-600" />
          {{ $t('My Orders') }}
        </h2>
        <p class="text-slate-500 font-bold mt-1 text-sm md:text-base">{{ $t('Manage and track your project requests') }}</p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <NuxtLink 
          to="/departments" 
          class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
        >
          <Icon name="ph:plus-circle-fill" class="text-xl md:text-2xl" />
          {{ $t('New Request') }}
        </NuxtLink>

        <div class="w-full md:w-80 lg:w-96 relative group">
          <Icon name="ph:magnifying-glass-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            v-model="filters.SearchPhrase"
            @input="debounceSearch"
            type="text" 
            :placeholder="$t('Search orders...')"
            class="w-full pl-12 pr-6 py-3 md:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl font-bold shadow-sm focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none text-sm md:text-base"
          >
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <th @click="toggleSort('Title')" class="px-4 md:px-8 py-4 md:py-6 cursor-pointer hover:text-indigo-600 transition-colors">
                <div class="flex items-center gap-2">
                  {{ $t('Project') }}
                  <Icon v-if="filters.SortBy === 'Title'" :name="filters.SortDirection === 'Ascending' ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
                </div>
              </th>
              <th class="px-4 md:px-8 py-4 md:py-6 text-center">{{ $t('Proposals') }}</th>
              <th class="px-4 md:px-8 py-4 md:py-6 text-center">{{ $t('Status') }}</th>
              <th class="px-4 md:px-8 py-4 md:py-6 text-center">{{ $t('Replies') }}</th>
              <th @click="toggleSort('CreatedAt')" class="px-4 md:px-8 py-4 md:py-6 text-center cursor-pointer hover:text-indigo-600 transition-colors hidden sm:table-cell">
                <div class="flex items-center justify-center gap-2">
                  {{ $t('Date') }}
                  <Icon v-if="filters.SortBy === 'CreatedAt'" :name="filters.SortDirection === 'Ascending' ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
                </div>
              </th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-white/5">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
               <td colspan="5" class="px-8 py-6">
                  <div class="h-10 bg-slate-100 dark:bg-white/5 rounded-2xl w-full"></div>
               </td>
            </tr>
            
            <template v-else>
              <tr v-for="(item, index) in items" :key="item.id" 
                @click="router.push(`/requests/${item.id}`)" 
                class="hover:bg-indigo-600/10 transition-all group cursor-pointer border-b border-white/5 last:border-0"
                :class="index % 2 === 0 ? 'bg-indigo-600/[0.03]' : 'bg-transparent'"
              >
                <td class="px-4 md:px-8 py-4 md:py-6">
                  <div class="flex flex-col">
                    <span class="text-xs md:text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate max-w-[150px] md:max-w-[300px]">{{ item.title }}</span>
                    <span class="text-[9px] md:text-[10px] text-slate-500 font-bold line-clamp-1 max-w-[150px] md:max-w-[300px]">{{ item.description }}</span>
                  </div>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 font-black text-[10px] md:text-xs">
                      {{ item.proposalsCount }}
                    </div>
                    <span class="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden md:inline">{{ $t('Offers') }}</span>
                  </div>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center">
                  <span :class="statusClass(item.status)">
                    {{ $t(item.status) }}
                  </span>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center">
                   <div 
                    @click.stop="(item.status.toLowerCase() === 'accepted' || item.status.toLowerCase() === 'completed') ? router.push(item.acceptedProposalId ? `/replies/${item.acceptedProposalId}` : `/requests/${item.id}`) : null"
                    class="flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    :title="(item.status.toLowerCase() === 'accepted' || item.status.toLowerCase() === 'completed') ? $t('Open Chat') : ''"
                   >
                      <Icon name="ph:chat-circle-dots-fill" :class="{'text-indigo-600': item.status.toLowerCase() === 'accepted' || item.status.toLowerCase() === 'completed'}" />
                      <span class="text-xs font-black">{{ item.repliesCount || 0 }}</span>
                   </div>
                </td>
                <td class="px-4 md:px-8 py-4 md:py-6 text-center hidden sm:table-cell">
                  <div class="flex flex-col items-center">
                    <span class="text-xs text-slate-900 dark:text-white font-bold">{{ new Date(item.createdAt).toLocaleDateString() }}</span>
                    <span class="text-[10px] text-slate-500 font-bold">{{ new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-if="!loading && items.length === 0">
               <td colspan="5" class="px-8 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                     <Icon name="ph:shopping-bag-light" class="text-6xl text-slate-300" />
                     <p class="text-slate-500 font-black italic uppercase">{{ $t('No requests found') }}</p>
                     <NuxtLink to="/departments/1" class="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">
                        {{ $t('Create Your First Request') }}
                     </NuxtLink>
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
const token = useLocalStorage('token', '')

const loading = ref(true)
const items = ref([])
const totalPages = ref(0)
const totalItemsCount = ref(0)

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
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/me?${params}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    if (!res.ok) throw new Error('Failed to fetch requests')
    
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
  if (!status) return base + 'bg-slate-500/10 text-slate-500'
  switch (status.toLowerCase()) {
    case 'completed': return base + 'bg-green-500/10 text-green-500'
    case 'inprogress': return base + 'bg-indigo-500/10 text-indigo-500'
    case 'pending': return base + 'bg-yellow-500/10 text-yellow-500'
    case 'open': return base + 'bg-blue-500/10 text-blue-500'
    case 'cancelled': return base + 'bg-red-500/10 text-red-500'
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
