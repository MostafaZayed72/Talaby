<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">بيانات المستخدم الحالي</h1>

    <div v-if="user">
      <p><strong>البريد الإلكتروني:</strong> {{ user.email }}</p>
      <p><strong>رقم السجل التجاري:</strong> {{ user.commercialRegisterNumber }}</p>
    </div>

    <div v-else>
      <p class="text-red-500">لا يوجد مستخدم مسجل دخول حالياً</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = await useCurrentUser()
</script>
