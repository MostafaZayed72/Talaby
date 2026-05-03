<template>
  <div :class="{ 'dark': isDarkMode }" :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr' }">
    <img src="/22.png" class="fixed top-10  left-[-20px] z-[-1] md:w-[30%]" alt="">
    <img src="/11.png" class="fixed bottom-0  left-[-20px] z-[-1] md:w-[30%]" alt="">
    <img src="/33.png" class="fixed bottom-0  right-[-20px] z-[-1] w-[50%] md:w-[30%]" alt="">

    <!-- Professional Adaptive Header -->
    <header 
      class="sticky top-0 z-50 transition-all duration-500 backdrop-blur-lg border-b border-white/10"
      :class="{ 
        'bg-violet-950 shadow-2xl py-2': !isAtTop, 
        'bg-violet-950/60 py-4': isAtTop 
      }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-20">
          <!-- Logo & Mobile Toggle -->
          <div class="flex items-center gap-4">
            <button 
              @click="toggleSidebar" 
              class="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              aria-label="Toggle Menu"
            >
              <Icon :name="isSidebarOpen ? 'ph:x-bold' : 'ph:list-bold'" class="text-2xl" />
            </button>
            
            <div 
              @click="() => router.push('/')" 
              class="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src="/imgs/logo.png" 
                class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-yellow-400 group-hover:scale-110 transition-transform shadow-xl" 
                alt="Talaby Logo"
              >
              <span class="hidden sm:block text-2xl font-black text-white tracking-tighter italic">
                TALABY<span class="text-yellow-400">.</span>
              </span>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-2">
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.to"
              :to="link.to"
              class="px-5 py-2.5 rounded-xl font-bold text-slate-100 hover:text-yellow-400 hover:bg-white/10 transition-all duration-300 relative group"
              active-class="text-yellow-400 bg-white/10 shadow-inner"
            >
              {{ $t(link.label) }}
              <span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-yellow-400 rounded-full transition-all group-hover:w-4 group-[.router-link-active]:w-6"></span>
            </NuxtLink>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-2 md:gap-4">
            <div class="hidden sm:flex items-center gap-1 border-r border-white/20 pr-4 mr-2">
               <DarkModeToggle />
               <LanguageSwitcher />
            </div>
            
            <template v-if="isLoggedIn">
              <NuxtLink to="/my-profile" class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110" title="Profile">
                <Icon name="ph:user-circle-fill" class="text-2xl" />
              </NuxtLink>
              <button @click="logout" class="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2.5 rounded-xl transition-all" title="Logout">
                <Icon name="ph:sign-out-bold" class="text-2xl" />
              </button>
            </template>
            <NuxtLink v-else to="/login" class="hidden sm:block bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-[0_10px_20px_rgba(234,179,8,0.3)] active:scale-95 text-sm md:text-base">
              {{ $t('Login') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Professional Sidebar for Mobile -->
    <transition name="sidebar-slide">
      <div v-if="isSidebarOpen" class="fixed inset-0 z-[60] md:hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeSidebar"></div>
        
        <!-- Sidebar Content -->
        <div 
          class="absolute top-0 bottom-0 w-80 bg-violet-950 shadow-2xl border-r border-white/10 flex flex-col"
          :class="locale === 'ar' ? 'right-0' : 'left-0'"
        >
          <div class="p-6 border-b border-white/10 flex justify-between items-center bg-violet-900/50">
            <div class="flex items-center gap-2">
              <img src="/imgs/logo.png" class="w-10 h-10 rounded-full border border-yellow-400" alt="">
              <span class="text-xl font-bold text-white tracking-tighter">TALABY</span>
            </div>
            <Icon @click="closeSidebar" name="ph:x-bold" class="text-2xl text-white cursor-pointer hover:rotate-90 transition-transform" />
          </div>

          <div class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.to"
              :to="link.to"
              @click="closeSidebar"
              class="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-100 hover:bg-white/10 hover:text-yellow-400 transition-all"
              active-class="bg-white/10 text-yellow-400"
            >
              <Icon :name="link.icon" class="text-xl" />
              {{ $t(link.label) }}
            </NuxtLink>
            
            <div class="pt-4 border-t border-white/10 mt-4 space-y-4">
               <div class="flex items-center justify-between px-4">
                  <span class="text-slate-400 font-medium">{{ $t('Appearance') }}</span>
                  <DarkModeToggle />
               </div>
               <div class="flex items-center justify-between px-4">
                  <span class="text-slate-400 font-medium">{{ $t('Language') }}</span>
                  <LanguageSwitcher />
               </div>
            </div>
          </div>

          <div class="p-6 border-t border-white/10 bg-violet-900/50">
            <button v-if="isLoggedIn" @click="handleLogoutClick" class="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-2xl font-bold transition-all">
              <Icon name="ic:twotone-log-out" class="text-xl" />
              {{ $t('Logout') }}
            </button>
            <NuxtLink v-else to="/login" @click="closeSidebar" class="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-violet-950 py-4 rounded-2xl font-bold transition-all shadow-lg">
              <Icon name="ph:sign-in-bold" class="text-xl" />
              {{ $t('Login') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>

    <main class="pt-16 md:pt-20">
      <slot />
    </main>

    <!-- Global Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();

const loading = ref(true);
const token = useLocalStorage('token', null);
const userID = ref();
const roles = ref();
const isSidebarOpen = ref(false);
const isDropdownOpen = ref(false);
const isAtTop = ref(true);

const navLinks = computed(() => {
  const links = [
    { to: '/', label: 'Home', icon: 'ph:house-fill' },
    { to: '/departments', label: 'Departments', icon: 'ph:grid-four-fill' },
    { to: '/about', label: 'About Us', icon: 'ph:info-fill' },
  ];
  if (isLoggedIn.value) {
    links.push({ to: '/dashboard', label: 'Dashboard', icon: 'ph:layout-fill' });
  }
  return links;
});

const isLoggedIn = computed(() => !!token.value);
const user = useState('currentUser', () => null);

const logout = () => {
  localStorage.removeItem('userID');
  localStorage.removeItem('roles');
  token.value = null;
  user.value = null;
  router.push('/login');
};

const handleLogoutClick = () => {
  logout();
  closeSidebar();
};

const checkToken = () => {
  if (!token.value) {
    token.value = localStorage.getItem('token');
  }
};

const handleStorageChange = (event) => {
  if (event.key === 'token') {
    token.value = event.newValue;
  }
};

const handleScroll = () => {
  isAtTop.value = window.scrollY < 20;
};

onMounted(() => {
  checkToken();
  loading.value = false;
  userID.value = localStorage.getItem("userID");
  roles.value = localStorage.getItem("roles");
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', closeDropdownOnClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange);
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', closeDropdownOnClickOutside);
});



const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdownOnClickOutside = (event) => {
  const dropdown = document.querySelector('.relative');
  const toggleButton = event.target.closest('h1');
  if (dropdown && !dropdown.contains(event.target) && !toggleButton) {
    isDropdownOpen.value = false;
  }
};

const isSignupActive = computed(() => route.path.endsWith('signup'));
const isSignupSectionActive = computed(() => route.path.includes('signup'));
const isYourNurseActive = computed(() => route.path.startsWith('/yourNurse'));

watch(token, (newToken) => {
  if (newToken) {
    console.log("تم تسجيل الدخول");
  } else {
    console.log("تم تسجيل الخروج");
  }
});
</script>

<style>
:root {
  --header-bg: transparent;
}
</style>

<style scoped>
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

[dir="rtl"] .sidebar-slide-enter-from,
[dir="rtl"] .sidebar-slide-leave-to {
  transform: translateX(100%);
}

.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
