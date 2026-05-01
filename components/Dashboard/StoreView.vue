<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Earnings & Performance Header -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <Icon name="ph:sketch-logo-fill" class="absolute -right-10 -top-10 text-[20rem] text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
        <div class="relative z-10 flex flex-col md:flex-row justify-between gap-8">
          <div class="space-y-2">
            <p class="text-indigo-100 font-black uppercase tracking-[0.2em] text-xs">{{ $t('Total Earnings') }}</p>
            <h2 class="text-5xl md:text-6xl font-black text-white italic tracking-tighter">
              ${{ data.earningsStats.totalCompletedProposalAmount }}
            </h2>
            <div class="pt-4 flex items-center gap-6">
              <div class="flex flex-col">
                <span class="text-indigo-200 text-[10px] font-black uppercase">{{ $t('Average') }}</span>
                <span class="text-white font-bold">${{ data.earningsStats.averageAcceptedProposalAmount }}</span>
              </div>
              <div class="w-px h-8 bg-white/20"></div>
              <div class="flex flex-col">
                <span class="text-indigo-200 text-[10px] font-black uppercase">{{ $t('Accepted') }}</span>
                <span class="text-white font-bold">${{ data.earningsStats.totalAcceptedProposalAmount }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-between items-end">
            <div class="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-white font-black text-sm italic">
              {{ $t('Top Rated Provider') }}
            </div>
            <div class="flex gap-2">
              <div v-for="i in 5" :key="i" class="w-2 h-2 rounded-full bg-yellow-400"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Commission Quick Card -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/20 shadow-2xl flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white italic mb-6 flex items-center gap-3">
            <Icon name="ph:percent-fill" class="text-yellow-400" />
            {{ $t('Commissions') }}
          </h3>
          <div class="space-y-4">
             <div class="flex justify-between items-center">
                <span class="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{{ $t('Paid') }}</span>
                <span class="text-slate-900 dark:text-white font-black">${{ data.commissionStats.totalCommissionPaid }}</span>
             </div>
             <div class="h-2 bg-slate-100 dark:bg-white/5 rounded-full">
                <div class="h-full bg-yellow-400 rounded-full" style="width: 75%"></div>
             </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-8">
           <div class="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-white/5">
              <p class="text-[10px] font-black text-slate-400 uppercase mb-1">{{ $t('Pending') }}</p>
              <p class="text-xl font-black text-slate-900 dark:text-white">{{ data.commissionStats.pendingCount }}</p>
           </div>
           <div class="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-white/5">
              <p class="text-[10px] font-black text-slate-400 uppercase mb-1">{{ $t('Failed') }}</p>
              <p class="text-xl font-black text-slate-900 dark:text-white">{{ data.commissionStats.failedCount }}</p>
           </div>
        </div>
      </div>
    </div>

    <!-- Stats Breakdown Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in workStats" :key="stat.label" 
        class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl group hover:-translate-y-2 transition-all">
        <div :class="`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${stat.bgClass}`">
          <Icon :name="stat.icon" class="text-2xl text-white" />
        </div>
        <p class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2">{{ $t(stat.label) }}</p>
        <p class="text-4xl font-black text-slate-900 dark:text-white italic">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Recent Proposals Table -->
    <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden">
      <div class="p-8 border-b border-white/10 flex items-center justify-between">
        <h3 class="text-xl font-black text-slate-900 dark:text-white italic flex items-center gap-3">
          <Icon name="ph:clock-countdown-fill" class="text-indigo-600" />
          {{ $t('Recent Proposals') }}
        </h3>
        <button class="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">{{ $t('View All') }}</button>
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
