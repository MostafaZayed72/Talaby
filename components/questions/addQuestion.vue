<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const route = useRoute()
const token = useLocalStorage('token', '')
const roles = useLocalStorage('roles', []) // من نوع Array<string>

const emit = defineEmits(['question-added'])

// الحالة الخاصة بالاستفسار
const showDialog = ref(false)
const content = ref('')

const projectRequestId = route.params.id as string

const postCategoryId = ref<number | null>(null)
const userCategoryId = ref<number | null>(null)
const projectStatusValue = ref<number | null>(null)

const canSubmit = computed(() => {
  return (
    roles.value.includes('Store') &&
    postCategoryId.value !== null &&
    userCategoryId.value !== null &&
    postCategoryId.value === userCategoryId.value &&
    projectStatusValue.value === 1
  )
})

// احضار كاتجوري البوست
const fetchPostCategory = async () => {
  const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${projectRequestId}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })

  if (res.ok) {
    const response = await res.json()
    postCategoryId.value = response.data.storeCategoryId
    projectStatusValue.value = response.data.statusValue
  }
}

// احضار كاتجوري المستخدم
const fetchUserCategory = async () => {
  const res = await fetch(`${config.public.API_BASE_URL}/identity/users/me`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })

  if (res.ok) {
    const response = await res.json()
    userCategoryId.value = response.data.storeCategoryId
  }
}

const submitQuestion = async () => {
  if (!content.value) return

  const body = {
    projectRequestId,
    content: content.value
  }

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-questions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      showDialog.value = false
      content.value = ''
      emit('question-added')
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchPostCategory()
  fetchUserCategory()
})
</script>

<template>
  <div v-if="canSubmit" class="mb-8">
    <button 
      @click="showDialog = true" 
      class="w-full bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl active:scale-95 flex items-center justify-center gap-3"
    >
      <Icon name="ph:question-bold" class="text-xl" />
      {{ $t('Send question') }}
    </button>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="showDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="showDialog = false"></div>
          
          <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 p-8 md:p-10 animate-modal-in overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
            
            <div class="relative z-10">
              <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">{{ $t('Send question') }}</h2>
                <button @click="showDialog = false" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <Icon name="ph:x-bold" class="text-xl dark:text-white" />
                </button>
              </div>

              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Question details') }}</label>
                  <textarea
                    v-model="content"
                    :placeholder="$t('Enter your question clearly')"
                    class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white min-h-[150px] resize-none transition-all"
                  ></textarea>
                </div>

                <div class="flex gap-4 pt-4">
                  <button 
                    @click="submitQuestion" 
                    class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Icon name="ph:paper-plane-tilt-bold" class="text-xl" />
                    {{ $t('Send') }}
                  </button>
                  <button 
                    @click="showDialog = false" 
                    class="flex-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-black py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/20 transition-all active:scale-95"
                  >
                    {{ $t('Cancel') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

@keyframes modal-in {
  from { transform: scale(0.9) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
.animate-modal-in {
  animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
