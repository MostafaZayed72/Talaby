<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const route = useRoute()

const proposalId = route.params.id as string

const replies = ref<any[]>([])
const pageNumber = ref(1)
const pageSize = ref(5)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')
const proposalContent = ref('')

const editingReplyId = ref<string | null>(null)
const editedContent = ref('')

// 🟢 جلب الإيميل من الـ API بدل JWT
const currentUserEmail = ref('')

const fetchCurrentUser = async () => {
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/identity/users/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) throw new Error('فشل تحميل بيانات المستخدم')

    const user = await res.json()
    currentUserEmail.value = user.email
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
    const url = new URL(`${config.public.API_BASE_URL}/project-proposals/${proposalId}/replies`)
    url.searchParams.set('pageNumber', pageNumber.value.toString())
    url.searchParams.set('pageSize', pageSize.value.toString())

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('فشل تحميل الردود')

    const data = await res.json()

    // 🟡 تحديث بناءً على الشكل الجديد
    proposalContent.value = data.proposalContent
    replies.value = data.replies.items
    totalPages.value = data.replies.totalPages
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
    const res = await fetch(`${config.public.API_BASE_URL}/proposal-replies/${id}`, {
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
    const res = await fetch(`${config.public.API_BASE_URL}/proposal-replies`, {
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
  <div class="mt-6 px-2">
    <h2 class="text-xl font-bold mb-4 text-purple-600">تفاصيل العرض:</h2>

    <div class="bg-purple-100 p-4 rounded text-gray-800 mb-6 border-l-4 border-purple-600">
      {{ proposalContent }}
    </div>

    <h2 class="text-xl font-bold mb-4 text-purple-600">الردود على العرض:</h2>

    <div v-if="loading">جاري التحميل...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-if="!loading && replies.length === 0" class="text-gray-500">لا توجد ردود بعد.</div>

    <div
      v-for="reply in replies"
      :key="reply.id"
      class="border rounded p-4 mb-4 shadow-sm"
      style="border-color: #7733bc !important;"
    >
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1 flex justify-between">
        <span>{{ reply.creatorEmail }}</span>
        <span class="text-xs text-gray-400">
          {{ new Date(reply.createdAt).toLocaleString() }}
        </span>
      </div>

      <!-- تعديل -->
      <div v-if="editingReplyId === reply.id">
        <textarea
          v-model="editedContent"
          class="w-full p-2 border border-gray-300 rounded mb-2"
          rows="3"
        ></textarea>
        <div class="flex gap-2">
          <button @click="saveEdit" class="btn">حفظ</button>
          <button @click="editingReplyId = null" class="btn bg-gray-400">إلغاء</button>
        </div>
      </div>
      <!-- عرض عادي -->
      <div v-else class="text-base text-gray-800 dark:text-white">
        {{ reply.content }}
      </div>

      <!-- أزرار التعديل والحذف -->
      <div
        v-if="reply.creatorEmail === currentUserEmail"
        class="mt-3 flex gap-3 text-sm"
      >
        <button class="text-blue-600 hover:underline" @click="startEdit(reply)">تعديل</button>
        <button class="text-red-600 hover:underline" @click="deleteReply(reply.id)">حذف</button>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center gap-4 mt-6">
      <button class="btn" :disabled="pageNumber === 1" @click="pageNumber--">السابق</button>
      <button class="btn" :disabled="pageNumber === totalPages" @click="pageNumber++">التالي</button>
    </div>
  </div>
</template>

<style scoped>
.btn {
  background-color: #4a3a6e;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 0.375rem;
}
.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
