<script setup lang="ts">
import { onMounted } from 'vue'
import { useCurrentUser } from '~/composables/useCurrentUser'
import { useRuntimeConfig } from '#imports'

const currentUser = useCurrentUser()
const config = useRuntimeConfig()

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/moyasar-payment-form@2.0.14/dist/moyasar.umd.js'
  script.onload = () => {
    if (window.Moyasar) {
      window.Moyasar.init({
        element: '.mysr-form',
        amount: 1000, // 1000 هللة = 10 ريال
        currency: 'SAR',
        description: 'طلب خدمة من DevWork',
        publishable_api_key: 'pk_test_7ZNKxwkRagWKMHiXjgYdsXhRJe17kN3sFD8z5eyF',
        methods: ['creditcard'],
        callback_url: window.location.origin, // وهمي لتفادي الخطأ

        on_completed: async function (payment) {
          console.log('✅ تم الدفع:', payment)

          // 1. الحصول على بيانات المستخدم من composable
          const user = currentUser.value
          console.log('👤 المستخدم الحالي:', user)

          // 2. استدعاء users من الـ API
          try {
            const res = await fetch(`${config.public.API_BASE_URL}/identity/users`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            })
            const usersData = await res.json()
            console.log('📥 بيانات جميع المستخدمين:', usersData)
          } catch (err) {
            console.error('❌ فشل في جلب المستخدمين:', err)
          }

          // 3. إرسال بيانات الدفع + المستخدم للسيرفر
          try {
            await fetch(`${config.public.API_BASE_URL}/identity/moyasar`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payment,
                user,
              }),
            })
            console.log('✅ تم إرسال بيانات الدفع بنجاح')
          } catch (err) {
            console.error('❌ فشل في إرسال بيانات الدفع:', err)
          }

          // 4. إعادة التوجيه بعد نجاح الدفع
          window.location.href = '/thank-you' // غيّره حسب المسار اللي عايز تحول له
        }
      })
    }
  }
  document.body.appendChild(script)
})
</script>

<template>
  <div class="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden flex items-center justify-center">
    <!-- Background Decorations -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]"></div>

    <div class="relative z-10 w-full max-w-2xl">
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-3xl shadow-xl mb-6 transform rotate-3">
            <Icon name="ph:credit-card-bold" class="text-4xl text-white" />
          </div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight italic">
            {{ $t('Secure Payment') }}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            {{ $t('Complete your request by paying the service fee securely.') }}
          </p>
        </div>

        <link
          rel="stylesheet"
          href="https://unpkg.com/moyasar-payment-form@2.0.14/dist/moyasar.css"
        />

        <div class="bg-white rounded-3xl p-6 shadow-inner border border-slate-100 overflow-hidden">
          <form class="mysr-form w-full"></form>
        </div>

        <div class="mt-8 flex items-center justify-center gap-4 text-slate-400">
           <Icon name="ph:shield-check-fill" class="text-2xl text-green-500" />
           <span class="text-sm font-bold uppercase tracking-widest">{{ $t('Encrypted & Secure') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Moyasar Form Overrides to match design */
.mysr-form {
  border: none !important;
  box-shadow: none !important;
}
.mysr-form .mysr-submit-button {
  background-color: #4f46e5 !important; /* Indigo-600 */
  border-radius: 1rem !important;
  font-weight: 900 !important;
  padding: 1rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  transition: all 0.3s !important;
}
.mysr-form .mysr-submit-button:hover {
  background-color: #4338ca !important; /* Indigo-700 */
  transform: translateY(-2px) !important;
  box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4) !important;
}
</style>
