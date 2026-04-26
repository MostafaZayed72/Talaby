<template>
  <div class="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-lg">
      <div class="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-10 tracking-tight italic">
          {{ $t('Choose Your Journey') }}
        </h1>

        <div class="space-y-6">
          <NuxtLink 
            to="/signup/client" 
            class="group block p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500 hover:bg-indigo-600 transition-all duration-500 text-right shadow-xl"
          >
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-2xl bg-indigo-600 group-hover:bg-white flex items-center justify-center transition-colors">
                <Icon name="ph:user-bold" class="text-3xl text-white group-hover:text-indigo-600" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-black text-slate-900 dark:text-white group-hover:text-white mb-1">
                  {{ $t('Register as a client') }}
                </h3>
                <p class="text-slate-500 dark:text-slate-400 group-hover:text-indigo-100 text-sm font-medium">
                  {{ $t('I want to browse and order professional services.') }}
                </p>
              </div>
              <Icon name="ph:caret-right-bold" class="text-slate-400 group-hover:text-white" />
            </div>
          </NuxtLink>

          <NuxtLink 
            to="/signup/service_provider" 
            class="group block p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500 hover:bg-yellow-400 transition-all duration-500 text-right shadow-xl"
          >
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-2xl bg-yellow-400 group-hover:bg-white flex items-center justify-center transition-colors shadow-lg">
                <Icon name="ph:briefcase-bold" class="text-3xl text-violet-950" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-black text-slate-900 dark:text-white group-hover:text-violet-950 mb-1">
                  {{ $t('Register as a service provider') }}
                </h3>
                <p class="text-slate-500 dark:text-slate-400 group-hover:text-violet-900 text-sm font-medium">
                  {{ $t('I want to offer my services and grow my business.') }}
                </p>
              </div>
              <Icon name="ph:caret-right-bold" class="text-slate-400 group-hover:text-violet-950" />
            </div>
          </NuxtLink>
        </div>

        <p class="mt-10 text-slate-500 dark:text-slate-400 font-medium">
          {{ $t('Already have an account?') }}
          <NuxtLink to="/login" class="text-indigo-600 dark:text-indigo-400 font-black hover:underline px-1">
            {{ $t('Login Now') }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// تأكد إن PrimeVue Button معرف
import Button from 'primevue/button'
</script>

<style scoped>
/* اختياري: ممكن تعدل الألوان حسب تصميمك */
</style>
