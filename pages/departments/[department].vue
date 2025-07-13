<template>
  <div>
    <div v-if="loading || userLoading" class="text-center py-20">جاري التحميل...</div>

    <div v-else-if="!departmentData" class="text-center py-20">
      <p>القسم غير موجود</p>
    </div>

    <div v-else>
      <!-- صورة القسم -->
      <div
        class="relative h-[20vh] bg-center bg-cover flex items-center justify-center"
        :style="`background-image: url(${departmentData.imageUrl})`"
      >
        <div class="absolute inset-0 bg-black/40"></div>

        <div class="relative z-10 text-white text-center">
          <h1 class="text-4xl font-bold mb-4" v-if="locale === 'ar'">{{ departmentData.nameAr }}</h1>
          <h1 class="text-4xl font-bold mb-4" v-else>{{ departmentData.nameEn }}</h1>

          <!-- عرض الزر فقط إذا كان الدور Client -->
          <DepartmentAddRequest v-if="isClient" />
        </div>
      </div>

      <DepartmentGetRequests />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useI18n } from 'vue-i18n'

// ✅ composable اللي فيه جلب بيانات اليوزر من الـ API
const { user } = await useCurrentUser()
const userLoading = ref(!user.value) // في حال كنت حابب تعرض لودينغ لبيانات اليوزر

const isClient = computed(() => user.value?.roles?.includes('Client'))

const { locale } = useI18n()
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
