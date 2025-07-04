<!-- pages/auth/forgot-password.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center">
          <KeyIcon class="h-6 w-6 text-rose-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Mot de passe oublié
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <form @submit.prevent="sendResetEmail" class="mt-8 space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex">
            <CheckCircleIcon class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <p class="text-green-700 text-sm">{{ success }}</p>
            </div>
          </div>
        </div>

        <div v-if="!emailSent">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Adresse e-mail
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
            placeholder="votre@email.com"
          />
        </div>

        <div v-if="!emailSent">
          <button
            type="submit"
            :disabled="isLoading || !email"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/auth/login" class="font-medium text-rose-600 hover:text-rose-500">
            Retour à la connexion
          </NuxtLink>
        </div>

        <!-- Resend option -->
        <div v-if="emailSent" class="text-center space-y-4">
          <p class="text-sm text-gray-600">
            Vous n'avez pas reçu l'e-mail ? Vérifiez vos spams ou
          </p>
          <button
            type="button"
            @click="resendEmail"
            :disabled="isLoading || resendCooldown > 0"
            class="text-rose-600 hover:text-rose-500 font-medium disabled:opacity-50"
          >
            {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer l\'e-mail' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

// SEO
useHead({
  title: 'Mot de passe oublié - Morrgana',
  meta: [
    {
      name: 'description',
      content: 'Réinitialisez votre mot de passe Morrgana en quelques clics.'
    }
  ]
})

// Redirect if already authenticated
definePageMeta({
  middleware: 'guest'
})

const email = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const emailSent = ref(false)
const resendCooldown = ref(0)

// Methods
const sendResetEmail = async () => {
  if (!email.value) return
  
  isLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const pb = usePocketBase()
    await pb.collection('users').requestPasswordReset(email.value)
    
    success.value = 'Un e-mail de réinitialisation a été envoyé à votre adresse.'
    emailSent.value = true
    startResendCooldown()
    
  } catch (err: any) {
    error.value = 'Erreur lors de l\'envoi de l\'e-mail. Vérifiez votre adresse e-mail.'
  } finally {
    isLoading.value = false
  }
}

const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  await sendResetEmail()
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}
</script>