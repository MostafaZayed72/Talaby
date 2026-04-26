<template>
  <section class="py-24 bg-white dark:bg-slate-900 overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
         <h2 class="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">
            {{ $t('Testimonials') }}
         </h2>
         <h3 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            {{ $t('What Our Users Say') }}
         </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(testi, index) in testimonials" 
          :key="index"
          class="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 relative"
        >
          <Icon name="ph:quotes-fill" class="absolute top-6 left-6 text-6xl text-indigo-500/10" />
          <div class="flex gap-1 mb-6">
            <Icon v-for="i in 5" :key="i" name="ph:star-fill" class="text-yellow-400" />
          </div>
          <p class="text-slate-600 dark:text-slate-300 italic mb-8 relative z-10 leading-relaxed text-lg">
            "{{ $t(testi.text) }}"
          </p>
          <div class="flex items-center gap-4">
            <img :src="testi.avatar" class="w-12 h-12 rounded-full object-cover" alt="" />
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">{{ $t(testi.name) }}</h4>
              <p class="text-sm text-slate-500">{{ $t(testi.role) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    name: 'Ahmed Mohamed',
    role: 'Homeowner',
    text: 'Talaby has changed the way I handle home repairs. Fast, reliable, and very professional.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
  },
  {
    name: 'Khalid Saeed',
    role: 'Business Owner',
    text: 'The delivery service is exceptional. I use it daily for my business logistics.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
  },
  {
    name: 'Omar Hassan',
    role: 'Regular User',
    text: 'Best service app in the region. The UI is so smooth and easy to use.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
  }
];
</script>
