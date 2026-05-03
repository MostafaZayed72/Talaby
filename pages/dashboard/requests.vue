<template>
  <div>
    <DashboardClientRequests v-if="userRole === 'Client'" />
    <DashboardProviderProposals v-else-if="userRole === 'Store'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

definePageMeta({
  middleware: 'auth'
})

const userRole = ref('')
const roles = useCookie('roles')

// Set role early for template
if (roles.value) {
  if (roles.value.includes('Store')) {
    userRole.value = 'Store'
  } else if (roles.value.includes('Client')) {
    userRole.value = 'Client'
  }
}
</script>
