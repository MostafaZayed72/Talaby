<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in quickStats" :key="stat.label" 
        class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 shadow-xl hover:scale-105 transition-all group">
        <div class="flex items-center justify-between mb-4">
          <div :class="`p-3 rounded-2xl ${stat.bgClass}`">
            <Icon :name="stat.icon" class="text-2xl text-white" />
          </div>
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ $t(stat.label) }}</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900 dark:text-white italic">{{ stat.value }}</span>
          <span v-if="stat.suffix" class="text-sm font-bold text-slate-500">{{ stat.suffix }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Project Distribution -->
      <div class="lg:col-span-2 bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-xl font-black text-slate-900 dark:text-white italic flex items-center gap-3">
            <Icon name="ph:chart-pie-slice-fill" class="text-indigo-600" />
            {{ $t('Project Statistics') }}
          </h3>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="(val, key) in data.projectStats" :key="key" class="p-6 bg-slate-50/50 dark:bg-white/5 rounded-3xl border border-white/5">
            <p class="text-xs font-black text-slate-400 uppercase tracking-tighter mb-2">{{ $t(key) }}</p>
            <p class="text-2xl font-black text-slate-900 dark:text-white">{{ val }}</p>
          </div>
        </div>
      </div>

      <!-- Top Categories -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
        <h3 class="text-xl font-black text-slate-900 dark:text-white italic mb-8 flex items-center gap-3">
          <Icon name="ph:crown-fill" class="text-yellow-400" />
          {{ $t('Top Categories') }}
        </h3>
        <div class="space-y-6">
          <div v-for="cat in data.topCategories" :key="cat.categoryName" class="flex items-center justify-between group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-black">
                {{ cat.categoryName.charAt(0) }}
              </div>
              <span class="font-bold text-slate-700 dark:text-slate-200">{{ cat.categoryName }}</span>
            </div>
            <span class="px-4 py-1 bg-indigo-600 text-white rounded-full text-xs font-black">
              {{ cat.projectCount }} {{ $t('Projects') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- User & Payment Insights -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- User Breakdown -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
        <h3 class="text-xl font-black text-slate-900 dark:text-white italic mb-8 flex items-center gap-3">
          <Icon name="ph:users-three-fill" class="text-violet-600" />
          {{ $t('User Distribution') }}
        </h3>
        <div class="space-y-8">
          <div v-for="item in userBreakdown" :key="item.label" class="space-y-2">
            <div class="flex justify-between text-sm font-black uppercase tracking-widest">
              <span class="text-slate-500">{{ $t(item.label) }}</span>
              <span class="text-slate-900 dark:text-white">{{ item.value }}</span>
            </div>
            <div class="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-1000" 
                :style="{ width: `${(item.value / data.userStats.totalUsers) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Summary -->
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden relative">
        <Icon name="ph:currency-circle-dollar-fill" class="absolute -right-10 -bottom-10 text-[15rem] text-indigo-600/5 rotate-12" />
        <h3 class="text-xl font-black text-slate-900 dark:text-white italic mb-8 flex items-center gap-3 relative z-10">
          <Icon name="ph:wallet-fill" class="text-green-500" />
          {{ $t('Financial Overview') }}
        </h3>
        <div class="grid grid-cols-2 gap-6 relative z-10">
          <div class="p-6 bg-green-500/10 rounded-3xl border border-green-500/20">
            <p class="text-xs font-black text-green-600 uppercase mb-2">{{ $t('Paid Count') }}</p>
            <p class="text-3xl font-black text-slate-900 dark:text-white italic">{{ data.paymentStats.paidCount }}</p>
          </div>
          <div class="p-6 bg-yellow-500/10 rounded-3xl border border-yellow-500/20">
            <p class="text-xs font-black text-yellow-600 uppercase mb-2">{{ $t('Pending Count') }}</p>
            <p class="text-3xl font-black text-slate-900 dark:text-white italic">{{ data.paymentStats.pendingCount }}</p>
          </div>
          <div class="p-6 bg-red-500/10 rounded-3xl border border-red-500/20">
            <p class="text-xs font-black text-red-600 uppercase mb-2">{{ $t('Failed Count') }}</p>
            <p class="text-3xl font-black text-slate-900 dark:text-white italic">{{ data.paymentStats.failedCount }}</p>
          </div>
          <div class="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
            <p class="text-xs font-black text-indigo-600 uppercase mb-2">{{ $t('Total Revenue') }}</p>
            <p class="text-3xl font-black text-slate-900 dark:text-white italic">${{ data.paymentStats.totalRevenue }}</p>
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

const quickStats = computed(() => [
  { label: 'Total Users', value: props.data.userStats.totalUsers, icon: 'ph:users-fill', bgClass: 'bg-indigo-600' },
  { label: 'Total Projects', value: props.data.projectStats.total, icon: 'ph:briefcase-fill', bgClass: 'bg-violet-600' },
  { label: 'Total Revenue', value: props.data.paymentStats.totalRevenue, icon: 'ph:money-fill', bgClass: 'bg-green-600', suffix: '$' },
  { label: 'New Users', value: props.data.userStats.newUsersThisMonth, icon: 'ph:user-plus-fill', bgClass: 'bg-yellow-500' },
])

const userBreakdown = computed(() => [
  { label: 'Clients', value: props.data.userStats.totalClients },
  { label: 'Stores', value: props.data.userStats.totalStores },
])
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
