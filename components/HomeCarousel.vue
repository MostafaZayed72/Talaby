<template>
  <div class="hero-container">
    <v-carousel 
      :height="carouselHeight" 
      show-arrows="hover" 
      cycle 
      hide-delimiter-background
      interval="5000"
      class="rounded-2xl overflow-hidden shadow-2xl"
    >
      <!-- Slide 1: Welcome/App Interface -->
      <v-carousel-item>
        <div class="relative w-full h-full flex items-center justify-center bg-gradient-to-r from-violet-900 to-indigo-900 overflow-hidden">
          <div class="absolute inset-0 opacity-40">
            <img class="w-full h-full object-cover" src="/imgs/hero1.png" alt="Hero 1" />
          </div>
          <div class="relative z-1 container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-8">
            <div class="text-center md:text-right flex-1 animate-fade-in-up">
              <h1 class="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight italic">
                {{ $t('Welcome to Talaby') }}
              </h1>
              <p class="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto md:mx-0 font-medium leading-relaxed">
                {{ $t('All your services in one place. Fast, reliable, and easy to use.') }}
              </p>
              <div class="flex flex-wrap justify-center md:justify-start gap-6">
                <button class="bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black py-4 px-10 rounded-2xl transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(234,179,8,0.3)] active:scale-95">
                  {{ $t('Order Now') }}
                </button>
                <button class="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white hover:text-violet-950 font-black py-4 px-10 rounded-2xl transition-all shadow-xl active:scale-95">
                  {{ $t('Learn More') }}
                </button>
              </div>
            </div>
            <div class="hidden md:block flex-1 animate-float">
              <img src="/imgs/hero1.png" class="w-[80%] mx-auto drop-shadow-2xl rounded-3xl" alt="App Preview" />
            </div>
          </div>
        </div>
      </v-carousel-item>

      <!-- Slide 2: Service Interaction -->
      <v-carousel-item>
        <div class="relative w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900 overflow-hidden">
          <div class="absolute inset-0 opacity-30">
            <img class="w-full h-full object-cover" src="/imgs/hero2.png" alt="Hero 2" />
          </div>
          <div class="relative z-1 container mx-auto px-6 md:px-12 flex flex-col md:flex-row-reverse items-center gap-8">
            <div class="text-center md:text-right flex-1 animate-fade-in-left">
              <h2 class="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight italic">
                {{ $t('Connect with Professionals') }}
              </h2>
              <p class="text-xl md:text-2xl text-slate-200 mb-10 font-medium leading-relaxed">
                {{ $t('Find the best service providers in your area for any task.') }}
              </p>
              <button class="bg-white text-violet-950 font-black py-4 px-12 rounded-2xl hover:bg-yellow-400 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95">
                {{ $t('Browse Services') }}
              </button>
            </div>
            <div class="flex-1 animate-pulse-slow">
              <img src="/imgs/hero2.png" class="w-full max-w-lg mx-auto" alt="Service" />
            </div>
          </div>
        </div>
      </v-carousel-item>

      <!-- Slide 3: Diverse Services -->
      <v-carousel-item>
        <div class="relative w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-900 to-fuchsia-900 overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <img class="w-full h-full object-cover" src="/imgs/hero3.png" alt="Hero 3" />
          </div>
          <div class="relative z-1 text-center px-6 animate-zoom-in">
            <h2 class="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter italic">
              {{ $t('Everything You Need, Delivered') }}
            </h2>
            <p class="text-xl md:text-3xl text-slate-100 mb-12 max-w-4xl mx-auto font-medium leading-relaxed opacity-90">
              {{ $t('From daily essentials to professional maintenance, we handle it all.') }}
            </p>
            <div class="flex justify-center gap-8">
               <div class="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl hover:scale-110 transition-transform">
                  <span class="text-yellow-400 block font-black text-4xl mb-1">100+</span>
                  <span class="text-slate-300 text-sm font-bold uppercase tracking-widest">{{ $t('Services') }}</span>
               </div>
               <div class="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl hover:scale-110 transition-transform">
                  <span class="text-yellow-400 block font-black text-4xl mb-1">24/7</span>
                  <span class="text-slate-300 text-sm font-bold uppercase tracking-widest">{{ $t('Support') }}</span>
               </div>
               <div class="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl hover:scale-110 transition-transform">
                  <span class="text-yellow-400 block font-black text-4xl mb-1">50k+</span>
                  <span class="text-slate-300 text-sm font-bold uppercase tracking-widest">{{ $t('Users') }}</span>
               </div>
            </div>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const carouselHeight = ref(250); // الطول الافتراضي للشاشات الصغيرة
const products = ref([]); // لتخزين المنتجات

// دالة لتحديث الارتفاع بناءً على حجم الشاشة
const updateHeight = () => {
  if (window.innerWidth >= 580) {
    carouselHeight.value = 450; // الطول للشاشات الكبيرة جدًا
  } else if (window.innerWidth >= 490) {
    carouselHeight.value = 350; // الطول للشاشات الكبيرة
  } else if (window.innerWidth >= 410) {
    carouselHeight.value = 300; // الطول للشاشات المتوسطة
  } else {
    carouselHeight.value = 240; // الطول للشاشات الصغيرة
  }
};


onMounted(() => {
  updateHeight(); // تعيين الارتفاع عند تحميل الصفحة

  // إضافة مستمع للحدث resize لتحديث الارتفاع عند تغيير حجم الشاشة
  window.addEventListener('resize', updateHeight);
});

onUnmounted(() => {
  // إزالة مستمع الحدث عند التخلص من المكون
  window.removeEventListener('resize', updateHeight);
});
</script>




<style scoped>
.hero-container {
  max-width: 95%;
  margin: 0 auto;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
.animate-fade-in-left { animation: fadeInLeft 0.8s ease-out forwards; }
.animate-zoom-in { animation: zoomIn 0.8s ease-out forwards; }
.animate-float { animation: float 4s ease-in-out infinite; }
.animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

:deep(.v-btn--icon.v-btn--density-default) {
  background-color: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(4px);
  color: white !important;
  margin: 0 4px;
}

:deep(.v-btn--active) {
  background-color: #facc15 !important; /* yellow-400 */
  color: #2e1065 !important; /* violet-950 */
}

:deep(.v-window__right), :deep(.v-window__left) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
</style>
