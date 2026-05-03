<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 font-sans">
    <div v-if="loading" class="text-center space-y-6">
      <div class="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto shadow-2xl"></div>
      <h2 class="text-2xl font-black text-slate-900 dark:text-white italic animate-pulse">
        {{ $t('Verifying Payment...') }}
      </h2>
    </div>

    <div v-else-if="status === 'success'" class="max-w-md w-full bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/10 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div class="w-24 h-24 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg border border-green-500/20">
        <Icon name="ph:check-circle-fill" class="text-6xl" />
      </div>
      <div class="space-y-4">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Payment Successful!') }}</h1>
        <p class="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
          {{ $t('Thank you! Your commission payment has been verified successfully. Your request status has been updated.') }}
        </p>
        <div v-if="paymentInfo" class="mt-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-sm text-slate-500 dark:text-slate-400 font-bold space-y-1">
          <p>{{ $t('Payment Status') }}: {{ paymentInfo.paymentStatus }}</p>
          <p v-if="paymentInfo.paidAt">{{ $t('Paid At') }}: {{ new Date(paymentInfo.paidAt).toLocaleString() }}</p>
        </div>
      </div>
      <div class="pt-4 flex flex-col gap-4">
        <NuxtLink 
          :to="`/requests/${requestId}`" 
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <Icon name="ph:arrow-right-bold" />
          {{ $t('Go to Request Details') }}
        </NuxtLink>
        <NuxtLink 
          to="/dashboard/requests" 
          class="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-5 rounded-2xl font-black transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {{ $t('Back to Dashboard') }}
        </NuxtLink>
      </div>
    </div>

    <div v-else class="max-w-md w-full bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div class="w-24 h-24 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg border border-red-500/20">
        <Icon name="ph:warning-circle-fill" class="text-6xl" />
      </div>
      <div class="space-y-4">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Payment Verification Failed') }}</h1>
        <p class="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
          {{ errorMsg || $t('We could not verify your payment. Please contact support if you believe this is an error.') }}
        </p>
      </div>
      <div class="pt-4 flex flex-col gap-4">
        <button 
          @click="verifyPayment" 
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <Icon name="ph:arrow-clockwise-bold" />
          {{ $t('Try Again') }}
        </button>
        <NuxtLink 
          to="/dashboard/requests" 
          class="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-5 rounded-2xl font-black transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {{ $t('Go to Dashboard') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const token = useCookie('token')

const loading = ref(true)
const status = ref('pending') // success, error
const errorMsg = ref('')
const requestId = ref('')
const paymentInfo = ref(null)

const verifyPayment = async () => {
  loading.value = true
  status.value = 'pending'
  
  const tap_id = route.query.tap_id
  const pendingPaymentId = useCookie('pending_payment_project_id')
  requestId.value = pendingPaymentId.value

  if (!requestId.value) {
    status.value = 'error'
    errorMsg.value = 'No pending payment found for this project.'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${requestId.value}/commission-payment/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    const data = await res.json()

    if (data.isSuccess && data.data.isPaid) {
      status.value = 'success'
      paymentInfo.value = data.data
      // تنظيف الـ Cookie بعد النجاح
      pendingPaymentId.value = null
    } else {
      status.value = 'error'
      errorMsg.value = data.message || (data.data && !data.data.isPaid ? 'Payment not yet confirmed.' : 'Verification failed.')
    }
  } catch (err) {
    status.value = 'error'
    errorMsg.value = 'An unexpected error occurred during verification.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  verifyPayment()
})
</script>

<style scoped>
/* Glassmorphism fixes for dark mode */
.dark .bg-white {
  background-color: #0f172a !important; /* slate-900 */
}
</style>
