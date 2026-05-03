<template>
  <div :class="[role === 'Store' ? '' : 'min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6']">
    <div :class="[role === 'Store' ? '' : 'max-w-7xl mx-auto']">
      <div v-if="loading && !dashboardData" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Icon name="ph:circle-notch-bold" class="text-6xl text-indigo-600 animate-spin" />
        <p class="text-indigo-600 font-black italic animate-pulse">{{ $t('Loading your space...') }}</p>
      </div>

      <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 p-12 rounded-[3rem] text-red-500 text-center max-w-2xl mx-auto shadow-2xl">
        <div class="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Icon name="ph:warning-circle-bold" class="text-4xl" />
        </div>
        <h2 class="text-2xl font-black italic mb-2 uppercase">{{ $t('Connection Error') }}</h2>
        <p class="font-bold opacity-70 mb-8">{{ error }}</p>
        <button @click="fetchData" class="px-12 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg hover:shadow-red-500/40 transition-all active:scale-95 uppercase tracking-widest">
          {{ $t('Try Again') }}
        </button>
      </div>

      <template v-else>
        <!-- Store Dashboard -->
        <DashboardStoreView v-if="role === 'Store'" :data="dashboardData" />
        
        <!-- Client Dashboard -->
        <DashboardClientView v-else-if="role === 'Client'" :data="dashboardData" />

        <!-- Fallback/Unauthorized -->
        <div v-else class="text-center py-20 bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl">
           <Icon name="ph:lock-keyhole-fill" class="text-6xl text-slate-300 mb-6" />
           <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase italic">{{ $t('Unauthorized Access') }}</h2>
           <p class="text-slate-500 font-bold mt-2">{{ $t('You do not have permission to view this dashboard.') }}</p>
           <NuxtLink to="/" class="mt-8 inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">{{ $t('Back Home') }}</NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})



const config = useRuntimeConfig()
const router = useRouter()
const token = useCookie('token')
const roles = useCookie('roles')

const loading = ref(true)
const error = ref(null)
const dashboardData = ref(null)
const role = ref(null)

// Determine role early for template
if (process.client) {
  if (roles.value.includes('Admin')) {
    role.value = 'Admin'
  } else if (roles.value.includes('Store')) {
    role.value = 'Store'
  } else if (roles.value.includes('Client')) {
    role.value = 'Client'
  }
}

const fetchData = async () => {
  if (!role.value) {
    if (roles.value.includes('Admin')) role.value = 'Admin'
    else if (roles.value.includes('Store')) role.value = 'Store'
    else if (roles.value.includes('Client')) role.value = 'Client'
    else {
      loading.value = false
      return
    }
  }

  loading.value = true
  error.value = null
  
  try {
    const endpoint = role.value === 'Store' ? 'dashboard/store' : 'dashboard/client'
    const res = await fetch(`${config.public.API_BASE_URL}/${endpoint}`, {
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

<style scoped>
/* Page-wide transitions */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
