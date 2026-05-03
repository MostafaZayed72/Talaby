<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white italic mb-2">
          {{ $t('Departments Management') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium">
          {{ $t('Create, edit, and manage your service categories.') }}
        </p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3"
      >
        <Icon name="ph:plus-bold" class="text-xl" />
        {{ $t('Add Department') }}
      </button>
    </div>

    <!-- Departments Table -->
    <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-white/5 border-b border-white/10">
              <th class="px-8 py-6 text-slate-400 font-black uppercase tracking-widest text-xs">{{ $t('Image') }}</th>
              <th class="px-8 py-6 text-slate-400 font-black uppercase tracking-widest text-xs">{{ $t('Name (Arabic)') }}</th>
              <th class="px-8 py-6 text-slate-400 font-black uppercase tracking-widest text-xs">{{ $t('Name (English)') }}</th>
              <th class="px-8 py-6 text-slate-400 font-black uppercase tracking-widest text-xs text-center">{{ $t('Actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="dept in departments" :key="dept.id" class="hover:bg-white/5 transition-colors group">
              <td class="px-8 py-6">
                <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white/10 group-hover:scale-110 transition-transform bg-slate-50 dark:bg-slate-800">
                  <img :src="dept.imageUrl || '/imgs/placeholder.png'" class="w-full h-full object-contain" />
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-lg font-bold text-slate-900 dark:text-white">{{ dept.nameAr }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="text-lg font-bold text-slate-900 dark:text-white">{{ dept.nameEn }}</span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center justify-center gap-3">
                  <button 
                    @click="openEditModal(dept)"
                    class="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all active:scale-90"
                    title="Edit"
                  >
                    <Icon name="ph:pencil-simple-bold" class="text-xl" />
                  </button>
                  <button 
                    @click="confirmDelete(dept.id)"
                    class="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-90"
                    title="Delete"
                  >
                    <Icon name="ph:trash-bold" class="text-xl" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-8 border-t border-white/10 flex items-center justify-between">
        <div class="text-slate-500 dark:text-slate-400 font-medium">
          {{ $t('Showing') }} <span class="text-slate-900 dark:text-white font-black">{{ departments.length }}</span> {{ $t('of') }} <span class="text-slate-900 dark:text-white font-black">{{ totalItems }}</span> {{ $t('departments') }}
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="page--" 
            :disabled="page === 1"
            class="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white disabled:opacity-30 transition-all active:scale-90"
          >
            <Icon name="ph:caret-right-bold" />
          </button>
          <span class="font-black text-slate-900 dark:text-white">{{ page }} / {{ totalPages }}</span>
          <button 
            @click="page++" 
            :disabled="page === totalPages"
            class="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white disabled:opacity-30 transition-all active:scale-90"
          >
            <Icon name="ph:caret-left-bold" />
          </button>
        </div>
      </div>
    </div>

    <!-- Professional Custom Modal (Alternative to PrimeVue Dialog) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" @click="isModalOpen = false"></div>
      
      <div class="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-zoom-in">
        <div class="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h3 class="text-2xl font-black text-slate-900 dark:text-white italic">
            {{ isEditing ? $t('Edit Department') : $t('Add New Department') }}
          </h3>
          <button @click="isModalOpen = false" class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            <Icon name="ph:x-bold" class="text-xl text-slate-400" />
          </button>
        </div>

        <form @submit.prevent="saveDepartment" class="p-8 space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-black uppercase tracking-widest text-slate-400 px-2">{{ $t('Name (Arabic)') }}</label>
            <input 
              v-model="form.nameAr"
              type="text"
              class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-900 dark:text-white"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black uppercase tracking-widest text-slate-400 px-2">{{ $t('Name (English)') }}</label>
            <input 
              v-model="form.nameEn"
              type="text"
              class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-900 dark:text-white"
              required
            />
          </div>

          <div class="space-y-4">
            <label class="text-xs font-black uppercase tracking-widest text-slate-400 px-2">{{ $t('Department Image') }}</label>
            <div class="relative group">
              <div 
                class="w-full h-48 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-colors group-hover:border-indigo-600 cursor-pointer overflow-hidden"
              >
                <template v-if="!form.imageUrl">
                  <Icon name="ph:image-square-bold" class="text-4xl text-slate-300" />
                  <p class="text-sm font-bold text-slate-400">{{ $t('Click to upload image') }}</p>
                </template>
                <img v-else :src="form.imageUrl" class="w-full h-full object-cover" />
                
                <input 
                  type="file" 
                  @change="handleFileUpload"
                  class="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
              </div>
              <div v-if="uploading" class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
                 <Icon name="ph:circle-notch-bold" class="text-4xl text-indigo-600 animate-spin" />
              </div>
            </div>
          </div>

          <div class="pt-4 flex gap-4">
            <button 
              type="button"
              @click="isModalOpen = false"
              class="flex-1 px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 transition-all"
            >
              {{ $t('Cancel') }}
            </button>
            <button 
              type="submit"
              :disabled="uploading"
              class="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {{ isEditing ? $t('Save Changes') : $t('Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { t } = useI18n()
const token = useCookie('token')

// Layout
definePageMeta({
  layout: 'admin'
})

// State
const departments = ref([])
const totalItems = ref(0)
const totalPages = ref(1)
const page = ref(1)
const pageSize = 10
const loading = ref(false)

// Form State
const isModalOpen = ref(false)
const isEditing = ref(false)
const uploading = ref(false)
const form = ref({
  id: null,
  nameAr: '',
  nameEn: '',
  imageUrl: ''
})

// Actions
const fetchDepartments = async () => {
  try {
    const query = new URLSearchParams({
      PageNumber: page.value.toString(),
      PageSize: pageSize.toString()
    })
    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories?${query}`)
    const response = await res.json()
    const data = response.data
    departments.value = data?.items || []
    totalItems.value = data?.totalItemsCount || departments.value.length
    totalPages.value = data?.totalPages || 1
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

const openAddModal = () => {
  isEditing.value = false
  form.value = { id: null, nameAr: '', nameEn: '', imageUrl: '' }
  isModalOpen.value = true
}

const openEditModal = (dept) => {
  isEditing.value = true
  form.value = { ...dept }
  isModalOpen.value = true
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  uploading.value = true
  
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await fetch(
      `${config.public.API_BASE_URL}/uploads/images`,
      { 
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: formData 
      }
    )
    const response = await res.json()
    if (response.isSuccess) {
      const baseUrl = config.public.API_BASE_URL.replace('/api', '')
      form.value.imageUrl = `${baseUrl}${response.data.url}`
    }
  } catch (err) {
    alert(t('Upload failed'))
  } finally {
    uploading.value = false
  }
}

const saveDepartment = async () => {
  try {
    const method = isEditing.value ? 'PATCH' : 'POST'
    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (res.ok) {
      isModalOpen.value = false
      fetchDepartments()
    } else {
      const err = await res.json()
      alert(err.message || 'Operation failed')
    }
  } catch (err) {
    alert('Request error')
  }
}

const confirmDelete = async (id) => {
  if (!confirm(t('Are you sure you want to delete this department?'))) return
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) fetchDepartments()
  } catch (err) {
    alert('Delete failed')
  }
}

// Hooks
onMounted(fetchDepartments)
watch(page, fetchDepartments)
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-zoom-in {
  animation: zoom-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>

