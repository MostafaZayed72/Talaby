<template>
    <footer class=" text-white bg-violet-950" style="background-color: #4a3a6e;">
        <div class="container mx-auto flex flex-col-reverse gap-2 md:flex-row flex-wrap justify-between items-center">
            <!-- شعار الموقع -->
            <div class="flex items-center space-x-3">
                <img src="/imgs/logo.png" alt="Site Logo" class="h-12 w-12 mx-2 rounded-full" />
                <span class="text-sm md:text-xl">
                    &copy; {{ new Date().getFullYear() }} {{ $t('All rights reserved to Talaby.') }}
                </span>
            </div>
            <h1>
                {{ $t('Mail Us') }} : <a href="mailto:support@example.com"
                    class="underline text-green-300 hover:text-green-400 delayed">Talaby@gmail.com</a>
            </h1>
            <!-- الروابط -->
            <nav class="flex space-x-6 md:text-xl">

                <nuxt-link to="/my-profile" class="hover:underline hover:text-green-300 mx-6 delayed">
                    {{ $t('My profile') }}
                </nuxt-link>
                <nuxt-link to="/departments" class="hover:underline hover:text-green-300 delayed">
                    {{ $t('Departments') }}
                </nuxt-link>
                <!-- <nuxt-link to="/products" class="hover:underline hover:text-green-300 delayed">
                    {{ $t('Products') }}
                </nuxt-link> -->

            </nav>
        </div>
    </footer>
</template>

<script setup>
</script>

<style scoped></style>