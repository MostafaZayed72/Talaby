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
  <div class="max-w-xl mx-auto p-6" style="background-color: white; color: black;">
    <h1 class="text-2xl font-bold mb-4">صفحة الدفع</h1>

    <link
      rel="stylesheet"
      href="https://unpkg.com/moyasar-payment-form@2.0.14/dist/moyasar.css"
    />

    <form class="mysr-form"></form>
  </div>
</template>
