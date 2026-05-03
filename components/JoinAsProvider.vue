<template>
  <section class="py-24 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
    <div class="container mx-auto px-6">
      <div class="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div class="flex-1 text-center lg:text-right text-white z-10">
          <h2 class="text-3xl md:text-5xl font-black mb-8 leading-tight italic">
            {{ $t('Join Our Network of Professionals') }}
          </h2>
          <p class="text-indigo-100 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
            {{ $t('Are you a professional service provider? Join Talaby today and expand your reach to thousands of customers in your area.') }}
          </p>
          <div class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-6">
            <NuxtLink to="/signup" class="bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3">
              {{ $t('Register as a Provider') }}
              <Icon name="ph:user-plus-fill" class="text-xl" />
            </NuxtLink>
            <NuxtLink to="/about" class="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-violet-950 font-black px-10 py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center">
              {{ $t('Learn More') }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex-1 relative z-10 w-full max-w-lg hidden lg:block">
          <div class="relative group">
            <!-- Glow Effect -->
            <div class="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img 
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=600&auto=format&fit=crop" 
              class="w-full rounded-[2.5rem] shadow-2xl border-4 border-white/10 transform rotate-3 group-hover:rotate-0 transition-transform duration-700"
              alt="Join Us"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>
