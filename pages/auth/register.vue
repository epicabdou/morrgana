<!-- pages/auth/register.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center">
          <UserPlusIcon class="h-6 w-6 text-rose-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Créer un compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink to="/auth/login" class="font-medium text-rose-600 hover:text-rose-500">
            se connecter à un compte existant
          </NuxtLink>
        </p>
      </div>

      <form @submit.prevent="register" class="mt-8 space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-green-700 text-sm">{{ success }}</p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse e-mail
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-rose-500 focus:border-rose-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div class="mt-2">
              <div class="flex items-center space-x-2 text-xs">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="passwordStrength.length >= 8 ? 'bg-green-500' : 'bg-gray-300'"
                ></div>
                <span :class="passwordStrength.length >= 8 ? 'text-green-600' : 'text-gray-500'">
                  8+ caractères
                </span>
              </div>
              <div class="flex items-center space-x-2 text-xs mt-1">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="passwordStrength.hasUppercase ? 'bg-green-500' : 'bg-gray-300'"
                ></div>
                <span :class="passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'">
                  Une majuscule
                </span>
              </div>
              <div class="flex items-center space-x-2 text-xs mt-1">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-300'"
                ></div>
                <span :class="passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'">
                  Un chiffre
                </span>
              </div>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="••••••••"
            />
            <p v-if="form.confirmPassword && !passwordsMatch" class="mt-1 text-sm text-red-600">
              Les mots de passe ne correspondent pas
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            J'accepte les
            <NuxtLink to="/terms-conditions" class="text-rose-600 hover:text-rose-500">
              conditions d'utilisation
            </NuxtLink>
            et la
            <NuxtLink to="/privacy-policy" class="text-rose-600 hover:text-rose-500">
              politique de confidentialité
            </NuxtLink>
          </label>
        </div>

        <div class="flex items-center">
          <input
            id="newsletter"
            v-model="form.newsletter"
            type="checkbox"
            class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
          />
          <label for="newsletter" class="ml-2 block text-sm text-gray-900">
            Recevoir nos nouveautés et offres spéciales par e-mail
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Création du compte...' : 'Créer mon compte' }}
          </button>
        </div>

        <!-- OAuth Registration -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Ou s'inscrire avec</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              @click="registerWithGoogle"
              :disabled="isLoading"
              class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserPlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

// SEO
useHead({
  title: 'Créer un compte - Morrgana',
  meta: [
    {
      name: 'description',
      content: 'Créez votre compte Morrgana pour profiter d\'une expérience personnalisée et suivre vos commandes.'
    }
  ]
})

// Redirect if already authenticated
definePageMeta({
  middleware: 'guest'
})

const authStore = useAuthStore()
const route = useRoute()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  newsletter: false
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)

// Computed
const passwordStrength = computed(() => ({
  length: form.password.length >= 8,
  hasUppercase: /[A-Z]/.test(form.password),
  hasNumber: /\d/.test(form.password)
}))

const passwordsMatch = computed(() => 
  form.password === form.confirmPassword
)

const isFormValid = computed(() => 
  form.fullName && 
  form.email && 
  form.password && 
  passwordsMatch.value && 
  passwordStrength.value.length && 
  passwordStrength.value.hasUppercase && 
  passwordStrength.value.hasNumber && 
  form.acceptTerms
)

// Methods
const register = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    await authStore.register({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      newsletter: form.newsletter
    })
    
    success.value = 'Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.'
    
    // Redirect after a delay
    setTimeout(() => {
      const redirect = route.query.redirect as string
      navigateTo(redirect || '/account')
    }, 2000)
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la création du compte.'
  } finally {
    isLoading.value = false
  }
}

const registerWithGoogle = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await authStore.loginWithGoogle()
    
    // Redirect to intended page or account
    const redirect = route.query.redirect as string
    navigateTo(redirect || '/account')
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'inscription avec Google.'
  } finally {
    isLoading.value = false
  }
}
</script>