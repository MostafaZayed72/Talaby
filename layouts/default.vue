<template>
  <div :class="{ 'dark': isDarkMode }" :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr' }">
    <img src="/public/22.png" class="fixed top-10  left-[-20px] z-[-1] md:w-[30%]" alt="">
    <img src="/public/11.png" class="fixed bottom-0  left-[-20px] z-[-1] md:w-[30%]" alt="">
    <img src="/public/33.png" class="fixed bottom-0  right-[-20px] z-[-1] w-[50%] md:w-[30%]" alt="">

    <div class="mb-0 px-4 flex justify-between items-center py-2 shadow-xl sticky top-0 z-10" style="background-color: #4a3a6e;">
      <div class="flex items-center gap-4">
        <Icon @click="toggleSidebar" name="iconamoon:menu-burger-horizontal" class="md:hidden text-xl text-white cursor-pointer" />
        <img src="/public/imgs/logo.png" class="w-12 h-12 cursor-pointer" alt="" style="border-radius: 50%;" @click="() => router.push('/')">
      </div>

      <div class="links md:flex items-center gap-4 hidden">
        <NuxtLink to="/" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400" exact-active-class="bg-violet-950 text-yellow-400">
          {{ $t('Home') }}
        </NuxtLink>
        <NuxtLink v-if="!isLoggedIn" to="/login" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400" exact-active-class="bg-violet-950 text-yellow-400">
          {{ $t('Login') }}
        </NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/my-profile" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400" exact-active-class="bg-violet-950 text-yellow-400">
          {{ $t('My profile') }}
        </NuxtLink>
        <NuxtLink to="/departments" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400" exact-active-class="bg-violet-950 text-yellow-400">
          {{ $t('Departments') }}
        </NuxtLink>
        <NuxtLink to="/payment" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400" exact-active-class="bg-violet-950 text-yellow-400">
          {{ $t('Payment') }}
        </NuxtLink>
      </div>

      <div class="flex items-center">
        <Icon class="text-3xl cursor-pointer text-white hidden md:flex" name="ic:twotone-log-out" v-if="isLoggedIn" @click="logout" />
        <LanguageSwitcher />
        <DarkModeToggle />
        <FloatingActions />
      </div>
    </div>

    <!-- Sidebar for Mobile -->
    <transition name="slide">
      <div v-if="isSidebarOpen" class="md:hidden border-t-2 border-violet-600 h-screen fixed z-10" style="background-color: #4a3a6e;">
        <div class="flex flex-col p-4">
          <NuxtLink to="/" @click="closeSidebar" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400">
            {{ $t('Home') }}
          </NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/login" @click="closeSidebar" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400">
            {{ $t('Login') }}
          </NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/my-profile" @click="closeSidebar" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400">
            {{ $t('My profile') }}
          </NuxtLink>
          <NuxtLink to="/departments" @click="closeSidebar" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400">
            {{ $t('Departments') }}
          </NuxtLink>
          <NuxtLink to="/payment" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" active-class="bg-violet-950 text-yellow-400" exact-active-class="bg-violet-950 text-yellow-400">
          {{ $t('Payment') }}
        </NuxtLink>
          <h1 v-if="isLoggedIn" @click="handleLogoutClick" class="hover:bg-violet-950 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400">
            {{ $t('Logout') }}
          </h1>
        </div>
      </div>
    </transition>

    <Loader v-if="loading" />
    <main class="p-0">
      <slot />
    </main>
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

const isLoggedIn = computed(() => !!token.value);
const user = useState('currentUser', () => null)

const logout = () => {
  localStorage.removeItem('userID');
  localStorage.removeItem('roles');
  token.value = null; // مهم جدًا لتحديث الحالة
  user.value=null
  router.push('/login'); // التوجيه لصفحة تسجيل الدخول
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

onMounted(() => {
  checkToken();
  loading.value = false;
  userID.value = localStorage.getItem("userID");
  roles.value = localStorage.getItem("roles");
  window.addEventListener('storage', handleStorageChange);
  document.addEventListener('click', closeDropdownOnClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange);
  document.removeEventListener('click', closeDropdownOnClickOutside);
});

router.beforeEach((to, from, next) => {
  loading.value = true;
  next();
});

router.afterEach(() => {
  loading.value = false;
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
