<!-- pages/auth/unauth.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Accès non autorisé
        </h2>
        <p class="mt-2 text-gray-600">
          Vous devez être connecté pour accéder à cette page.
        </p>
      </div>

      <div class="space-y-4">
        <NuxtLink
          to="/auth/login"
          class="w-full bg-rose-600 text-white py-3 px-4 rounded-lg hover:bg-rose-700 transition-colors block"
        >
          Se connecter
        </NuxtLink>
        
        <NuxtLink
          to="/auth/register"
          class="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors block"
        >
          Créer un compte
        </NuxtLink>
        
        <NuxtLink
          to="/"
          class="text-rose-600 hover:text-rose-500 font-medium"
        >
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// SEO
useHead({
  title: 'Accès non autorisé - Morrgana',
  meta: [
    {
      name: 'description',
      content: 'Vous devez être connecté pour accéder à cette page.'
    }
  ]
})
</script>