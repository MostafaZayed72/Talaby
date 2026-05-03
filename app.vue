<template>
  <div :style="{ direction: isRtl ? 'rtl' : 'ltr' }">
    <Loader v-if="loading" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { locale } = useI18n()
const preferredLanguage = useLocalStorage('preferredLanguage', 'en-US')
const loading = ref(false)
const router = useRouter()

// Global navigation guards for loading state
router.beforeEach((to, from, next) => {
  loading.value = true
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    loading.value = false
  }, 300) // Small delay for smooth transition
})

// RTL calculation
const isRtl = computed(() => locale.value.startsWith('ar'))

// HTML attributes for SEO and RTL
useHead({
  htmlAttrs: {
    dir: computed(() => isRtl.value ? 'rtl' : 'ltr'),
    lang: computed(() => locale.value)
  }
})

// Sync language with localStorage
watch(preferredLanguage, (newValue) => {
  if (newValue) {
    locale.value = newValue
  }
})

onMounted(() => {
  if (!preferredLanguage.value) {
    preferredLanguage.value = 'en-US'
  }
})
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');

.delayed {
  transition: 0.3s;
}

body {
  font-family: 'Tajawal', sans-serif;
  font-weight: 500;
}

/* Base styles for dark mode compatibility */
.dark body {
  background-color: #020617; /* slate-950 */
  color: #f8fafc; /* slate-50 */
}

/* Remove forced borders and colors */
.p-datatable-tbody>tr>td {
  white-space: nowrap !important;
}

.p-datatable .p-datatable-thead>tr>th {
  white-space: nowrap !important;
  text-align: center !important;
}

/* Other PrimeVue overrides if needed, but avoiding !important where possible */
</style>