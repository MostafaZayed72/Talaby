<template>
  <div class="min-h-screen pt-20 md:pt-32 pb-20 px-6 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-12 md:mb-16">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight italic">
          {{ $t('Explore Departments') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-base md:text-lg leading-relaxed">
          {{ $t('Browse through our wide range of professional categories and find the perfect service for your needs.') }}
        </p>
      </div>

      <!-- Departments Grid -->
      <div v-if="loader" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-[2.5rem] aspect-[16/9] bg-slate-200 dark:bg-white/5"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        <NuxtLink 
          v-for="section in sections" 
          :key="section.id"
          :to="`/departments/${section.id}`"
          class="group relative overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/10 bg-slate-50 dark:bg-slate-900"
        >
          <img
            :src="section.imageUrl || 'https://images.unsplash.com/photo-1510511459019-5dee9954889c?q=80&w=600&auto=format&fit=crop'"
            :alt="getTitle(section)"
            class="w-full h-auto transition-transform duration-700 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-violet-950/90 via-violet-900/20 to-transparent flex flex-col justify-end p-6 md:p-8">
            <h2 class="text-xl md:text-2xl font-black text-white group-hover:text-yellow-400 transition-colors">
              {{ getTitle(section) }}
            </h2>
            <div class="h-1 w-0 bg-yellow-400 rounded-full group-hover:w-12 transition-all duration-500 mt-2"></div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="mt-12 md:mt-20 flex justify-center items-center gap-4 md:gap-6">
        <button
          class="p-3 md:p-4 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-slate-700 dark:text-white rounded-xl md:rounded-2xl disabled:opacity-30 hover:bg-white dark:hover:bg-white/10 hover:text-indigo-600 transition-all shadow-xl active:scale-90"
          :disabled="page === 1"
          @click="page--"
        >
          <Icon name="ph:arrow-left-bold" class="text-lg md:text-xl" />
        </button>

        <div class="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-xl font-black text-slate-900 dark:text-white text-sm md:text-base">
          {{ page }} <span class="mx-1 md:mx-2 text-slate-400 font-medium">/</span> {{ totalPages }}
        </div>

        <button
          class="p-3 md:p-4 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-slate-700 dark:text-white rounded-xl md:rounded-2xl disabled:opacity-30 hover:bg-white dark:hover:bg-white/10 hover:text-indigo-600 transition-all shadow-xl active:scale-90"
          :disabled="page === totalPages"
          @click="page++"
        >
          <Icon name="ph:arrow-right-bold" class="text-lg md:text-xl" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const locale = useI18n().locale
const loader = ref(false)
const sections = ref([])
const page = ref(1)
const pageSize = 6
const totalPages = ref(1)

const getTitle = (section: any) => {
  return locale.value === 'ar' ? section.nameAr : section.nameEn
}

const fetchCategories = async () => {
  try {
    loader.value = true
    const query = new URLSearchParams({
      PageNumber: page.value.toString(),
      PageSize: pageSize.toString()
    })

    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories?${query}`)
    const response = await res.json()
    const data = response.data

    sections.value = data?.items || []
    totalPages.value = data?.totalPages || 1
    
  } catch (err) {
    console.error('فشل في جلب الأقسام:', err)
  }
  finally{
    loader.value = false
  }
}

watch(page, fetchCategories)
onMounted(fetchCategories)
</script>
