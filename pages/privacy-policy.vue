<template>
  <div class="min-h-screen py-20 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-2xl mb-6">
          <Icon name="ph:shield-check-bold" class="text-4xl text-white" />
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic tracking-tight mb-4">
          {{ $t('Privacy Policy') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium italic">
          {{ $t('Last updated: May 3, 2026') }}
        </p>
      </div>

      <div class="bg-white/10 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-8 md:p-12 shadow-2xl prose prose-slate dark:prose-invert max-w-none">
        
        <section class="mb-12">
          <h2 class="text-2xl font-black text-indigo-600 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-sm">1</span>
            {{ $t('Introduction') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('Welcome to Talaby. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.') }}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-indigo-600 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-sm">2</span>
            {{ $t('Information We Collect') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information. We also collect certain information automatically when you visit, use or navigate the Platform.') }}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-indigo-600 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-sm">3</span>
            {{ $t('How We Use Your Information') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {{ $t('We use personal information collected via our Platform for a variety of business purposes described below:') }}
          </p>
          <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
            <li>{{ $t('To facilitate account creation and logon process.') }}</li>
            <li>{{ $t('To send you marketing and promotional communications.') }}</li>
            <li>{{ $t('To fulfill and manage your orders.') }}</li>
            <li>{{ $t('To post testimonials with your consent.') }}</li>
            <li>{{ $t('To deliver services to the user.') }}</li>
          </ul>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-indigo-600 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-sm">4</span>
            {{ $t('Sharing Your Information') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share data with service providers and vendors for processing.') }}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-indigo-600 mb-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-sm">5</span>
            {{ $t('User Rights') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('You have the right to access, correct, or delete your personal data at any time through your account settings or by contacting our support team.') }}
          </p>
        </section>

        <div class="mt-16 p-8 bg-indigo-600/10 border border-indigo-600/20 rounded-[2rem] text-center">
          <p class="text-slate-600 dark:text-slate-300 font-bold mb-4">
            {{ $t('By using our platform, you agree to these terms.') }}
          </p>
          <NuxtLink to="/signup/client" class="text-indigo-600 font-black hover:underline italic">
            {{ $t('Back to Sign Up') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>
