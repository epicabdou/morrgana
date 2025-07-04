<!-- pages/auth/callback.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="mx-auto h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center animate-spin">
          <ArrowPathIcon class="h-6 w-6 text-rose-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900">
          Connexion en cours...
        </h2>
        <p class="text-gray-600">
          Veuillez patienter pendant que nous finalisons votre connexion.
        </p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900">
          Erreur de connexion
        </h2>
        <p class="text-gray-600 mb-6">
          {{ error }}
        </p>
        <div class="space-y-2">
          <NuxtLink
            to="/auth/login"
            class="block bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Réessayer
          </NuxtLink>
          <NuxtLink
            to="/"
            class="block text-rose-600 hover:text-rose-500"
          >
            Retour à l'accueil
          </NuxtLink>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircleIcon class="h-6 w-6 text-green-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900">
          Connexion réussie !
        </h2>
        <p class="text-gray-600">
          Redirection en cours...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

// SEO
useHead({
  title: 'Connexion - Morrgana'
})

const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(true)
const error = ref('')

// Handle OAuth callback
const handleCallback = async () => {
  try {
    // Get URL fragment parameters
    const urlParams = new URLSearchParams(window.location.hash.substring(1))
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    
    if (code) {
      // Handle OAuth success
      await authStore.handleOAuthCallback(code, state)
      
      // Redirect to intended page
      const redirect = route.query.redirect as string
      setTimeout(() => {
        navigateTo(redirect || '/account')
      }, 1500)
    } else {
      throw new Error('Code d\'autorisation manquant')
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la connexion'
  } finally {
    isLoading.value = false
  }
}

// Initialize
onMounted(() => {
  handleCallback()
})
</script>