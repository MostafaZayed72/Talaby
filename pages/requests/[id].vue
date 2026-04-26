<template>
  <div class="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Request Header/Details -->
      <div class="mb-12">
        <RequestsGet />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Proposals Column -->
        <div class="space-y-12">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="ph:handshake-bold" class="text-2xl text-white" />
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Proposals') }}</h2>
          </div>
          
          <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl">
            <RequestsAddProposal />
            <div class="mt-10 border-t border-white/10 pt-10">
              <RequestsGetProposals />
            </div>
          </div>
        </div>

        <!-- Questions Column -->
        <div class="space-y-12">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="ph:chats-circle-bold" class="text-2xl text-violet-950" />
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Questions') }}</h2>
          </div>

          <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl">
            <QuestionsAddQuestion />
            <div class="mt-10 border-t border-white/10 pt-10">
              <QuestionsGetQuestions />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>