<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const route = useRoute()

const questionId = route.params.id as string

const replies = ref<any[]>([])
const questionContent = ref('')
const pageNumber = ref(1)
const pageSize = ref(5)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

const editingReplyId = ref<string | null>(null)
const editedContent = ref('')

const currentUserEmail = ref('')

const fetchCurrentUser = async () => {
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/identity/users/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) throw new Error('فشل تحميل بيانات المستخدم')

    const response = await res.json()
    currentUserEmail.value = response.data.email
  } catch (err) {
    console.error('فشل الحصول على المستخدم الحالي')
  }
}

onMounted(async () => {
  await fetchCurrentUser()
  await fetchReplies()
})

const fetchReplies = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = new URL(`${config.public.API_BASE_URL}/project-questions/${questionId}/replies`)
    url.searchParams.set('pageNumber', pageNumber.value.toString())
    url.searchParams.set('pageSize', pageSize.value.toString())

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('فشل تحميل الردود')

    const response = await res.json()
    const result = response.data

    // استخراج السؤال والردود من الهيكل الجديد
    questionContent.value = result.questionContent
    replies.value = result.replies.items || []
    totalPages.value = result.replies.totalPages || 1
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل الردود'
  } finally {
    loading.value = false
  }
}

defineExpose({ fetchReplies })

const deleteReply = async (id: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا الرد؟')) return

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/question-replies/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) throw new Error('فشل حذف الرد')

    await fetchReplies()
  } catch (err) {
    alert('حدث خطأ أثناء حذف الرد')
  }
}

const startEdit = (reply: any) => {
  editingReplyId.value = reply.id
  editedContent.value = reply.content
}

const saveEdit = async () => {
  if (!editedContent.value.trim()) return

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/question-replies`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: editingReplyId.value,
        content: editedContent.value,
      }),
    })

    if (!res.ok) throw new Error('فشل تعديل الرد')

    editingReplyId.value = null
    editedContent.value = ''
    await fetchReplies()
  } catch (err) {
    alert('حدث خطأ أثناء تعديل الرد')
  }
}

watch(pageNumber, fetchReplies)
</script>

<template>
  <div class="mt-12 space-y-8 px-2 animate-fade-in">
    <div class="flex items-center gap-4 mb-6">
      <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
        <Icon name="ph:chat-teardrop-dots-bold" class="text-2xl text-white" />
      </div>
      <h2 class="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">
        {{ $t('Replies on Question') }}
      </h2>
    </div>

    <!-- عرض السؤال الأصلي -->
    <div
      v-if="questionContent"
      class="relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border-l-8 border-indigo-600 p-8 rounded-[2rem] shadow-xl overflow-hidden group"
    >
      <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors"></div>
      <p class="relative z-10 text-xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
        "{{ questionContent }}"
      </p>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-4">
       <Icon name="ph:circle-notch-bold" class="text-4xl text-indigo-600 animate-spin" />
       <p class="text-indigo-600 font-bold animate-pulse">{{ $t('Loading Replies...') }}</p>
    </div>

    <!-- حالة الخطأ -->
    <div v-if="error" class="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center gap-3">
       <Icon name="ph:warning-circle-bold" class="text-2xl" />
       {{ error }}
    </div>

    <!-- قائمة الردود -->
    <div v-if="!loading && replies.length === 0" class="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10">
      <Icon name="ph:chats-bold" class="text-5xl text-slate-300 mb-4" />
      <p class="text-slate-500 dark:text-slate-400 font-bold">{{ $t('No replies yet.') }}</p>
    </div>

    <div class="space-y-6">
      <div
        v-for="reply in replies"
        :key="reply.id"
        class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all border-r-4 border-r-indigo-600/30"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-600">
                <Icon name="ph:user-bold" />
             </div>
             <div>
                <p class="text-sm font-black text-slate-900 dark:text-white">{{ reply.creatorEmail }}</p>
                <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                   {{ new Date(reply.createdAt).toLocaleString() }}
                </p>
             </div>
          </div>
          
          <div v-if="reply.creatorEmail === currentUserEmail" class="flex gap-2">
            <button @click="startEdit(reply)" class="p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-500 transition-colors">
              <Icon name="ph:pencil-simple-bold" />
            </button>
            <button @click="deleteReply(reply.id)" class="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
              <Icon name="ph:trash-bold" />
            </button>
          </div>
        </div>

        <div v-if="editingReplyId === reply.id" class="space-y-4">
          <textarea
            v-model="editedContent"
            class="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[100px] resize-none"
          ></textarea>
          <div class="flex gap-3">
            <button @click="saveEdit" class="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">حفظ</button>
            <button @click="editingReplyId = null" class="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-300 transition-all">إلغاء</button>
          </div>
        </div>
        <div v-else class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {{ reply.content }}
        </div>
      </div>
    </div>

    <!-- الترقيم -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-6 mt-12">
      <button 
        class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-indigo-600 transition-all disabled:opacity-30" 
        :disabled="pageNumber === 1" 
        @click="pageNumber--"
      >
        <Icon name="ph:caret-right-bold" />
      </button>
      <span class="text-white font-black">
         {{ pageNumber }} / {{ totalPages }}
      </span>
      <button 
        class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-indigo-600 transition-all disabled:opacity-30" 
        :disabled="pageNumber === totalPages" 
        @click="pageNumber++"
      >
        <Icon name="ph:caret-left-bold" />
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
  animation: fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
</style>
