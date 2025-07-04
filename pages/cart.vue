<!-- pages/cart.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mon Panier</h1>
      <NuxtLink 
        to="/products" 
        class="text-rose-600 hover:text-rose-700 font-medium"
      >
        Continuer mes achats
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="cartStore.isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement du panier...</p>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="cartStore.isEmpty" class="text-center py-12">
      <div class="mb-6">
        <ShoppingBagIcon class="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
        <p class="text-gray-600">Découvrez nos produits et ajoutez-les à votre panier</p>
      </div>
      <NuxtLink 
        to="/products" 
        class="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
      >
        Voir nos produits
      </NuxtLink>
    </div>

    <!-- Cart Items -->
    <div v-else class="lg:grid lg:grid-cols-12 lg:gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-8">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">
              Articles ({{ cartStore.totalItems }})
            </h2>
          </div>

          <div class="divide-y divide-gray-200">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="p-6 flex items-center space-x-4"
            >
              <!-- Product Image -->
              <div class="flex-shrink-0">
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 mb-1">
                  {{ item.product.name }}
                </h3>
                <p class="text-sm text-gray-500 mb-2">
                  {{ item.product.shortDescription }}
                </p>
                
                <!-- Price -->
                <div class="flex items-center space-x-2">
                  <span
                    v-if="item.product.promoPrice"
                    class="font-semibold text-rose-600"
                  >
                    {{ formatPrice(item.product.promoPrice) }}
                  </span>
                  <span
                    :class="[
                      item.product.promoPrice
                        ? 'text-sm text-gray-500 line-through'
                        : 'font-semibold text-gray-900'
                    ]"
                  >
                    {{ formatPrice(item.product.price) }}
                  </span>
                </div>

                <!-- Stock Warning -->
                <div v-if="item.product.stock !== null && item.product.stock < 5" class="mt-2">
                  <span class="text-sm text-orange-600">
                    Plus que {{ item.product.stock }} en stock
                  </span>
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center space-x-3">
                <button
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1 || updatingItems[item.id]"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                
                <span class="w-12 text-center font-medium">
                  {{ item.quantity }}
                </span>
                
                <button
                  @click="increaseQuantity(item)"
                  :disabled="updatingItems[item.id] || (item.product.stock !== null && item.quantity >= item.product.stock)"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>

              <!-- Item Total -->
              <div class="text-right">
                <p class="font-semibold text-gray-900">
                  {{ formatPrice(item.amount) }}
                </p>
              </div>

              <!-- Remove Button -->
              <button
                @click="removeItem(item)"
                :disabled="updatingItems[item.id]"
                class="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="cartStore.error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <ExclamationCircleIcon class="w-5 h-5 text-red-600 mr-2" />
            <p class="text-red-800">{{ cartStore.error }}</p>
            <button
              @click="cartStore.clearError()"
              class="ml-auto text-red-600 hover:text-red-700"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-4 mt-8 lg:mt-0">
        <div class="bg-white rounded-lg shadow-lg p-6 sticky top-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Résumé de la commande
          </h2>

          <div class="space-y-3">
            <div class="flex justify-between text-gray-600">
              <span>Sous-total ({{ cartStore.totalItems }} articles)</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            
            <div class="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span>{{ shippingCost > 0 ? formatPrice(shippingCost) : 'Gratuite' }}</span>
            </div>
            
            <div v-if="discount > 0" class="flex justify-between text-green-600">
              <span>Remise</span>
              <span>-{{ formatPrice(discount) }}</span>
            </div>
            
            <hr class="border-gray-200">
            
            <div class="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Free Shipping Progress -->
          <div v-if="freeShippingThreshold > 0 && subtotal < freeShippingThreshold" class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800 mb-2">
              Ajoutez {{ formatPrice(freeShippingThreshold - subtotal) }} pour bénéficier de la livraison gratuite
            </p>
            <div class="w-full bg-blue-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(subtotal / freeShippingThreshold) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Promo Code -->
          <div class="mt-6">
            <div class="flex space-x-2">
              <input
                v-model="promoCode"
                type="text"
                placeholder="Code promo"
                class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              <button
                @click="applyPromoCode"
                :disabled="!promoCode.trim() || applyingPromo"
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ applyingPromo ? 'Application...' : 'Appliquer' }}
              </button>
            </div>
          </div>

          <!-- Checkout Button -->
          <button
            @click="proceedToCheckout"
            :disabled="cartStore.isEmpty || checkingOut"
            class="w-full mt-6 bg-rose-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ checkingOut ? 'Redirection...' : 'Passer la commande' }}
          </button>

          <!-- Payment Methods -->
          <div class="mt-4 text-center">
            <p class="text-xs text-gray-500 mb-2">Paiements sécurisés</p>
            <div class="flex justify-center space-x-2">
              <img src="/icons/visa.svg" alt="Visa" class="h-6" />
              <img src="/icons/mastercard.svg" alt="Mastercard" class="h-6" />
              <img src="/icons/paypal.svg" alt="PayPal" class="h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Products -->
    <div v-if="!cartStore.isEmpty" class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Vous pourriez aussi aimer</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in recommendedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import type { CartItem, Product } from '~/types'

