<template>
  <footer class="relative bg-violet-950 text-white pt-20 pb-10 overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-800/20 rounded-full blur-3xl"></div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-indigo-800/20 rounded-full blur-3xl"></div>

    <div class="container mx-auto px-6 relative z-1 text-center md:text-right">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <!-- Column 1: Brand Info -->
        <div class="space-y-6">
          <div class="flex items-center justify-center md:justify-start gap-3">
            <img src="/imgs/logo.png" alt="Talaby Logo" class="h-14 w-14 rounded-full border-2 border-yellow-400 shadow-xl" />
            <span class="text-3xl font-black tracking-tighter italic">TALABY<span class="text-yellow-400">.</span></span>
          </div>
          <p class="text-slate-300 leading-relaxed text-lg">
            {{ $t('Providing high-quality services with speed and reliability. Your comfort is our priority.') }}
          </p>
          <div class="flex justify-center md:justify-start gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-400 hover:text-violet-950 transition-all duration-300">
              <Icon name="ph:facebook-logo-fill" class="text-xl" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-400 hover:text-violet-950 transition-all duration-300">
              <Icon name="ph:instagram-logo-fill" class="text-xl" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-400 hover:text-violet-950 transition-all duration-300">
              <Icon name="ph:twitter-logo-fill" class="text-xl" />
            </a>
          </div>
        </div>

        <!-- Column 2: Quick Links -->
        <div>
          <h3 class="text-xl font-bold mb-8 text-yellow-400 border-l-4 md:border-l-4 border-yellow-400 pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4 mx-auto md:mx-0 w-fit md:w-full">
            {{ $t('Quick Links') }}
          </h3>
          <ul class="space-y-4 flex flex-col items-center md:items-start">
            <li v-for="link in quickLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-slate-300 hover:text-white hover:translate-x-2 flex items-center gap-2 transition-all duration-300">
                <Icon name="ph:caret-right-bold" class="text-sm text-yellow-400" />
                {{ $t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 3: Services -->
        <div>
          <h3 class="text-xl font-bold mb-8 text-yellow-400 border-l-4 md:border-l-4 border-yellow-400 pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4 mx-auto md:mx-0 w-fit md:w-full">
            {{ $t('Our Services') }}
          </h3>
          <ul class="space-y-4 flex flex-col items-center md:items-start">
            <li v-for="service in services" :key="service.label">
              <a href="#" class="text-slate-300 hover:text-white hover:translate-x-2 flex items-center gap-2 transition-all duration-300">
                <Icon name="ph:check-circle-fill" class="text-sm text-yellow-400" />
                {{ $t(service.label) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 4: Contact -->
        <div>
          <h3 class="text-xl font-bold mb-8 text-yellow-400 border-l-4 md:border-l-4 border-yellow-400 pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4 mx-auto md:mx-0 w-fit md:w-full">
            {{ $t('Contact Us') }}
          </h3>
          <div class="space-y-6 flex flex-col items-center md:items-start">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div class="bg-yellow-400/10 p-3 rounded-lg">
                <Icon name="ph:envelope-simple-fill" class="text-xl text-yellow-400" />
              </div>
              <div>
                <p class="text-sm text-slate-400">{{ $t('Email Address') }}</p>
                <a href="mailto:Talaby@gmail.com" class="text-slate-200 hover:text-yellow-400 font-bold transition-colors">Talaby@gmail.com</a>
              </div>
            </div>
            <div class="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div class="bg-yellow-400/10 p-3 rounded-lg">
                <Icon name="ph:phone-call-fill" class="text-xl text-yellow-400" />
              </div>
              <div>
                <p class="text-sm text-slate-400">{{ $t('Phone Number') }}</p>
                <p class="text-slate-200 font-bold">+20 123 456 7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-slate-400 text-sm">
          &copy; {{ new Date().getFullYear() }} <span class="text-white font-bold">TALABY</span>. {{ $t('All rights reserved.') }}
        </p>
        <div class="flex gap-6 text-sm text-slate-400">
          <a href="#" class="hover:text-white transition-colors">{{ $t('Privacy Policy') }}</a>
          <a href="#" class="hover:text-white transition-colors">{{ $t('Terms of Service') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/departments', label: 'Departments' },
  { to: '/payment', label: 'Payment' },
  { to: '/my-profile', label: 'My profile' },
];

const services = [
  { label: 'Maintenance' },
  { label: 'Shopping' },
  { label: 'Delivery' },
  { label: 'Professional Support' },
];
</script>

<style scoped>
/* RTL Adjustments */
[dir="rtl"] .border-l-4 {
  border-left-width: 0;
  border-right-width: 4px;
  padding-left: 0;
  padding-right: 1rem;
}
[dir="rtl"] .hover\:translate-x-2:hover {
  transform: translateX(-0.5rem);
}
</style>