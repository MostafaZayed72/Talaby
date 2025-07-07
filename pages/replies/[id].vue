<template>
    <div>
        <RequestsGetReplies :replies="replies"/>
        <RequestsAddReply @reply-added="fetchReplies"/>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AddReply from '@/components/AddReply.vue'
import RepliesList from '@/components/RepliesList.vue'
import { useReplies } from '@/composables/useReplies'

const { fetchReplies, replies } = useReplies()

onMounted(fetchReplies)
</script>
