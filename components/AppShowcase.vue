<template>
  <section class="py-24 overflow-hidden bg-white dark:bg-slate-900">
    <div class="container mx-auto px-6">
      <div class="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div class="flex-1 text-center lg:text-right text-white z-10">
          <h2 class="text-3xl md:text-5xl font-black mb-8 leading-tight">
            {{ $t('Download Talaby App for a Better Experience') }}
          </h2>
          <p class="text-indigo-100 text-lg mb-12 max-w-2xl">
            {{ $t('Enjoy exclusive offers, real-time tracking, and seamless payments through our mobile application.') }}
          </p>
          <div class="flex flex-wrap justify-center lg:justify-start gap-6">
            <a href="#" class="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform shadow-xl">
              <Icon name="ph:apple-logo-fill" class="text-3xl" />
              <div class="text-right">
                <span class="text-xs block opacity-70">Download on the</span>
                <span class="text-lg font-bold block leading-none">App Store</span>
              </div>
            </a>
            <a href="#" class="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform shadow-xl">
              <Icon name="ph:google-play-logo-fill" class="text-3xl" />
              <div class="text-right">
                <span class="text-xs block opacity-70">Get it on</span>
                <span class="text-lg font-bold block leading-none">Google Play</span>
              </div>
            </a>
          </div>
        </div>

        <div class="flex-1 relative z-10 w-full max-w-md">
          <div class="relative group">
            <!-- Glow Effect -->
            <div class="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" 
              class="w-full rounded-[2.5rem] shadow-2xl border-8 border-slate-900/10 transform -rotate-6 group-hover:rotate-0 transition-transform duration-700"
              alt="App Screenshot"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>
