<template>
  <div :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr' }" class="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
    
    <!-- Sidebar -->
    <aside 
      class="fixed top-0 bottom-0 z-[60] w-72 bg-violet-950 border-r border-white/10 transition-transform duration-500 md:translate-x-0 shadow-2xl"
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
          <span class="text-2xl font-black text-white italic tracking-tighter uppercase">Admin<span class="text-yellow-400">Panel</span></span>
        </div>

        <!-- Nav Links -->
        <nav class="flex-1 px-4 py-8 space-y-2">
          <NuxtLink 
            v-for="link in adminLinks" 
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all group"
            active-class="bg-white/10 text-yellow-400 !text-white"
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
            <p class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Administrator</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">admin@talaby.net</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
             <Icon name="ph:shield-check-bold" class="text-2xl" />
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';

const { locale, t } = useI18n();
const router = useRouter();
const route = useRoute();

const loading = ref(true);
const isSidebarOpen = ref(false);
const token = useLocalStorage('token', null);

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'ph:layout-bold' },
  { to: '/admin/departments', label: 'Departments', icon: 'ph:grid-four-bold' },
  { to: '/', label: 'Visit Website', icon: 'ph:globe-bold' },
];

const pageTitle = computed(() => {
  if (route.path.includes('departments')) return t('Departments Management');
  if (route.path.includes('products')) return t('Products Management');
  return t('Dashboard');
});

const logout = () => {
  localStorage.removeItem('userID');
  localStorage.removeItem('roles');
  token.value = null;
  router.push('/login');
};

router.beforeEach((to, from, next) => {
  loading.value = true;
  next();
});

router.afterEach(() => {
  loading.value = false;
  isSidebarOpen.value = false;
});

onMounted(() => {
  loading.value = false;
});
</script>

<style scoped>
.router-link-active {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
</style>




<style scoped>
body.dark {
  background-color: #1e1e1e;
  color: white;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave {
  opacity: 1;
  transform: translateX(0);
}

.slide-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.dark .p-menubar .p-menubar-root-list {
  color: white;
}

.p-menuitem {
  color: black;
}

.dark .p-menuitem {
  color: white;
}

.p-menubar {
  color: white;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.z-10 {
  z-index: 10;
}

.bg-white {
  background-color: white;
}

.text-black {
  color: black;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.rounded {
  border-radius: 0.25rem;
}

.hover\:bg-gray-100:hover {
  background-color: #f7fafc;
}

.w-full {
  width: 100%;
}

.mt-2 {
  margin-top: 0.5rem;
}

.right-0 {
  right: 0;
}
</style>