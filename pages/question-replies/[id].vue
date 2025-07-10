<script setup lang="ts">
import { ref } from 'vue'

// نحضر ref لكومبوننت الردود
const repliesRef = ref<InstanceType<typeof RequestsGetReplies> | null>(null)

const handleReplyAdded = () => {
  repliesRef.value?.fetchReplies()
}
</script>

<template>
  <div>
    <!-- الكومبوننت اللي يعرض الردود -->
    <QuestionsGetReplies ref="repliesRef" />

    <!-- الكومبوننت اللي يضيف تعليق -->
    <QuestionsAddReply @reply-added="handleReplyAdded" />
  </div>
</template>
