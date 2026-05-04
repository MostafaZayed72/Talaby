<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const token = useCookie('token')
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

const currentUserEmail = ref('')
const currentUserId = ref('')
const proposalData = ref<any>(null)
const showMarkDoneDialog = ref(false)
const isMarkingDone = ref(false)
const isProcessingPayment = ref(false)
const showPaymentConfirmDialog = ref(false)
const selectedPaymentAmount = ref(0)

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
    currentUserId.value = response.data.id
  } catch (err) {
    console.error('فشل الحصول على المستخدم الحالي')
  }
}

onMounted(async () => {
  await fetchCurrentUser()
  await fetchReplies()
  startPolling() // 👈 نبدأ التحديث التلقائي
})

onUnmounted(() => {
  if (pollingInterval.value) clearInterval(pollingInterval.value)
})

const fetchReplies = async () => {
  // loading.value = true // Commented out to prevent flicker during polling
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

    const response = await res.json()
    const result = response.data
    proposalData.value = result // تخزين البيانات كاملة
    proposalContent.value = result.proposalContent
    replies.value = (result.replies.items || []).reverse()
    totalPages.value = result.replies.totalPages || 1
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تحميل الردود'
  } finally {
    loading.value = false
  }
}

const confirmMarkAsDone = async () => {
  showMarkDoneDialog.value = false
  isMarkingDone.value = true
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${proposalData.value.projectRequestId}/mark-done`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    if (!res.ok) throw new Error('فشل إتمام المهمة')
    await fetchReplies()
  } catch (err: any) {
    alert(err.message)
  } finally {
    isMarkingDone.value = false
  }
}

const markAsDone = () => {
  showMarkDoneDialog.value = true
}

const payCommission = async () => {
  if (!proposalData.value) return
  
  // حساب العمولة 2.5%
  selectedPaymentAmount.value = (proposalData.value.proposedAmount || 0) * 0.025
  showPaymentConfirmDialog.value = true
}

const confirmAndPay = async () => {
  showPaymentConfirmDialog.value = false
  isProcessingPayment.value = true
  try {
    // No need to save to localStorage as projectRequestId is passed in the redirect URL
    
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${proposalData.value.projectRequestId}/commission-payment/checkout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error('فشل إنشاء طلب الدفع')
    const response = await res.json()
    if (response.isSuccess && response.data.checkoutUrl) {
      window.open(response.data.checkoutUrl, '_blank')
    }
  } catch (err: any) {
    alert(err.message)
  } finally {
    isProcessingPayment.value = false
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

// ⏱️ تحديث الردود تلقائيًا كل 5 ثوانٍ
const pollingInterval = ref<any>(null)

const startPolling = () => {
  pollingInterval.value = setInterval(() => {
    fetchReplies()
  }, 10000) // كل 5 ثوانٍ
}
</script>


<template>
  <div class="mt-12 space-y-8 px-2 animate-fade-in">
    <div class="flex items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="ph:chat-teardrop-dots-bold" class="text-2xl text-white" />
        </div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">
          {{ $t('Replies on Proposal') }}
        </h2>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- زر إتمام المهمة: يظهر لمقدم الخدمة إذا كان العرض مقبولاً والطلب لم ينتهِ بعد -->
        <button 
          v-if="proposalData && (currentUserId === proposalData.proposalCreatorId || currentUserEmail === proposalData.proposalCreatorEmail) && (proposalData.proposalStatusValue === 2 || String(proposalData.proposalStatus).toLowerCase() === 'accepted')"
          @click="markAsDone"
          :disabled="isMarkingDone"
          class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          <Icon v-if="isMarkingDone" name="ph:circle-notch-bold" class="animate-spin" />
          <Icon v-else name="ph:check-circle-bold" />
          {{ $t('Mark as Done') }}
        </button>

        <!-- زر دفع العمولة: يظهر لصاحب الطلب فقط إذا كانت الحالة بانتظار الدفع -->
        <button 
          v-if="proposalData && (currentUserId === proposalData.projectRequestCreatorId || currentUserEmail === proposalData.projectRequestCreatorEmail) && (String(proposalData.projectRequestStatus).toLowerCase() === 'awaitingcommissionpayment')"
          @click="payCommission"
          :disabled="isProcessingPayment"
          class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          <Icon v-if="isProcessingPayment" name="ph:circle-notch-bold" class="animate-spin" />
          <Icon v-else name="ph:credit-card-bold" />
          {{ $t('Pay Commission') }}
        </button>

        <RequestsCancelProposal v-if="proposalData && proposalData.proposalStatusValue !== 3 && String(proposalData.proposalStatus).toLowerCase() !== 'completed'" />
      </div>
    </div>

    <!-- عرض العرض الأصلي -->
    <div
      v-if="proposalContent"
      class="relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border-l-8 border-indigo-600 p-8 rounded-[2rem] shadow-xl overflow-hidden group"
    >
      <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors"></div>
      <div class="mb-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        {{ $t('Original Proposal Content') }}
      </div>
      <p class="relative z-10 text-xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
        "{{ proposalContent }}"
      </p>
    </div>

    <!-- قائمة الردود -->
    <div v-if="!loading && replies.length === 0" class="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10">
      <Icon name="ph:chats-bold" class="text-5xl text-slate-300 mb-4" />
      <p class="text-slate-500 dark:text-slate-400 font-bold">{{ $t('No replies yet.') }}</p>
    </div>

    <div class="flex flex-col space-y-6">
      <div
        v-for="reply in replies"
        :key="reply.id"
        class="w-full rounded-[2rem] p-6 md:p-8 shadow-md hover:shadow-xl transition-all relative flex flex-col"
        :class="[
          reply.creatorEmail === currentUserEmail 
            ? 'bg-indigo-600 text-white border-r-4 border-r-indigo-400/50' 
            : 'bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white border-r-4 border-r-slate-400/50'
        ]"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  :class="reply.creatorEmail === currentUserEmail ? 'bg-white/20 text-white' : 'bg-indigo-600/10 text-indigo-600'">
                <Icon name="ph:user-bold" />
             </div>
             <div>
                <p class="text-sm font-black" :class="reply.creatorEmail === currentUserEmail ? 'text-white' : 'text-slate-900 dark:text-white'">
                  {{ reply.creatorEmail }}
                </p>
                <p class="text-[10px] uppercase tracking-widest font-bold mt-0.5" :class="reply.creatorEmail === currentUserEmail ? 'text-indigo-200' : 'text-slate-400'">
                   {{ new Date(reply.createdAt).toLocaleString() }}
                </p>
             </div>
          </div>
          
          <div v-if="reply.creatorEmail === currentUserEmail" class="flex gap-2 shrink-0">
            <button @click="startEdit(reply)" class="p-2 rounded-lg hover:bg-white/20 text-white transition-colors">
              <Icon name="ph:pencil-simple-bold" />
            </button>
            <button @click="deleteReply(reply.id)" class="p-2 rounded-lg hover:bg-red-400/20 text-red-200 transition-colors">
              <Icon name="ph:trash-bold" />
            </button>
          </div>
        </div>

        <div v-if="editingReplyId === reply.id" class="space-y-4">
          <textarea
            v-model="editedContent"
            class="w-full bg-black/10 border border-white/20 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-white text-white min-h-[100px] resize-none"
          ></textarea>
          <div class="flex gap-3">
            <button @click="saveEdit" class="bg-white text-indigo-600 px-6 py-2 rounded-xl font-black hover:bg-indigo-50 transition-all">حفظ</button>
            <button @click="editingReplyId = null" class="bg-indigo-500/50 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-400 transition-all">إلغاء</button>
          </div>
        </div>
        <div v-else class="text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap" :class="reply.creatorEmail === currentUserEmail ? 'text-white/95' : 'text-slate-700 dark:text-slate-300'">
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

    <!-- Dialog إتمام المهمة الاحترافي -->
    <div v-if="showMarkDoneDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" @click="showMarkDoneDialog = false"></div>
      <div class="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div class="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
           <Icon name="ph:check-circle-bold" class="text-4xl" />
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-slate-900 dark:text-white italic">{{ $t('Complete Request') }}</h3>
          <p class="text-slate-500 dark:text-slate-400 font-medium">{{ $t('Are you sure you have completed the task and want to mark it as done?') }}</p>
        </div>
        <div class="flex gap-4">
          <button
            class="flex-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-2xl font-black transition-all hover:bg-slate-200"
            @click="showMarkDoneDialog = false"
          >
            {{ $t('Cancel') }}
          </button>
          <button
            class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            @click="confirmMarkAsDone"
          >
            {{ $t('Yes, Done') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog تأكيد الدفع الاحترافي -->
    <div v-if="showPaymentConfirmDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="showPaymentConfirmDialog = false"></div>
      <div class="relative bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div class="w-20 h-20 bg-yellow-400/10 text-yellow-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg border border-yellow-400/20">
           <Icon name="ph:credit-card-bold" class="text-4xl" />
        </div>
        <div class="space-y-3">
          <h3 class="text-2xl font-black text-slate-900 dark:text-white italic">{{ $t('Commission Payment') }}</h3>
          <p class="text-slate-600 dark:text-slate-400 font-bold">{{ $t('The commission amount to be paid is:') }}</p>
          <div class="text-4xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400 py-4 drop-shadow-sm">
            {{ selectedPaymentAmount.toFixed(2) }} {{ $t('SAR') }}
          </div>
          <p class="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{{ $t('2.5% of the total proposal amount') }}</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            class="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-2xl font-black transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
            @click="showPaymentConfirmDialog = false"
          >
            {{ $t('Cancel') }}
          </button>
          <button
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            @click="confirmAndPay"
          >
            {{ $t('Confirm & Pay') }}
          </button>
        </div>
      </div>
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
