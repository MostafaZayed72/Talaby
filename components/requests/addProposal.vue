<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const route = useRoute()
const token = useLocalStorage('token', '')
const roles = useLocalStorage('roles', []) // من نوع Array<string>

// الحالة الخاصة بالعرض
const showDialog = ref(false)
const content = ref('')
const proposedAmount = ref<number | null>(null)

const projectRequestId = route.params.id as string

const postCategoryId = ref<number | null>(null)
const userCategoryId = ref<number | null>(null)

const canSubmit = computed(() => {
  return (
    roles.value.includes('Store') &&
    postCategoryId.value !== null &&
    userCategoryId.value !== null &&
    postCategoryId.value === userCategoryId.value
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
    const data = await res.json()
    postCategoryId.value = data.storeCategoryId
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
    const data = await res.json()
    userCategoryId.value = data.storeCategoryId
  }
}

const submitProposal = async () => {
  if (!content.value || proposedAmount.value === null) return

  const body = {
    projectRequestId,
    content: content.value,
    proposedAmount: proposedAmount.value,
  }

  const res = await fetch(`${config.public.API_BASE_URL}/project-proposals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (res.ok) {
    alert('تم إرسال العرض بنجاح!')
    showDialog.value = false
    content.value = ''
    proposedAmount.value = null
  } else {
    alert('حدث خطأ أثناء إرسال العرض')
  }
}

onMounted(() => {
  fetchPostCategory()
  fetchUserCategory()
})
</script>

<template>
  <div v-if="canSubmit">
    <button @click="showDialog = true" class="btn mx-10">📩 تقديم عرض</button>

    <div v-if="showDialog" class="dialog">
      <div class="dialog-content">
        <h2 class="text-lg font-bold mb-2">إرسال عرض</h2>

        <textarea
          v-model="content"
          placeholder="محتوى العرض"
          class="textarea mb-2 text-black"
        ></textarea>

        <input
          v-model.number="proposedAmount"
          type="number"
          placeholder="المبلغ المقترح"
          class="input mb-4 text-black"
        />

        <div class="flex justify-end gap-2">
          <button @click="submitProposal" class="btn">إرسال</button>
          <button @click="showDialog = false" class="btn-cancel">إلغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  background-color: #3a6e4e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
}

.input,
.textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}

.btn-cancel {
  background-color: #ccc;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
</style>
