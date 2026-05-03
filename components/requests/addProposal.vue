<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { useRuntimeConfig } from '#imports'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
const token = useLocalStorage('token', '')
const roles = useLocalStorage('roles', []) // من نوع Array<string>

const emit = defineEmits(['proposal-added'])

// الحالة الخاصة بالعرض
const showDialog = ref(false)
const content = ref('')
const proposedAmount = ref<number | null>(null)

const projectRequestId = route.params.id as string

const postCategoryId = ref<number | null>(null)
const userCategoryId = ref<number | null>(null)
const projectStatusValue = ref<number | null>(null)
const projectStatusName = ref<string>('')

const canSubmit = computed(() => {
  const isStore = roles.value.some((r: any) => String(r).toLowerCase() === 'store')
  const hasCategories = postCategoryId.value != null && userCategoryId.value != null
  const isSameCategory = String(postCategoryId.value) === String(userCategoryId.value)
  
  // More robust status check: If status is undefined, we assume it's open for now to debug
  const statusVal = projectStatusValue.value
  const statusNm = projectStatusName.value?.toLowerCase()
  const isOpen = statusVal === 1 || statusVal === 0 || statusNm === 'open' || statusNm === undefined || statusNm === '' || statusNm === 'string'
  
  console.log('DEBUG addProposal - canSubmit Details:', {
    roles: roles.value,
    isStore,
    postCategoryId: postCategoryId.value,
    userCategoryId: userCategoryId.value,
    isSameCategory,
    projectStatusValue: statusVal,
    projectStatusName: projectStatusName.value,
    isOpen
  })

  return isStore && hasCategories && isSameCategory && isOpen
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
    console.log('DEBUG addProposal - Project Data Keys:', Object.keys(response.data))
    console.log('DEBUG addProposal - Project Data Full:', response.data)
    postCategoryId.value = response.data.storeCategoryId || response.data.categoryId
    projectStatusValue.value = response.data.statusValue !== undefined ? response.data.statusValue : response.data.status
    projectStatusName.value = response.data.statusName || response.data.status
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

const submitProposal = async () => {
  if (!content.value || proposedAmount.value === null) return

  const body = {
    projectRequestId,
    content: content.value,
    proposedAmount: proposedAmount.value,
  }

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-proposals`, {
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
      proposedAmount.value = null
      emit('proposal-added')
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
      class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl active:scale-95 flex items-center justify-center gap-3"
    >
      <Icon name="ph:paper-plane-tilt-bold" class="text-xl" />
      {{ $t('Send offer') }}
    </button>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="showDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="showDialog = false"></div>
          
          <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 p-8 md:p-10 animate-modal-in overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
            
            <div class="relative z-10" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
              <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">{{ $t('Send offer') }}</h2>
                <button @click="showDialog = false" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <Icon name="ph:x-bold" class="text-xl dark:text-white" />
                </button>
              </div>

              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Offer details') }}</label>
                  <textarea
                    v-model="content"
                    :placeholder="$t('Offer content includes pricing details')"
                    class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[150px] resize-none transition-all"
                  ></textarea>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ $t('Total Budget') }}</label>
                  <div class="relative group">
                    <div 
                      class="absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors font-bold text-sm"
                      :class="locale === 'ar' ? 'right-4' : 'left-4'"
                    >
                      {{ locale === 'ar' ? 'ر.س' : 'SAR' }}
                    </div>
                    <input
                      v-model.number="proposedAmount"
                      type="number"
                      :placeholder="$t('Total price including tax')"
                      class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-bold"
                      :class="locale === 'ar' ? 'pr-14 pl-6 text-right' : 'pl-12 pr-6 text-left'"
                    />
                  </div>
                </div>

                <div class="flex gap-4 pt-4">
                  <button 
                    @click="submitProposal" 
                    class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Icon name="ph:check-circle-bold" class="text-xl" />
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
