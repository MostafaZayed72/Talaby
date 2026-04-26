<template>
  <section class="py-24 relative overflow-hidden bg-white dark:bg-slate-900">
    <div class="container mx-auto px-6 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-sm mb-3">
          {{ $t('Why Choose Us') }}
        </h2>
        <h3 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
          {{ $t('Experience Excellence in Every Service') }}
        </h3>
        <p class="text-lg text-slate-600 dark:text-slate-400">
          {{ $t('We combine technology with professional expertise to bring you the best experience.') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
        >
          <div :class="`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg text-white` ">
            <Icon :name="feature.icon" class="text-3xl" />
          </div>
          <h4 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {{ $t(feature.title) }}
          </h4>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ $t(feature.description) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Background Decoration -->
    <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent dark:from-indigo-900/10 pointer-events-none"></div>
  </section>
</template>

<script setup>
const features = [
  {
    title: 'Fast Delivery',
    description: 'We prioritize your time. Get your needs delivered in record time with our optimized logistics.',
    icon: 'ph:lightning-fill',
    color: 'bg-amber-500',
  },
  {
    title: 'Verified Professionals',
    description: 'Every service provider is thoroughly vetted to ensure you get only the best quality and security.',
    icon: 'ph:shield-check-fill',
    color: 'bg-emerald-500',
  },
  {
    title: '24/7 Support',
    description: 'Our dedicated support team is always available to assist you with any inquiries or issues.',
    icon: 'ph:headset-fill',
    color: 'bg-indigo-600',
  }
];
</script>
