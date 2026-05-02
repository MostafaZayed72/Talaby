<template>
  <div :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr' }" class="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
    
    <!-- Sidebar -->
    <aside 
      class="fixed top-0 bottom-0 z-[60] w-72 bg-slate-900 border-r border-white/10 transition-transform duration-500 md:translate-x-0 shadow-2xl"
      :class="[
        isSidebarOpen ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full' : '-translate-x-full'),
        locale === 'ar' ? 'right-0' : 'left-0'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-8 border-b border-white/10 flex items-center gap-4">
          <div class="bg-white p-1 rounded-2xl shadow-lg">
            <img src="/imgs/logo.png" class="w-10 h-10" alt="Logo">
          </div>
          <span class="text-2xl font-black text-white italic tracking-tighter uppercase">Talaby<span class="text-indigo-500">Client</span></span>
        </div>

        <!-- Nav Links -->
        <nav class="flex-1 px-4 py-8 space-y-2">
          <NuxtLink 
            v-for="link in clientLinks" 
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all group"
            active-class="bg-white/10 text-indigo-400 !text-white"
          >
            <Icon :name="link.icon" class="text-2xl group-hover:scale-110 transition-transform" />
            {{ $t(link.label) }}
          </NuxtLink>
        </nav>

        <!-- Bottom Actions -->
        <div class="p-6 border-t border-white/10 space-y-4">
           <div class="flex items-center justify-between px-4 text-slate-400">
              <span class="text-sm font-bold">{{ $t('Language') }}</span>
              <LanguageSwitcher />
           </div>
           <div class="flex items-center justify-between px-4 text-slate-400">
              <span class="text-sm font-bold">{{ $t('Appearance') }}</span>
              <DarkModeToggle />
           </div>
           <button @click="logout" class="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-2xl font-black transition-all active:scale-95">
              <Icon name="ph:sign-out-bold" class="text-xl" />
              {{ $t('Logout') }}
           </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div 
      class="transition-all duration-500"
      :class="[locale === 'ar' ? 'md:pr-72' : 'md:pl-72']"
    >
      <!-- Top Bar -->
      <header class="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 px-6 flex items-center justify-between">
        <button @click="isSidebarOpen = !isSidebarOpen" class="md:hidden p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-600 dark:text-white">
          <Icon name="ph:list-bold" class="text-2xl" />
        </button>

        <div class="flex-1 px-6">
          <h2 class="text-xl font-black text-slate-900 dark:text-white hidden md:block">
             {{ pageTitle }}
          </h2>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{{ $t('Client') }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ userEmail }}</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
             <Icon name="ph:user-bold" class="text-2xl" />
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6 md:p-10">
        <slot />
      </main>
    </div>

    <!-- Backdrop for mobile -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
    ></div>

    <Loader v-if="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();
const router = useRouter();
const route = useRoute();

const loading = ref(true);
const isSidebarOpen = ref(false);
const token = useLocalStorage('token', null);
const userEmail = ref('');

const clientLinks = [
  { to: '/dashboard', label: 'Statistics', icon: 'ph:chart-bar-bold' },
  { to: '/dashboard/requests', label: 'My Orders', icon: 'ph:shopping-bag-bold' },
  { to: '/', label: 'Visit Website', icon: 'ph:globe-bold' },
];

const pageTitle = computed(() => {
  if (route.path.includes('requests')) return t('My Orders');
  return t('Client Dashboard');
});

const logout = () => {
  localStorage.removeItem('userID');
  localStorage.removeItem('roles');
  token.value = null;
  router.push('/login');
};

onMounted(() => {
  loading.value = false;
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      userEmail.value = JSON.parse(storedUser).email;
    } catch (e) {}
  }
});

router.afterEach(() => {
  isSidebarOpen.value = false;
});
</script>
