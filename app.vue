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

/* ===== GLOBAL DARK MODE FIX FOR TELEPORTED MODALS & DIALOGS ===== */

/* Custom modals (Teleported to body + inline fixed overlays) */
html.dark .modal-dark-content,
html.dark [class*="animate-modal-in"],
html.dark .fixed [class*="bg-white"],
html.dark .fixed > div > [class*="bg-white"] {
  background-color: #0f172a !important; /* slate-900 */
  color: #f8fafc !important;
  border-color: rgba(255,255,255,0.1) !important;
}

/* PrimeVue Dialog panels */
html.dark .p-dialog {
  background-color: #0f172a !important;
  color: #f8fafc !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
}

html.dark .p-dialog .p-dialog-header {
  background-color: #0f172a !important;
  color: #f8fafc !important;
  border-bottom: 1px solid rgba(255,255,255,0.05) !important;
}

html.dark .p-dialog .p-dialog-content {
  background-color: #0f172a !important;
  color: #f8fafc !important;
}

html.dark .p-dialog .p-dialog-footer {
  background-color: #0f172a !important;
  border-top: 1px solid rgba(255,255,255,0.05) !important;
}

/* Dark mode inputs inside dialogs */
html.dark .p-dialog input,
html.dark .p-dialog textarea,
html.dark .p-dialog select,
html.dark .p-dialog .p-inputtext {
  background-color: rgba(255,255,255,0.05) !important;
  color: #f8fafc !important;
  border-color: rgba(255,255,255,0.1) !important;
}

html.dark .p-dialog label {
  color: #94a3b8 !important; /* slate-400 */
}

/* Remove forced borders and colors */
.p-datatable-tbody>tr>td {
  white-space: nowrap !important;
}

.p-datatable .p-datatable-thead>tr>th {
  white-space: nowrap !important;
  text-align: center !important;
}
</style>