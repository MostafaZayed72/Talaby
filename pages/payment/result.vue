<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const token = useLocalStorage('token', '')

const loading = ref(true)
const status = ref<'success' | 'error' | 'pending'>('pending')
const paymentData = ref<any>(null)
const errorMsg = ref('')

const verifyPayment = async () => {
  const projectId = localStorage.getItem('pending_payment_project_id')
  const tapId = route.query.tap_id
  
  if (!projectId) {
    status.value = 'error'
    errorMsg.value = 'لم يتم العثور على معلومات الطلب.'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${projectId}/commission-payment/verify`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    const response = await res.json()
    if (response.isSuccess && response.data.isPaid) {
      status.value = 'success'
      paymentData.value = response.data
    } else {
      status.value = 'error'
      errorMsg.value = response.message || 'فشلت عملية التحقق من الدفع.'
    }
  } catch (err) {
    status.value = 'error'
    errorMsg.value = 'حدث خطأ أثناء الاتصال بالخادم.'
  } finally {
    loading.value = false
    // تنظيف localStorage بعد المحاولة
    localStorage.removeItem('pending_payment_project_id')
  }
}

onMounted(() => {
  verifyPayment()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Abstract Background -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]"></div>

    <div class="relative z-10 w-full max-w-xl">
      <div class="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-10 md:p-16 shadow-2xl text-center">
        
        <!-- Loading State -->
        <div v-if="loading" class="space-y-8 animate-pulse">
          <div class="w-24 h-24 bg-indigo-600/20 rounded-[2rem] mx-auto flex items-center justify-center">
            <Icon name="ph:circle-notch-bold" class="text-5xl text-indigo-600 animate-spin" />
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">جاري التحقق من عملية الدفع...</h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium italic">يرجى عدم إغلاق الصفحة</p>
        </div>

        <!-- Success State -->
        <div v-else-if="status === 'success'" class="space-y-8 animate-fade-in">
          <div class="w-24 h-24 bg-green-500 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-green-500/20 transform rotate-3">
            <Icon name="ph:check-bold" class="text-5xl text-white" />
          </div>
          <div class="space-y-4">
            <h2 class="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">تم الدفع بنجاح!</h2>
            <p class="text-slate-600 dark:text-slate-400 font-bold">شكراً لك، تم سداد العمولة بنجاح وإتمام الطلب.</p>
          </div>
          
          <div v-if="paymentData" class="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 text-right">
             <div class="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span class="text-slate-400 font-bold uppercase tracking-widest">تاريخ الدفع</span>
                <span class="text-slate-900 dark:text-white font-black italic">{{ new Date(paymentData.paidAtUtc).toLocaleString() }}</span>
             </div>
             <div class="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span class="text-slate-400 font-bold uppercase tracking-widest">حالة الطلب</span>
                <span class="text-indigo-600 dark:text-indigo-400 font-black italic">{{ $t(paymentData.projectStatus) }}</span>
             </div>
             <div class="flex justify-between items-center text-sm">
                <span class="text-slate-400 font-bold uppercase tracking-widest">رقم العملية</span>
                <span class="text-slate-900 dark:text-white font-mono text-[10px]">{{ route.query.tap_id }}</span>
             </div>
          </div>

          <button 
            @click="router.push('/')"
            class="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black italic tracking-widest hover:scale-[1.02] transition-all shadow-xl active:scale-95"
          >
            العودة للرئيسية
          </button>
        </div>

        <!-- Error State -->
        <div v-else class="space-y-8 animate-fade-in">
          <div class="w-24 h-24 bg-red-500 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-red-500/20 transform -rotate-3">
            <Icon name="ph:x-bold" class="text-5xl text-white" />
          </div>
          <div class="space-y-4">
            <h2 class="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">عذراً، فشلت العملية</h2>
            <p class="text-red-500 font-bold">{{ errorMsg }}</p>
          </div>
          
          <div class="flex gap-4">
            <button 
              @click="verifyPayment"
              class="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black italic tracking-widest hover:scale-[1.02] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="ph:arrows-clockwise-bold" />
              إعادة المحاولة
            </button>
            <button 
              @click="router.push('/')"
              class="flex-1 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white py-5 rounded-2xl font-black italic tracking-widest hover:bg-slate-300 transition-all shadow-xl active:scale-95"
            >
              الرئيسية
            </button>
          </div>
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
