<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const token = useLocalStorage('token', '')

const postId = route.params.id as string

const post = ref<null | {
  title: string
  description: string
  minBudget: number
  maxBudget: number
  imageUrl: string
}>(null)

const loading = ref(true)
const error = ref('')

const fetchPostDetails = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${postId}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('فشل في تحميل تفاصيل الطلب')

    const response = await res.json()
    post.value = response.data
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل البيانات'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPostDetails)
</script>

<template>
  <div class="animate-fade-in">
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
       <Icon name="ph:circle-notch-bold" class="text-5xl text-indigo-600 animate-spin" />
       <p class="text-indigo-600 font-black animate-pulse">{{ $t('Loading Details...') }}</p>
    </div>
    
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center text-red-500 font-bold">
      <Icon name="ph:warning-circle-bold" class="text-4xl mb-2" />
      <p>{{ error }}</p>
    </div>

    <div v-if="post" class="space-y-12">
      <!-- Header Card -->
      <div class="relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-10 md:p-16 shadow-2xl overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-right">
          <!-- Image Section -->
          <div v-if="post.imageUrl" class="w-full md:w-1/3 group">
            <div class="aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <img
                :src="post.imageUrl"
                class="w-full h-full object-cover"
                alt="Request Image"
              />
            </div>
          </div>

          <!-- Info Section -->
          <div class="flex-1 space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight italic tracking-tighter">
                {{ post.title }}
              </h1>
              <div class="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-400 text-violet-950 font-black text-sm uppercase tracking-widest shadow-lg">
                <Icon name="ph:sparkle-fill" />
                {{ $t('Active Request') }}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
               <div class="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-1">
                  <span class="text-xs font-black text-slate-500 uppercase tracking-widest">{{ $t('Budget Range') }}</span>
                  <p class="text-2xl font-black text-indigo-600 dark:text-indigo-400 italic">
                    ${{ post.minBudget }} - ${{ post.maxBudget }}
                  </p>
               </div>
               <div class="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-1">
                  <span class="text-xs font-black text-slate-500 uppercase tracking-widest">{{ $t('Created On') }}</span>
                  <p class="text-xl font-bold text-slate-900 dark:text-white">
                    {{ new Date(post.createdAt).toLocaleDateString() }}
                  </p>
               </div>
            </div>

            <div class="bg-white/5 p-8 rounded-[2rem] border border-white/5">
              <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{{ $t('Full Description') }}</h3>
              <p class="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {{ post.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>

