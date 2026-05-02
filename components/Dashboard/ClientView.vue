<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header: Welcome & Quick Actions -->
    <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/20 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg">
          <Icon name="ph:hand-waving-fill" class="text-4xl" />
        </div>
        <div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Welcome Back!') }}</h2>
          <p class="text-slate-500 font-bold">{{ $t('Manage your requests and track your orders.') }}</p>
        </div>
      </div>
      <NuxtLink to="/requests/add" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-5 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3">
        <Icon name="ph:plus-circle-fill" class="text-2xl" />
        {{ $t('New Request') }}
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Project Breakdown -->
      <div class="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
        <div v-for="stat in projectStats" :key="stat.label" 
          class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl group hover:bg-indigo-600 transition-all cursor-default">
          <Icon :name="stat.icon" :class="`text-3xl mb-4 group-hover:text-white ${stat.colorClass}`" />
          <p class="text-[10px] font-black text-slate-400 group-hover:text-indigo-100 uppercase tracking-widest mb-1">{{ $t(stat.label) }}</p>
          <p class="text-4xl font-black text-slate-900 dark:text-white group-hover:text-white italic">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Payment Summary -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col justify-between">
        <h3 class="text-xl font-black text-slate-900 dark:text-white italic mb-6 flex items-center gap-3">
          <Icon name="ph:credit-card-fill" class="text-green-500" />
          {{ $t('Payments') }}
        </h3>
        <div class="space-y-6">
          <div class="text-center">
            <p class="text-xs font-black text-slate-500 uppercase mb-1">{{ $t('Total Paid') }}</p>
            <p class="text-4xl font-black text-slate-900 dark:text-white italic">${{ data.paymentStats.totalCommissionPaid }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
              <span class="block text-[10px] font-black text-slate-400 uppercase">{{ $t('Paid') }}</span>
              <span class="text-xl font-black text-green-500">{{ data.paymentStats.paidCount }}</span>
            </div>
            <div class="text-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
              <span class="block text-[10px] font-black text-slate-400 uppercase">{{ $t('Pending') }}</span>
              <span class="text-xl font-black text-yellow-500">{{ data.paymentStats.pendingCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Projects -->
      <div class="lg:col-span-2 bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden">
        <div class="p-8 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-xl font-black text-slate-900 dark:text-white italic flex items-center gap-3">
            <Icon name="ph:clock-countdown-fill" class="text-indigo-600" />
            {{ $t('Recent Projects') }}
          </h3>
          <NuxtLink to="/dashboard/requests" class="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">{{ $t('View All') }}</NuxtLink>
        </div>
        <div class="p-8 space-y-4">
          <div v-for="project in data.recentProjects" :key="project.id" 
            class="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-600/30 transition-all group">
            <div class="flex items-center gap-6">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Icon name="ph:folder-fill" class="text-2xl" />
              </div>
              <div>
                <h4 class="font-black text-slate-900 dark:text-white">{{ project.title }}</h4>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-[10px] font-black text-indigo-500 uppercase">{{ project.storeCategoryName }}</span>
                  <span class="text-slate-300">•</span>
                  <span class="text-[10px] font-bold text-slate-500">{{ new Date(project.createdAt).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-center hidden sm:block">
                <p class="text-[10px] font-black text-slate-400 uppercase">{{ $t('Proposals') }}</p>
                <p class="font-black text-indigo-600">{{ project.proposalsCount }}</p>
              </div>
              <span :class="statusClass(project.status)">{{ $t(project.status) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferred Categories -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/20 shadow-2xl">
        <h3 class="text-xl font-black text-slate-900 dark:text-white italic mb-8">{{ $t('Top Categories') }}</h3>
        <div class="space-y-6">
          <div v-for="cat in data.topCategories" :key="cat.storeCategoryId" class="relative">
            <div class="flex justify-between items-center mb-2">
              <span class="font-bold text-slate-700 dark:text-slate-300">{{ cat.categoryName }}</span>
              <span class="text-xs font-black text-indigo-600">{{ cat.projectCount }}</span>
            </div>
            <div class="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-600" :style="{ width: `${(cat.projectCount / data.projectStats.total) * 100}%` }"></div>
            </div>
          </div>
        </div>
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

const projectStats = computed(() => [
  { label: 'Total', value: props.data.projectStats.total, icon: 'ph:stack-fill', colorClass: 'text-indigo-600' },
  { label: 'Open', value: props.data.projectStats.open, icon: 'ph:door-open-fill', colorClass: 'text-yellow-500' },
  { label: 'Completed', value: props.data.projectStats.completed, icon: 'ph:check-circle-fill', colorClass: 'text-green-600' },
])

const statusClass = (status) => {
  const base = 'px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider '
  switch (status.toLowerCase()) {
    case 'completed': return base + 'bg-green-500/10 text-green-500'
    case 'open': return base + 'bg-yellow-500/10 text-yellow-500'
    case 'cancelled': return base + 'bg-red-500/10 text-red-500'
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
