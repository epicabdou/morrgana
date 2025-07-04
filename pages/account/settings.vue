<!-- pages/account/settings.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="lg:grid lg:grid-cols-4 lg:gap-8">
      <!-- Sidebar (reuse from account/index.vue) -->
      <div class="lg:col-span-1">
        <nav class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <UserIcon class="w-6 h-6 text-rose-600" />
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-900">{{ authStore.currentUser?.name }}</p>
              <p class="text-sm text-gray-600">{{ authStore.currentUser?.email }}</p>
            </div>
          </div>
          
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/account"
                class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <HomeIcon class="w-5 h-5 mr-3" />
                Tableau de bord
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/orders"
                class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <ShoppingBagIcon class="w-5 h-5 mr-3" />
                Mes commandes
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/watchlist"
                class="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <HeartIcon class="w-5 h-5 mr-3" />
                Ma wishlist
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/settings"
                class="flex items-center px-3 py-2 rounded-lg bg-rose-50 text-rose-600"
              >
                <CogIcon class="w-5 h-5 mr-3" />
                Paramètres
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-3 mt-8 lg:mt-0 space-y-8">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Paramètres du compte</h1>
          <p class="text-gray-600 mt-2">Gérez vos informations personnelles et préférences</p>
        </div>

        <!-- Profile Information -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Informations personnelles</h2>
          </div>
          
          <form @submit.prevent="updateProfile" class="p-6">
            <div v-if="profileMessage.text" class="mb-6">
              <div
                class="p-4 rounded-lg"
                :class="profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
              >
                {{ profileMessage.text }}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  v-model="profileForm.fullName"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <p class="text-sm text-gray-500 mt-1">
                  Un e-mail de vérification sera envoyé si vous changez votre adresse.
                </p>
              </div>
            </div>

            <div class="mt-6">
              <button
                type="submit"
                :disabled="profileLoading"
                class="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                {{ profileLoading ? 'Mise à jour...' : 'Mettre à jour' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Changer le mot de passe</h2>
          </div>
          
          <form @submit.prevent="changePassword" class="p-6">
            <div v-if="passwordMessage.text" class="mb-6">
              <div
                class="p-4 rounded-lg"
                :class="passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
              >
                {{ passwordMessage.text }}
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <p v-if="passwordForm.confirmPassword && !passwordsMatch" class="mt-1 text-sm text-red-600">
                  Les mots de passe ne correspondent pas
                </p>
              </div>
            </div>

            <div class="mt-6">
              <button
                type="submit"
                :disabled="passwordLoading || !passwordsMatch || !passwordForm.currentPassword || !passwordForm.newPassword"
                class="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                {{ passwordLoading ? 'Changement...' : 'Changer le mot de passe' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Email Preferences -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Préférences e-mail</h2>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">Newsletter</h3>
                  <p class="text-sm text-gray-600">Recevez nos nouveautés et offres spéciales</p>
                </div>
                <toggle-switch v-model="emailPreferences.newsletter" @change="updateEmailPreferences" />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">Notifications de commande</h3>
                  <p class="text-sm text-gray-600">Confirmations et mises à jour de vos commandes</p>
                </div>
                <toggle-switch v-model="emailPreferences.orderUpdates" @change="updateEmailPreferences" />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">Promotions spéciales</h3>
                  <p class="text-sm text-gray-600">Offres exclusives et ventes privées</p>
                </div>
                <toggle-switch v-model="emailPreferences.promotions" @change="updateEmailPreferences" />
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Addresses -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">Adresses de livraison</h2>
              <button
                @click="showAddressForm = true"
                class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Ajouter une adresse
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <div v-if="shippingAddresses.length === 0" class="text-center py-8">
              <p class="text-gray-500">Aucune adresse de livraison enregistrée</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="address in shippingAddresses"
                :key="address.id"
                class="border border-gray-200 rounded-lg p-4"
                :class="{ 'border-rose-500 bg-rose-50': address.isDefault }"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ address.name }}</h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ address.address }}<br>
                      {{ address.city }} {{ address.postCode }}<br>
                      {{ address.country }}
                    </p>
                    <p v-if="address.phone" class="text-sm text-gray-600 mt-1">
                      {{ address.phone }}
                    </p>
                    <span v-if="address.isDefault" class="inline-block mt-2 text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded">
                      Adresse par défaut
                    </span>
                  </div>
                  <div class="flex flex-col space-y-1">
                    <button
                      @click="editAddress(address)"
                      class="text-rose-600 hover:text-rose-700 text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      v-if="!address.isDefault"
                      @click="setDefaultAddress(address.id)"
                      class="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Par défaut
                    </button>
                    <button
                      @click="deleteAddress(address.id)"
                      class="text-red-600 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Account -->
        <div class="bg-white rounded-lg shadow-sm border border-red-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-red-600">Zone de danger</h2>
          </div>
          
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Supprimer mon compte</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Cette action est irréversible. Toutes vos données seront supprimées.
                </p>
              </div>
              <button
                @click="showDeleteConfirm = true"
                class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer le compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Form Modal -->
    <div v-if="showAddressForm" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeAddressForm"></div>
        <div class="relative bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse' }}
          </h3>
          
          <form @submit.prevent="saveAddress">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  v-model="addressForm.name"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  v-model="addressForm.address"
                  rows="3"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    v-model="addressForm.city"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    v-model="addressForm.postCode"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  v-model="addressForm.phone"
                  type="tel"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="addressForm.isDefault"
                  type="checkbox"
                  class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">
                  Définir comme adresse par défaut
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                @click="closeAddressForm"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="addressLoading"
                class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
              >
                {{ addressLoading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="showDeleteConfirm = false"></div>
        <div class="relative bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-red-600 mb-4">
            Supprimer définitivement le compte
          </h3>
          
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible 
            et toutes vos données seront perdues.
          </p>
          
          <div class="flex justify-end space-x-4">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              @click="deleteAccount"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UserIcon,
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

// Auth guard
definePageMeta({
  middleware: 'auth'
})

// SEO
useHead({
  title: 'Paramètres - Morrgana',
  meta: [
    {
      name: 'description',
      content: 'Gérez vos paramètres de compte, adresses de livraison et préférences.'
    }
  ]
})

const authStore = useAuthStore()

// Profile form
const profileForm = reactive({
  fullName: authStore.currentUser?.fullName || '',
  name: authStore.currentUser?.name || '',
  email: authStore.currentUser?.email || ''
})

const profileLoading = ref(false)
const profileMessage = reactive({ text: '', type: '' })

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordLoading = ref(false)
const passwordMessage = reactive({ text: '', type: '' })

// Email preferences
const emailPreferences = reactive({
  newsletter: true,
  orderUpdates: true,
  promotions: false
})

// Addresses
const shippingAddresses = ref([])
const showAddressForm = ref(false)
const editingAddress = ref(null)
const addressLoading = ref(false)

const addressForm = reactive({
  name: '',
  address: '',
  city: '',
  postCode: '',
  country: 'MA',
  phone: '',
  isDefault: false
})

// Delete account
const showDeleteConfirm = ref(false)

// Computed
const passwordsMatch = computed(() => 
  passwordForm.newPassword === passwordForm.confirmPassword
)

// Methods
const updateProfile = async () => {
  profileLoading.value = true
  profileMessage.text = ''
  
  try {
    await authStore.updateProfile({
      name: profileForm.name,
      name: profileForm.name,
      email: profileForm.email
    })
    
    profileMessage.text = 'Profil mis à jour avec succès'
    profileMessage.type = 'success'
  } catch (error: any) {
    profileMessage.text = error.message
    profileMessage.type = 'error'
  } finally {
    profileLoading.value = false
  }
}

const changePassword = async () => {
  if (!passwordsMatch.value) return
  
  passwordLoading.value = true
  passwordMessage.text = ''
  
  try {
    await authStore.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    )
    
    passwordMessage.text = 'Mot de passe changé avec succès'
    passwordMessage.type = 'success'
    
    // Clear form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    passwordMessage.text = error.message
    passwordMessage.type = 'error'
  } finally {
    passwordLoading.value = false
  }
}

const updateEmailPreferences = async () => {
  try {
    // Update email preferences
    // Implementation depends on your backend
    console.log('Updating email preferences:', emailPreferences)
  } catch (error) {
    console.error('Error updating email preferences:', error)
  }
}

const fetchShippingAddresses = async () => {
  try {
    const pb = usePocketBase()
    const result = await pb.collection('shippingAddresses').getFullList({
      filter: `user = "${authStore.currentUser?.id}"`,
      sort: '-isDefault,name'
    })
    shippingAddresses.value = result
  } catch (error) {
    console.error('Error fetching addresses:', error)
  }
}

const saveAddress = async () => {
  addressLoading.value = true
  try {
    const pb = usePocketBase()
    const data = {
      ...addressForm,
      user: authStore.currentUser?.id
    }
    
    if (editingAddress.value) {
      await pb.collection('shippingAddresses').update(editingAddress.value.id, data)
    } else {
      await pb.collection('shippingAddresses').create(data)
    }
    
    await fetchShippingAddresses()
    closeAddressForm()
  } catch (error) {
    console.error('Error saving address:', error)
  } finally {
    addressLoading.value = false
  }
}

const editAddress = (address) => {
  editingAddress.value = address
  Object.assign(addressForm, address)
  showAddressForm.value = true
}

const deleteAddress = async (addressId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) return
  
  try {
    const pb = usePocketBase()
    await pb.collection('shippingAddresses').delete(addressId)
    await fetchShippingAddresses()
  } catch (error) {
    console.error('Error deleting address:', error)
  }
}

const setDefaultAddress = async (addressId: string) => {
  try {
    const pb = usePocketBase()
    
    // Remove default from all addresses
    for (const addr of shippingAddresses.value) {
      if (addr.isDefault) {
        await pb.collection('shippingAddresses').update(addr.id, { isDefault: false })
      }
    }
    
    // Set new default
    await pb.collection('shippingAddresses').update(addressId, { isDefault: true })
    await fetchShippingAddresses()
  } catch (error) {
    console.error('Error setting default address:', error)
  }
}

const closeAddressForm = () => {
  showAddressForm.value = false
  editingAddress.value = null
  Object.assign(addressForm, {
    name: '',
    address: '',
    city: '',
    postCode: '',
    country: 'MA',
    phone: '',
    isDefault: false
  })
}

const deleteAccount = async () => {
  try {
    const pb = usePocketBase()
    await pb.collection('users').delete(authStore.currentUser?.id)
    await authStore.logout()
    navigateTo('/')
  } catch (error) {
    console.error('Error deleting account:', error)
  }
}

// Initialize
onMounted(() => {
  fetchShippingAddresses()
})
</script>