<template>
  <div class="flex items-center justify-center h-screen ">
    <div v-if="alreadyConfirmed" class=" p-8 rounded shadow text-center max-w-md">
      <h2 class="text-2xl font-semibold mb-4 ">{{ $t('Email Already Confirmed') }}</h2>
      <p class="mb-6">{{ $t('Your email has already been confirmed. You can now use your account.') }}</p>
      <Button :label="$t('OK')" class="bg-purple-darken-3 text-white" @click="goHome" />
    </div>
    <Loader v-else-if="loading" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Loader from '@/components/Loader.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const alreadyConfirmed = ref(false)
const loading = ref(true)

const confirmEmail = async () => {
  const email = route.query.email
  const token = route.query.token

  if (!email || !token) {
    router.push('/')
    return
  }

  try {
    const response = await fetch(
      `https://devwork.runasp.net/api/identity/confirm-email?email=${email}&token=${encodeURIComponent(token as string)}`
    )

    const text = await response.text()

    if (response.ok) {
      // ✅ نجاح التفعيل، نعيد التوجيه للصفحة الرئيسية
      router.push('/')
    } else if (text.includes('Email already confirmed')) {
      alreadyConfirmed.value = true
    } else {
      // ⚠️ أي خطأ آخر، نعيد التوجيه للصفحة الرئيسية
      router.push('/')
    }
  } catch (error) {
    console.error('Confirmation error:', error)
    router.push('/')
  } finally {
    loading.value = false
  }
}

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  confirmEmail()
})
</script>
