<template>
  <section class="py-24 bg-slate-50 dark:bg-slate-800/50">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div class="max-w-2xl text-right">
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            {{ $t('Explore Our Popular Services') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-400">
            {{ $t('Choose from a wide range of professional services tailored to your needs.') }}
          </p>
        </div>
        <NuxtLink to="/departments" class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-4 transition-all duration-300">
          {{ $t('View All Departments') }}
          <Icon name="ph:arrow-right-bold" />
        </NuxtLink>
      </div>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse rounded-3xl aspect-[4/5] bg-slate-200 dark:bg-slate-700"></div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <NuxtLink 
          v-for="service in popularServices" 
          :key="service.id"
          :to="`/department/${service.id}`"
          class="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer block"
        >
          <img 
            :src="service.image" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt=""
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
            <div class="bg-yellow-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
               <Icon :name="service.icon" class="text-violet-950 text-2xl" />
            </div>
            <h4 class="text-xl font-bold text-white mb-2">{{ service.name }}</h4>
            <p class="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
              {{ service.desc }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const { locale } = useI18n();
const popularServices = ref([]);
const loading = ref(true);

const fetchCategories = async () => {
  try {
    const response = await $fetch('https://talaby.premiumasp.net/api/storeCategories?PageNumber=1&PageSize=4');
    popularServices.value = response.items.map(item => ({
      id: item.id,
      name: locale.value === 'ar' ? item.nameAr : item.nameEn,
      desc: item.description || (locale.value === 'ar' ? 'استكشف المزيد من التفاصيل' : 'Explore more details'),
      image: item.imageUrl || 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=600&auto=format&fit=crop', // Fallback image
      icon: 'ph:grid-four-fill' // Default icon
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});

// Watch for locale changes to update names
watch(locale, () => {
  fetchCategories();
});
</script>
