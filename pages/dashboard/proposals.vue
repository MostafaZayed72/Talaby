<template>
  <ProviderProposals />
</template>

<script setup>
import ProviderProposals from '~/components/Dashboard/ProviderProposals.vue'

definePageMeta({
  layout: 'provider',
  middleware: 'auth'
})
</script>
