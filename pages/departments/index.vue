<template>
  <div class="py-20 px-4 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-10 text-violet-600 dark:text-violet-400">
      {{ $t('Departments') }}
    </h1>
    <!-- الأقسام -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
      <div
        v-for="section in sections"
        :key="section.id"
        class="text-center"
      >
        <NuxtLink :to="`/departments/${section.id}`">
          <img
            :src="section.imageUrl"
            :alt="getTitle(section)"
            class="w-full h-48 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <h2 class="mt-4 text-lg font-semibold text-gray-800 dark:text-white hover:text-primary transition">
            {{ getTitle(section) }}
          </h2>
        </NuxtLink>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center gap-4">
      <button
        class="px-4 py-2 bg-violet-500 dark:bg-violet-400 text-white rounded disabled:opacity-50"
        :disabled="page === 1"
        @click="page--"
      >
        {{ $t('Previous') }}
      </button>

      <span class="text-lg">{{ page }} / {{ totalPages }}</span>

      <button
        class="px-4 py-2 bg-violet-500 dark:bg-violet-400 text-white rounded disabled:opacity-50"
        :disabled="page === totalPages"
        @click="page++"
      >
        {{ $t('Next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const locale = useI18n().locale

const sections = ref([])
const page = ref(1)
const pageSize = 6
const totalPages = ref(1)

const getTitle = (section: any) => {
  return locale.value === 'ar' ? section.nameAr : section.nameEn
}

const fetchCategories = async () => {
  try {
    const query = new URLSearchParams({
      PageNumber: page.value.toString(),
      PageSize: pageSize.toString()
    })

    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories?${query}`)
    const data = await res.json()

    sections.value = data.items || data // إذا كانت النتيجة ملفوفة في `items`
    totalPages.value = data.totalPages || Math.ceil((data.totalCount || 1) / pageSize)
  } catch (err) {
    console.error('فشل في جلب الأقسام:', err)
  }
}

watch(page, fetchCategories)
onMounted(fetchCategories)
</script>