// Meta
useHead({
  title: 'Mon Panier - Morrgana',
  meta: [
    {
      name: 'description',
      content: 'Consultez et modifiez les articles de votre panier sur Morrgana'
    }
  ]
})

const cartStore = useCartStore()

// Reactive data
const updatingItems = ref<Record<string, boolean>>({})
const promoCode = ref('')
const applyingPromo = ref(false)
const checkingOut = ref(false)
const recommendedProducts = ref<Product[]>([])

// Configuration
const freeShippingThreshold = 50 // €50 for free shipping
const baseShippingCost = 5.99

// Computed
const subtotal = computed(() => cartStore.totalAmount)

const shippingCost = computed(() => {
  if (subtotal.value >= freeShippingThreshold) return 0
  return baseShippingCost
})

const discount = computed(() => {
  // Calculate discount based on promo codes or other rules
  return 0
})

const total = computed(() => {
  return Math.max(0, subtotal.value + shippingCost.value - discount.value)
})

// Methods
const increaseQuantity = async (item: CartItem) => {
  if (updatingItems.value[item.id]) return
  
  updatingItems.value[item.id] = true
  
  try {
    const success = cartStore.updateQuantity(item.id, item.quantity + 1)
    if (!success && cartStore.error) {
      showNotification(cartStore.error, 'error')
    }
  } finally {
    updatingItems.value[item.id] = false
  }
}

const decreaseQuantity = async (item: CartItem) => {
  if (updatingItems.value[item.id] || item.quantity <= 1) return
  
  updatingItems.value[item.id] = true
  
  try {
    cartStore.updateQuantity(item.id, item.quantity - 1)
  } finally {
    updatingItems.value[item.id] = false
  }
}

const removeItem = async (item: CartItem) => {
  if (updatingItems.value[item.id]) return
  
  // Confirm removal
  if (!confirm(`Êtes-vous sûr de vouloir supprimer "${item.product.name}" de votre panier ?`)) {
    return
  }
  
  updatingItems.value[item.id] = true
  
  try {
    const success = cartStore.removeItem(item.id)
    if (success) {
      showNotification('Article supprimé du panier', 'info')
    }
  } finally {
    updatingItems.value[item.id] = false
  }
}

const applyPromoCode = async () => {
  if (!promoCode.value.trim() || applyingPromo.value) return
  
  applyingPromo.value = true
  
  try {
    // Simulate API call to validate promo code
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, we'll just show a message
    showNotification('Code promo invalide', 'error')
  } catch (error) {
    showNotification('Erreur lors de l\'application du code promo', 'error')
  } finally {
    applyingPromo.value = false
  }
}

const proceedToCheckout = async () => {
  if (cartStore.isEmpty || checkingOut.value) return
  
  checkingOut.value = true
  
  try {
    // Here you would typically:
    // 1. Validate cart items
    // 2. Check stock availability
    // 3. Redirect to checkout page
    
    showNotification('Redirection vers le checkout...', 'info')
    
    // Simulate redirect delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    navigateTo('/checkout')
  } catch (error) {
    showNotification('Erreur lors de la redirection vers le checkout', 'error')
    checkingOut.value = false
  }
}

const fetchRecommendedProducts = async () => {
  try {
    const pb = usePocketBase()
    const result = await pb.collection('products').getList(1, 4, {
      sort: '-created',
      filter: 'featured = true'
    })
    recommendedProducts.value = result.items
  } catch (error) {
    console.error('Error fetching recommended products:', error)
  }
}

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Notification function
const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  if (process.client && window.showNotification) {
    window.showNotification(message, type)
  } else {
    console.log(`${type}: ${message}`)
  }
}

// Initialize
onMounted(() => {
  cartStore.initializeCart()
  fetchRecommendedProducts()
})
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>