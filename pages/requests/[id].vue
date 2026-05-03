<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCurrentUser } from '~/composables/useCurrentUser'
import { useLocalStorage } from '@vueuse/core'

const config = useRuntimeConfig()
const route = useRoute()
const token = useLocalStorage('token', '')
const { user } = await useCurrentUser()

const postId = route.params.id as string
const project = ref<any>(null)
const projectLoading = ref(true)

const fetchProject = async () => {
  projectLoading.value = true
  try {
    const res = await fetch(`${config.public.API_BASE_URL}/project-requests/${postId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (res.ok) {
      const response = await res.json()
      project.value = response.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    projectLoading.value = false
  }
}

onMounted(fetchProject)

const proposalsRef = ref<any>(null)
const questionsRef = ref<any>(null)

const handleProposalAdded = () => {
  proposalsRef.value?.fetchProposals()
}

const handleQuestionAdded = () => {
  questionsRef.value?.fetchQuestions()
}
</script>

<template>
  <div class="min-h-screen pb-20 px-4 md:px-6 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Request Header/Details -->
      <div class="mb-12">
        <RequestsGet :project="project" :loading="projectLoading" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <!-- Proposals Column -->
        <div class="space-y-12">
          <div class="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="ph:handshake-bold" class="text-xl md:text-2xl text-white" />
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Proposals') }}</h2>
          </div>
          
          <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
            <RequestsAddProposal :project="project" @proposal-added="handleProposalAdded" />
            <div class="mt-10 border-t border-white/10 pt-10">
              <RequestsGetProposals :project="project" ref="proposalsRef" />
            </div>
          </div>
        </div>

        <!-- Questions Column -->
        <div class="space-y-12">
          <div class="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="ph:chats-circle-bold" class="text-xl md:text-2xl text-violet-950" />
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Questions') }}</h2>
          </div>

          <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
            <QuestionsAddQuestion :project="project" @question-added="handleQuestionAdded" />
            <div class="mt-10 border-t border-white/10 pt-10">
              <QuestionsGetQuestions ref="questionsRef" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>