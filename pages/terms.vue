<template>
  <div class="min-h-screen py-20 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-3xl shadow-2xl mb-6">
          <Icon name="ph:scroll-bold" class="text-4xl text-violet-950" />
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic tracking-tight mb-4">
          {{ $t('Terms of Service') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium italic">
          {{ $t('Effective Date: May 3, 2026') }}
        </p>
      </div>

      <div class="bg-white/10 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-8 md:p-12 shadow-2xl prose prose-slate dark:prose-invert max-w-none">
        
        <section class="mb-12">
          <h2 class="text-2xl font-black text-yellow-500 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center text-sm text-yellow-600">1</span>
            {{ $t('Acceptance of Terms') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('By accessing and using Talaby, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.') }}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-yellow-500 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center text-sm text-yellow-600">2</span>
            {{ $t('Service Description') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('Talaby provides a platform for users to request services and for stores to offer them. We act as a mediator to facilitate these interactions. We do not provide the services directly and are not responsible for the quality of services provided by third-party stores.') }}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-yellow-500 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center text-sm text-yellow-600">3</span>
            {{ $t('User Conduct') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('Users agree not to use the service for any unlawful purpose. You are responsible for all content you post and all activities that occur under your account.') }}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-yellow-500 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center text-sm text-yellow-600">4</span>
            {{ $t('Payments and Refunds') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('All payments made through the platform are subject to our payment terms. Refunds are handled according to the specific service provider policy and platform guidelines.') }}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-yellow-500 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center text-sm text-yellow-600">5</span>
            {{ $t('Termination') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('We reserve the right to terminate or suspend your account and access to the services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service.') }}
          </p>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>
