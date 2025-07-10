<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const route = useRoute()

const replyContent = ref('')
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// projectQuestionId من مسار الصفحة الحالية
const questionId = route.params.id as string

const emit = defineEmits<{
  (e: 'reply-added'): void
}>()

const submitReply = async () => {
  if (!replyContent.value.trim()) return

  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/question-replies`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectQuestionId: questionId,
        content: replyContent.value,
      }),
    })

    if (!res.ok) throw new Error('فشل إرسال التعليق')

    replyContent.value = ''
    successMessage.value = 'تم إرسال التعليق بنجاح'
    emit('reply-added')
  } catch (err: any) {
    errorMessage.value = err.message || 'حدث خطأ أثناء إرسال التعليق'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="border rounded p-4 mt-6 shadow-sm" style="border-color: #7733bc !important;">
    <h3 class="text-lg font-bold mb-3 text-purple-500">أضف تعليقاً على الاستفسار</h3>

    <textarea
      v-model="replyContent"
      rows="4"
      class="w-full p-2 border rounded mb-3 dark:bg-gray-800"
      placeholder="اكتب تعليقك هنا..."
    ></textarea>

    <button
      @click="submitReply"
      :disabled="submitting || !replyContent.trim()"
      class="btn"
    >
      {{ submitting ? 'جارٍ الإرسال...' : 'أضف تعليق' }}
    </button>

    <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.btn {
  background-color: #4a3a6e;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 0.375rem;
}
.btn:disabled {
  background-color: #ccc;
  color: black;
  cursor: not-allowed;
}
</style>
