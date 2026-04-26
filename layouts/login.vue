<template>
  <div :class="{ 'dark': isDarkMode }" :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr' }" class="bg-slate-50 dark:bg-slate-950 transition-colors duration-500 min-h-screen">
    <!-- Premium Header -->
    <header class="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 bg-violet-950/80 backdrop-blur-xl border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="bg-white p-1 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <img src="/imgs/logo.png" class="w-10 h-10" alt="Logo">
            </div>
            <span class="text-2xl font-black text-white italic tracking-tighter group-hover:text-yellow-400 transition-colors">TALABY</span>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <LanguageSwitcher />
          <DarkModeToggle />
          
          <NuxtLink 
            v-if="!token"
            to="/login" 
            class="bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black px-6 py-2.5 rounded-2xl shadow-lg transition-all active:scale-95 hidden md:flex"
          >
            {{ $t('Login') }}
          </NuxtLink>

          <button 
            v-if="token"
            @click="logout"
            class="bg-white/10 hover:bg-white/20 text-white font-bold p-2.5 rounded-2xl transition-all"
          >
            <Icon name="ph:sign-out-bold" class="text-xl" />
          </button>
        </div>
      </div>
    </header>

    <Loader v-if="loading" />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core'; // استيراد useLocalStorage

const { locale } = useI18n();
const loading = ref(true);
const router = useRouter();

// استخدام useLocalStorage بدلاً من localStorage مباشرة
const token = useLocalStorage('token', null); // "token" هو اسم المفتاح و "null" هو القيمة الافتراضية
const userID = ref()
const roles = ref()
// دالة التحقق من التوكن
const checkToken = () => {
  if (!token.value) {
    // إذا لم يكن هناك توكن في الـ localStorage، يتم تعيين القيمة الافتراضية
    token.value = localStorage.getItem('token');
  }
};
const user = useState('currentUser', () => null)

// تسجيل الخروج
const logout = () => {
  localStorage.removeItem('userID');
  localStorage.removeItem('token');
  localStorage.removeItem('roles');
  user.value= null
  navigateTo('/login'); // استخدم router.push بدلاً من navigateTo

};

// مراقبة التوكن وتحديث حالة token بناءً عليه
watch(token, (newToken) => {
  if (newToken) {
    // إذا كان هناك توكن، يمكنك تنفيذ عمليات معينة
    console.log("تم تسجيل الدخول");
  } else {
    // إذا لم يكن هناك توكن، تنفيذ عمليات أخرى مثل توجيه المستخدم إلى صفحة التسجيل
    console.log("تم تسجيل الخروج");
  }
});

// إضافة مستمع لحدث storage في متصفح
const handleStorageChange = (event) => {
  if (event.key === 'token') {
    // عند تغيير قيمة التوكن في localStorage
    token.value = event.newValue;
  }
};

onMounted(() => {
  checkToken();
  loading.value = false;
  userID.value = localStorage.getItem("userID")
  roles.value = localStorage.getItem("roles")

  // الاستماع إلى تغييرات localStorage
  window.addEventListener('storage', handleStorageChange);
});

onBeforeUnmount(() => {
  // إزالة مستمع الحدث عند إلغاء تحميل الصفحة
  window.removeEventListener('storage', handleStorageChange);
});

// التحكم في حالة الـ loading عند التنقل بين الصفحات
router.beforeEach((to, from, next) => {
  loading.value = true;
  next();
});

router.afterEach(() => {
  loading.value = false;
});

const isSidebarOpen = ref(false);
const isDropdownOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// إغلاق القائمة عند النقر خارجها
const closeDropdownOnClickOutside = (event) => {
  const dropdown = document.querySelector('.relative');
  const toggleButton = event.target.closest('h1'); // عنصر النقر لفتح القائمة
  if (dropdown && !dropdown.contains(event.target) && !toggleButton) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdownOnClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside);
});

const route = useRoute();

// للتحقق إذا كان الرابط الحالي يحتوي على كلمة "signup" وتعيين الـ active
const isSignupActive = computed(() => route.path.endsWith('signup'));

// للتحقق إذا كان أي مسار يحتوي على "signup"
const isSignupSectionActive = computed(() => {
  return route.path.includes('signup');
});

// للتحقق إذا كان الرابط الحالي هو "yourNurse"
const isYourNurseActive = computed(() => route.path.startsWith('/yourNurse'));
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