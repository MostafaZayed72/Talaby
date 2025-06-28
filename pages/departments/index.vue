<template>
  <div class=" py-20 px-4 max-w-6xl mx-auto ">
    <h1 class="text-3xl font-bold text-center mb-10 text-primary dark:text-white">
      {{ $t('Departments') }}
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div
        v-for="section in sections"
        :key="section.title"
        class="text-center"
      >
        <router-link :to="section.link">
          <img
            :src="section.image"
            :alt="section.title"
            class="w-full h-48 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <h2 class="mt-4 text-lg font-semibold text-gray-800 dark:text-white hover:text-primary transition">
            {{ $t(section.title) }}
          </h2>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const sections = [
  {
    title: 'مواد البناء والسباكة والكهرباء',
    image: '/imgs/construction.png',
    link: '/departments/construction'
  },
  {
    title: 'إلكترونيات',
    image: '/imgs/electronics.png',
    link: '/departments/electronics'
  },
  {
    title: 'أجهزة كهربائية',
    image: '/imgs/electric.png',
    link: '/departments/electric'
  }
]
</script>
