<template>
  <div class="overflow-x-hidden">
    <!-- Hero Carousel Section -->
    <HomeCarousel />

    <!-- Services Grid Section -->
    <PopularServices />

    <!-- Why Choose Us Section -->
    <FeaturesSection />

    <!-- How It Works Section -->
    <HowItWorks />

    <!-- Testimonials Section -->
    <Testimonials />

    <!-- Join As Provider Section -->
    <JoinAsProvider />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
/* Page-specific animations */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
