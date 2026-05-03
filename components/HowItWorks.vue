<template>
  <section class="py-24 bg-indigo-900 text-white relative overflow-hidden">
    <!-- Abstract Background Patterns -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-96 h-96 border-[40px] border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] border-[60px] border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="text-center mb-20">
        <h2 class="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-4">{{ $t('Process') }}</h2>
        <h3 class="text-4xl md:text-5xl font-black">{{ $t('How It Works') }}</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
        <!-- Connecting Line (Desktop) -->
        <div class="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-white/20"></div>

        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="flex flex-col items-center text-center group"
        >
          <div class="relative mb-8">
            <div class="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-yellow-400 group-hover:rotate-12 transition-all duration-500">
              <Icon :name="step.icon" class="text-4xl group-hover:text-violet-950 transition-colors" />
            </div>
            <div class="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-yellow-400 text-violet-950 flex items-center justify-center font-black shadow-xl">
              {{ index + 1 }}
            </div>
          </div>
          <h4 class="text-2xl font-bold mb-4">{{ $t(step.title) }}</h4>
          <p class="text-indigo-100/70 leading-relaxed max-w-xs">
            {{ $t(step.desc) }}
          </p>
        </div>
      </div>

      <div class="mt-20 text-center">
         <NuxtLink to="/signup" class="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-2xl">
            {{ $t('Get Started Now') }}
            <Icon name="ph:rocket-launch-fill" class="text-xl" />
         </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    title: 'Choose Service',
    desc: 'Browse our extensive list of services and select what you need.',
    icon: 'ph:list-checks-fill',
  },
  {
    title: 'Place Order',
    desc: 'Provide details, set your location, and confirm your request.',
    icon: 'ph:cursor-click-fill',
  },
  {
    title: 'Enjoy Results',
    desc: 'Our professionals handle the rest. Sit back and relax.',
    icon: 'ph:seal-check-fill',
  }
];
</script>
