<template>
  <div 
    @click="toggleDarkMode"
    class="flex items-center justify-center p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
    :title="isDarkMode ? $t('Switch to Light Mode') : $t('Switch to Dark Mode')"
  >
    <Icon 
      :name="isDarkMode ? 'ph:sun-bold' : 'ph:moon-bold'" 
      class="text-2xl text-white transition-transform group-hover:scale-110" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css';

const isDarkMode = ref(false)

// استعادة حالة الوضع من التخزين المحلي عند تحميل الصفحة
onMounted(() => {
  const savedColorMode = localStorage.getItem('colorMode')
  if (savedColorMode === 'dark' || savedColorMode === 'light') {
    isDarkMode.value = savedColorMode === 'dark'
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }
})

// دالة لتبديل الوضع الليلي والنهاري
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  // حفظ حالة الوضع في التخزين المحلي
  localStorage.setItem('colorMode', isDarkMode.value ? 'dark' : 'light')
}
</script>

<style>
/* إعدادات اللون عند التبديل بين الوضعين */
body {
  transition: background-color 0.3s, color 0.3s; /* إضافة تأثير انتقال سلس */
}

/* إعداد اللون للخلفية والنصوص عند تفعيل الوضع الليلي */
.dark body {
  background-color: #020617 !important; /* التوافق مع app.vue */
  color: #f8fafc !important;
}

/* إعداد اللون للخلفية والنصوص في الوضع النهاري */
body {
  background-color: #ffffff;
  color: #0f172a;
}

.Menubar .dark {
  background-color: #1e1e1e; 
}
</style>
