<template>
  <div class="min-h-screen pb-20">
    <!-- Hero Section -->
    <section class="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1600&auto=format&fit=crop" 
          class="w-full h-full object-cover opacity-30"
          alt="About Us"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-violet-950/80 to-slate-950"></div>
      </div>
      
      <div class="relative z-10 text-center px-6 animate-fade-in">
        <h1 class="text-4xl md:text-7xl font-black text-white mb-6 italic tracking-tight">
          {{ $t('About Talaby') }}
        </h1>
        <p class="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
          {{ $t('Your trusted mediator connecting you with the best stores and services.') }}
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="max-w-5xl mx-auto px-6 -mt-20 relative z-20">
      <div class="bg-white/10 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-8 md:p-16 shadow-2xl space-y-16">
        
        <!-- Mission & Vision -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="space-y-6">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Icon name="ph:target-bold" class="text-3xl text-white" />
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Our Mission') }}</h2>
            <p class="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {{ $t('To empower local communities by providing a seamless, reliable, and innovative platform that connects buyers with the finest stores and professional service providers, ensuring value and quality for every transaction.') }}
            </p>
          </div>
          <div class="space-y-6">
            <div class="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl">
              <Icon name="ph:eye-bold" class="text-3xl text-violet-950" />
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white italic">{{ $t('Our Vision') }}</h2>
            <p class="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {{ $t('To become the leading digital ecosystem in the region for all types of requests, fostering trust and growth for both consumers and businesses through transparency and excellence.') }}
            </p>
          </div>
        </div>

        <hr class="border-white/10" />

        <!-- Why We Are Different -->
        <div class="space-y-12">
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white text-center italic">{{ $t('Why Talaby?') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="feature in features" :key="feature.title" class="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-indigo-500 transition-all group">
              <Icon :name="feature.icon" class="text-4xl text-indigo-500 mb-6 group-hover:scale-125 transition-transform" />
              <h3 class="text-xl font-black text-slate-900 dark:text-white mb-4">{{ $t(feature.title) }}</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{{ $t(feature.desc) }}</p>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
           <Icon name="ph:rocket-launch-bold" class="absolute -right-10 -bottom-10 text-[15rem] opacity-10 rotate-12" />
           <h2 class="text-3xl md:text-5xl font-black mb-8 italic tracking-tight">{{ $t('Ready to Start Your Journey?') }}</h2>
           <div class="flex flex-wrap justify-center gap-6 relative z-10">
              <NuxtLink to="/signup/client" class="bg-white text-indigo-900 font-black px-10 py-4 rounded-2xl hover:bg-yellow-400 hover:text-violet-950 hover:scale-110 hover:shadow-[0_0_40px_rgba(250,204,21,0.4)] transition-all duration-300 shadow-xl active:scale-95">
                {{ $t('Register as a client') }}
              </NuxtLink>
              <NuxtLink to="/signup/service_provider" class="bg-indigo-950/50 backdrop-blur-xl border border-white/20 text-white font-black px-10 py-4 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-xl active:scale-95">
                {{ $t('Register as a store') }}
              </NuxtLink>
           </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  { 
    title: 'Trusted Mediator', 
    desc: 'We act as a secure bridge between you and the vendors, ensuring your rights are protected.',
    icon: 'ph:handshake-bold'
  },
  { 
    title: 'Wide Variety', 
    desc: 'Access thousands of products and services across multiple categories in one place.',
    icon: 'ph:grid-four-bold'
  },
  { 
    title: 'Fast & Reliable', 
    desc: 'Our system is designed for speed, getting your requests to the right people instantly.',
    icon: 'ph:lightning-bold'
  }
]

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
