<template>
  <div class="min-h-screen">
    <div v-if="loading || userLoading" class="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div class="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-indigo-600 font-black text-xl animate-pulse tracking-widest uppercase">{{ $t('Loading...') }}</p>
    </div>

    <div v-else-if="!departmentData" class="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <Icon name="ph:warning-circle-bold" class="text-7xl text-red-500 mb-6" />
      <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-4">{{ $t('Department Not Found') }}</h2>
      <NuxtLink to="/departments" class="text-indigo-600 font-bold hover:underline">{{ $t('Back to Departments') }}</NuxtLink>
    </div>

    <div v-else class="animate-fade-in">
      <!-- Hero Section -->
      <div class="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          :src="departmentData.imageUrl || 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=1200&auto=format&fit=crop'"
          class="absolute inset-0 w-full h-full object-cover"
          alt="Hero Image"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-violet-950/90"></div>
        
        <div class="absolute inset-0 flex items-center justify-center text-center p-6 mt-20">
          <div class="max-w-4xl">
            <h1 class="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter italic drop-shadow-2xl">
              {{ locale === 'ar' ? departmentData.nameAr : departmentData.nameEn }}
            </h1>
            <div class="flex justify-center mb-8">
               <div class="h-1.5 w-24 bg-yellow-400 rounded-full shadow-lg"></div>
            </div>

            <!-- Action Button -->
            <div v-if="isClient" class="flex justify-center transform hover:scale-105 transition-transform">
              <DepartmentAddRequest @request-added="handleRequestAdded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Requests Section -->
      <div class="max-w-7xl mx-auto px-6 py-20 relative">
        <!-- Abstract Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl"></div>
        
        <DepartmentGetRequests ref="requestsRef" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'

// ✅ composable اللي فيه جلب بيانات اليوزر من الـ API
const { user } = await useCurrentUser()
const userLoading = ref(!user.value) // في حال كنت حابب تعرض لودينغ لبيانات اليوزر
const roles = useCookie('roles')

const isClient = computed(() => {
  const rolesArr = Array.isArray(roles.value) ? roles.value : []
  return rolesArr.some((r: any) => String(r).toLowerCase() === 'client')
})

const { locale } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()

const departmentParam = route.params.department
const departmentData = ref<any>(null)
const loading = ref(true)
const requestsRef = ref<any>(null)

const handleRequestAdded = () => {
  requestsRef.value?.fetchRequests()
}

const fetchDepartment = async () => {
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories/${departmentParam}`)
    if (!res.ok) throw new Error('قسم غير موجود')
    const response = await res.json()
    departmentData.value = response.data
  } catch (err) {
    console.error(err)
    departmentData.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchDepartment)
</script>
