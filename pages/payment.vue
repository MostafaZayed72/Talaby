<script setup lang="ts">
import { onMounted } from 'vue'

// تحميل سكربت Moyasar
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/moyasar-payment-form@2.0.14/dist/moyasar.umd.js'
  script.onload = () => {
    if (window.Moyasar) {
      window.Moyasar.init({
        element: '.mysr-form',
        amount: 1000, // المبلغ بـ halalas (مثلاً 1000 = 10 ريال)
        currency: 'SAR',
        description: 'طلب خدمة من DevWork',
        publishable_api_key: 'pk_test_7ZNKxwkRagWKMHiXjgYdsXhRJe17kN3sFD8z5eyF',
        methods: ['creditcard'],
        callback_url: 'https://www.my-store.com/payments_redirect?id=79cced57-9deb-4c4b-8f48-59c124f79688&status=paid&message=Succeeded',
        on_completed: async function (payment) {
          console.log('تم الدفع بنجاح:', payment)

          await fetch('https://localhost:7072/api/identity/moyasar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment)
          })
        }
      })
    }
  }
  document.body.appendChild(script)
})
</script>

<template>
  <div class="max-w-xl mx-auto p-6 " style="background-color: white; color: black;">
    <h1 class="text-2xl font-bold mb-4">صفحة الدفع</h1>

    <!-- استدعاء CSS الخاص بـ Moyasar -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/moyasar-payment-form@2.0.14/dist/moyasar.css"
    />

    <form class="mysr-form"></form>
  </div>
</template>
