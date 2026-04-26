<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
    <div class="relative">
      <!-- Glow Effect -->
      <div class="absolute inset-0 bg-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      
      <!-- Logo Container -->
      <div class="relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-white/20 animate-float">
        <img src="/imgs/logo.png" class="w-24 h-auto" alt="Talaby Logo" />
      </div>
      
      <!-- Progress Ring -->
      <div class="absolute -inset-4 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>