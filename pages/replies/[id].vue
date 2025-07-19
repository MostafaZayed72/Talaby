<script setup lang="ts">
import { ref } from 'vue'

// نحضر ref لكومبوننت الردود
const repliesRef = ref<InstanceType<typeof RequestsGetReplies> | null>(null)

const handleReplyAdded = () => {
  repliesRef.value?.fetchReplies()
}
definePageMeta({
  middleware: ['auth-replies'],
})

</script>

<template>
  <div>
    <!-- الكومبوننت اللي يعرض الردود -->
    <RequestsGetReplies ref="repliesRef" />

    <!-- الكومبوننت اللي يضيف تعليق -->
    <RequestsAddReply @reply-added="handleReplyAdded" />
  </div>
</template>
