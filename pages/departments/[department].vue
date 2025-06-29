<template>
  <div>
    <div v-if="loading" class="text-center py-20">جاري التحميل...</div>
    <div v-else-if="!departmentData" class="text-center py-20">
      <p>القسم غير موجود</p>
    </div>
    <div v-else>
      <!-- الصورة كخلفية -->
      <div
        class="relative h-[60vh] bg-center bg-cover flex items-center justify-center"
        :style="`background-image: url(${departmentData.imageUrl})`"
      >
        <!-- Overlay (اختياري لتغميق الخلفية) -->
        <div class="absolute inset-0 bg-black/40"></div>

        <!-- النص فوق الخلفية -->
        <div class="relative z-10 text-white text-center">
          <h1 class="text-4xl font-bold mb-4">{{ departmentData.nameAr }}</h1>
          <button class="bg-purple-800 hover:bg-purple-900 px-6 py-2 rounded text-white font-semibold">
{{ $t('Submit an application in this department') }}          </button>
        </div>
      </div>

      <!-- وصف القسم تحت الصورة -->
      <div class="max-w-3xl mx-auto px-4 py-8 text-center">
        <p class="text-gray-700 dark:text-gray-300 text-lg">
          {{ departmentData.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const route = useRoute()

const departmentParam = route.params.department
const departmentData = ref<any>(null)
const loading = ref(true)

const fetchDepartment = async () => {
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories/${departmentParam}`)
    if (!res.ok) throw new Error('قسم غير موجود')
    departmentData.value = await res.json()
  } catch (err) {
    console.error(err)
    departmentData.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchDepartment)
</script>

