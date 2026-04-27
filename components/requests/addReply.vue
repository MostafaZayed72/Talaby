<!-- components/AddReply.vue -->
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

// projectProposalId من مسار الصفحة الحالية
const proposalId = route.params.id as string
const emit = defineEmits<{
  (e: 'reply-added'): void
}>()
const submitReply = async () => {
  if (!replyContent.value.trim()) return

  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/proposal-replies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectProposalId: proposalId,
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
  <div class="mt-8 bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors"></div>
    
    <div class="relative z-10">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-600">
          <Icon name="ph:chat-centered-text-bold" class="text-xl" />
        </div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white italic tracking-tight">{{ $t('Add a Reply') }}</h3>
      </div>

      <textarea
        v-model="replyContent"
        rows="4"
        class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all resize-none mb-6"
        :placeholder="$t('Write your reply here...')"
      ></textarea>

      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          @click="submitReply"
          :disabled="submitting || !replyContent.trim()"
          class="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
        >
          <Icon v-if="submitting" name="ph:circle-notch-bold" class="animate-spin" />
          <Icon v-else name="ph:paper-plane-tilt-bold" />
          {{ submitting ? $t('Sending...') : $t('Add Reply') }}
        </button>

        <div class="flex-1 text-right">
          <p v-if="successMessage" class="text-green-500 font-bold flex items-center gap-2 justify-end">
            <Icon name="ph:check-circle-bold" />
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="text-red-500 font-bold flex items-center gap-2 justify-end">
            <Icon name="ph:warning-circle-bold" />
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base styles managed by Tailwind */
</style>
