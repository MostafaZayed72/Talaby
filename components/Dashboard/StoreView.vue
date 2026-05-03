<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Earnings & Performance Header -->
      <div class="lg:col-span-3 bg-gradient-to-br from-indigo-600 to-violet-700 p-10 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
        <Icon name="ph:sketch-logo-fill" class="absolute -right-10 -top-10 text-[25rem] text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          <div class="space-y-4 text-center md:text-right w-full md:w-auto">
            <p class="text-indigo-100 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs opacity-80">{{ $t('Total Earnings') }}</p>
            <h2 class="text-4xl sm:text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none">
              ${{ data.earningsStats.totalCompletedProposalAmount }}
            </h2>
            <div class="pt-6 md:pt-8 flex items-center justify-center md:justify-start gap-6 md:gap-10">
              <div class="flex flex-col">
                <span class="text-indigo-200 text-[10px] md:text-xs font-black uppercase tracking-wider mb-1">{{ $t('Average') }}</span>
                <span class="text-2xl md:text-3xl font-black text-white italic">${{ data.earningsStats.averageAcceptedProposalAmount }}</span>
              </div>
              <div class="w-px h-10 md:h-12 bg-white/20"></div>
              <div class="flex flex-col">
                <span class="text-indigo-200 text-[10px] md:text-xs font-black uppercase tracking-wider mb-1">{{ $t('Accepted') }}</span>
                <span class="text-2xl md:text-3xl font-black text-white italic">${{ data.earningsStats.totalAcceptedProposalAmount }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col items-center md:items-end gap-4 md:gap-6">
            <div class="bg-white/15 backdrop-blur-xl px-6 md:px-10 py-3 md:py-5 rounded-2xl md:rounded-[2rem] border border-white/20 text-white font-black text-base md:text-lg italic shadow-2xl">
              {{ $t('Top Rated Provider') }}
            </div>
            <div class="flex gap-2 md:gap-3">
              <div v-for="i in 5" :key="i" class="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>

    <!-- Stats Breakdown Grid -->
    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div v-for="stat in workStats" :key="stat.label" 
        class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/20 shadow-xl group hover:-translate-y-1 md:hover:-translate-y-2 transition-all">
        <div :class="`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg ${stat.bgClass}`">
          <Icon :name="stat.icon" class="text-xl md:text-2xl text-white" />
        </div>
        <p class="text-[8px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 md:mb-2">{{ $t(stat.label) }}</p>
        <p class="text-2xl md:text-4xl font-black text-slate-900 dark:text-white italic">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Recent Proposals Table -->
    <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden">
      <div class="p-8 border-b border-white/10 flex items-center justify-between">
        <h3 class="text-xl font-black text-slate-900 dark:text-white italic flex items-center gap-3">
          <Icon name="ph:clock-countdown-fill" class="text-indigo-600" />
          {{ $t('Recent Proposals') }}
        </h3>
        <NuxtLink to="/dashboard/proposals" class="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">{{ $t('View All') }}</NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-right">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <th class="px-8 py-6">{{ $t('Project') }}</th>
              <th class="px-8 py-6 text-center">{{ $t('Amount') }}</th>
              <th class="px-8 py-6 text-center">{{ $t('Status') }}</th>
              <th class="px-8 py-6 text-center">{{ $t('Date') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="prop in data.recentProposals" :key="prop.id" class="hover:bg-white/5 transition-colors group">
              <td class="px-8 py-6">
                <span class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{{ prop.projectTitle }}</span>
              </td>
              <td class="px-8 py-6 text-center">
                <span class="px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl font-black text-xs">
                  ${{ prop.proposedAmount }}
                </span>
              </td>
              <td class="px-8 py-6 text-center">
                <span :class="statusClass(prop.proposalStatus)">
                  {{ $t(prop.proposalStatus) }}
                </span>
              </td>
              <td class="px-8 py-6 text-center">
                <span class="text-xs text-slate-500 font-bold">{{ new Date(prop.createdAt).toLocaleDateString() }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const workStats = computed(() => [
  { label: 'Total Proposals', value: props.data.proposalStats.total, icon: 'ph:file-text-fill', bgClass: 'bg-indigo-600' },
  { label: 'Active Projects', value: props.data.workStats.active, icon: 'ph:lightning-fill', bgClass: 'bg-yellow-500' },
  { label: 'Completed', value: props.data.workStats.completed, icon: 'ph:check-circle-fill', bgClass: 'bg-green-600' },
  { label: 'Accepted Rate', value: props.data.proposalStats.accepted, icon: 'ph:thumbs-up-fill', bgClass: 'bg-violet-600' },
])

const statusClass = (status) => {
  const base = 'px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider '
  switch (status.toLowerCase()) {
    case 'completed': return base + 'bg-green-500/10 text-green-500'
    case 'pending': return base + 'bg-yellow-500/10 text-yellow-500'
    case 'rejected': return base + 'bg-red-500/10 text-red-500'
    default: return base + 'bg-slate-500/10 text-slate-500'
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
