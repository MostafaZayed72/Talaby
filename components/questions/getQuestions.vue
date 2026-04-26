<!-- components/QuestionList.vue -->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const route = useRoute()
const router = useRouter()

const postId = route.params.id as string

const questions = ref<any[]>([])
const pageNumber = ref(1)
const pageSize = ref(5)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

const fetchQuestions = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = new URL(`${config.public.API_BASE_URL}/project-requests/${postId}/questions`)
    url.searchParams.set('pageNumber', pageNumber.value.toString())
    url.searchParams.set('pageSize', pageSize.value.toString())

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) throw new Error('فشل تحميل الاستفسارات')

    const response = await res.json()
    const data = response.data
    questions.value = data.items || []
    totalPages.value = data.totalPages || 1
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل الاستفسارات'
  } finally {
    loading.value = false
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(fetchQuestions)
watch(pageNumber, fetchQuestions)
</script>

<template>
  <div class="space-y-8">
    <div v-if="loading" class="space-y-6">
       <div v-for="i in 3" :key="i" class="h-32 bg-white/5 animate-pulse rounded-3xl border border-white/10"></div>
    </div>
    
    <div v-if="error" class="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 font-bold text-center">
       {{ error }}
    </div>

    <div v-if="!loading && questions.length === 0" class="text-center py-12 bg-white/5 rounded-[2.5rem] border border-white/10 border-dashed">
       <Icon name="ph:chats-circle-bold" class="text-5xl text-slate-400 mb-3 opacity-20" />
       <p class="text-slate-400 font-bold">{{ $t('No questions yet.') }}</p>
    </div>

    <div class="space-y-6">
      <div
        v-for="question in questions"
        :key="question.id"
        @click="navigateTo(`/question-replies/${question.id}`)"
        class="group relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 cursor-pointer hover:bg-white/20 transition-all duration-500 shadow-xl overflow-hidden"
      >
        <div class="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div class="space-y-4 flex-1">
            <div class="flex items-center gap-3 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <Icon name="ph:user-circle-bold" class="text-lg text-indigo-500" />
              <span>User: {{ question.creatorCommercialRegisterNumber || 'Anon' }}</span>
              <span class="opacity-30">•</span>
              <span>{{ new Date(question.createdAt).toLocaleDateString() }}</span>
            </div>
            
            <p class="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
              {{ question.content }}
            </p>

            <div class="flex items-center gap-4 pt-4">
               <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-black text-sm">
                  <Icon name="ph:chat-teardrop-text-bold" />
                  <span>{{ question.repliesCount }} {{ $t('Replies') }}</span>
               </div>
            </div>
          </div>

          <div class="flex items-center">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg">
               <Icon name="ph:caret-right-bold" class="text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-4 pt-8">
      <button 
        class="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white disabled:opacity-30 hover:bg-indigo-600 transition-all shadow-xl" 
        :disabled="pageNumber === 1" 
        @click="pageNumber--"
      >
        <Icon name="ph:caret-left-bold" />
      </button>
      <button 
        class="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white disabled:opacity-30 hover:bg-indigo-600 transition-all shadow-xl" 
        :disabled="pageNumber === totalPages" 
        @click="pageNumber++"
      >
        <Icon name="ph:caret-right-bold" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
