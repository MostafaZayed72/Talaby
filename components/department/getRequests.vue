<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const token = useCookie('token')
const { user: currentUser } = await useCurrentUser()
const roles = useCookie('roles')

// استخرج departmentId من الرابط وحوله لرقم
const departmentId = Number(route.params.department)

const requests = ref<any[]>([])
const pageNumber = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const searchPhrase = ref('')

const loading = ref(false)
const error = ref('')

const isClient = computed(() => {
  const rolesArr = Array.isArray(roles.value) ? roles.value : []
  return rolesArr.some((r: any) => String(r).toLowerCase() === 'client')
})

const fetchRequests = async () => {
  loading.value = true
  error.value = ''

  try {
    // استخدم إيندبوينت /me إذا كان المستخدم صاحب خدمة (Client)
    const endpoint = isClient.value ? 'project-requests/me' : 'project-requests'
    const url = new URL(`${config.public.API_BASE_URL}/${endpoint}`)
    
    url.searchParams.set('PageNumber', pageNumber.value.toString())
    url.searchParams.set('PageSize', pageSize.value.toString())
    
    // إذا لم يكن العميل، نفلتر بالقسم برمجياً في الرابط (إذا كان الإيندبوينت يدعم ذلك)
    // أو نفلتر لاحقاً إذا كان إيندبوينت /me لا يدعم StoreCategoryId
    url.searchParams.set('StoreCategoryId', departmentId.toString())
    
    if (searchPhrase.value) {
      url.searchParams.set('SearchPhrase', searchPhrase.value)
    }

    if (!token.value) {
      loading.value = false
      return
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('فشل في تحميل الطلبات')

    const response = await res.json()
    const data = response.data

    // إذا كان العميل، قد يعيد إيندبوينت /me كل طلباته، لذا نفلترها هنا للتأكد أنها تابعة للقسم الحالي فقط
    let items = data.items || []
    if (isClient.value) {
      items = items.filter((item: any) => Number(item.storeCategoryId) === departmentId)
    }

    requests.value = items
    totalPages.value = data.totalPages || 1
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل البيانات'
  } finally {
    loading.value = false
  }
}

// إعادة تحميل البيانات عند تغيير الصفحة أو البحث
watch([pageNumber, searchPhrase], fetchRequests)

onMounted(fetchRequests)

const goToRequest = (id: string) => {
  router.push(`/requests/${id}`)
}

const resetPageAndFetch = async () => {
  pageNumber.value = 1
  await fetchRequests()
}

defineExpose({ fetchRequests, resetPageAndFetch })
</script>

<template>
  <div class="space-y-10 animate-fade-in">
    <!-- Search Bar -->
    <div class="max-w-xl mx-auto">
      <div class="relative group">
        <Icon name="ph:magnifying-glass-bold" class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xl" />
        <input
          v-model="searchPhrase"
          class="w-full bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xl"
          :placeholder="$t('Search for a request...')"
        />
      </div>
    </div>

    <!-- State Views -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="i in 4" :key="i" class="h-48 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/10"></div>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center text-red-500 font-bold">
      <Icon name="ph:warning-circle-bold" class="text-4xl mb-2" />
      <p>{{ error }}</p>
    </div>

    <!-- Requests Grid -->
    <div v-if="requests.length" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="req in requests"
        :key="req.id"
        @click="goToRequest(req.id)"
        class="group relative bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 cursor-pointer hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 shadow-xl overflow-hidden"
      >
        <!-- Card Background Highlight -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors"></div>

        <div class="relative z-10 space-y-6">
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-yellow-400 transition-colors">
              {{ req.title }}
            </h3>
            <div class="px-4 py-1.5 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-600/20">
              {{ $t(String(req.status || 'Open')) }}
            </div>
          </div>

          <p class="text-slate-600 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed">
            {{ req.description }}
          </p>

          <div class="flex items-center justify-between pt-6 border-t border-white/10">
            <div class="flex items-center gap-3">
               <div class="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-600">
                  <Icon name="ph:calendar-blank-bold" />
               </div>
               <span class="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {{ new Date(req.createdAt).toLocaleDateString() }}
               </span>
            </div>
            <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black group-hover:gap-4 transition-all">
               <span>{{ $t('View Details') }}</span>
               <Icon name="ph:arrow-right-bold" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/10 border-dashed">
       <Icon name="ph:stack-bold" class="text-6xl text-slate-400 mb-4 opacity-30" />
       <p class="text-slate-400 font-bold text-xl">{{ $t('No requests found in this department yet.') }}</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-6 pt-10">
      <button
        :disabled="pageNumber === 1"
        @click="pageNumber--"
        class="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-slate-600 dark:text-white disabled:opacity-30 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
      >
        <Icon name="ph:caret-left-bold" />
      </button>
      <div class="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-black text-slate-900 dark:text-white shadow-xl">
        {{ pageNumber }} / {{ totalPages }}
      </div>
      <button
        :disabled="pageNumber === totalPages"
        @click="pageNumber++"
        class="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-slate-600 dark:text-white disabled:opacity-30 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
      >
        <Icon name="ph:caret-right-bold" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
