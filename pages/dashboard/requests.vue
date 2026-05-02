<template>
  <div>
    <DashboardClientRequests v-if="userRole === 'Client'" />
    <DashboardProviderProposals v-else-if="userRole === 'Store'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const userRole = ref('')
const roles = useLocalStorage('roles', [])

onMounted(() => {
  if (roles.value.includes('Store')) {
    userRole.value = 'Store'
    setPageLayout('provider')
  } else if (roles.value.includes('Client')) {
    userRole.value = 'Client'
    setPageLayout('client')
  }
})
</script>
