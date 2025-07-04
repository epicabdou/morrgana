<!-- components/CartSidebar.vue -->
<template>
  <!-- Overlay -->
  <div
    v-if="cartStore.isOpen"
    @click="cartStore.closeCart()"
    class="fixed inset-0 z-40 transition-opacity"
  ></div>

  <!-- Sidebar -->
  <div
    :class="[
      'fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
      cartStore.isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">
        Mon Panier ({{ cartStore.totalItems }})
      </h2>
      <button
        @click="cartStore.closeCart()"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Cart Content -->
    <div class="flex flex-col h-full">
      <!-- Empty State -->
      <div v-if="cartStore.isEmpty" class="flex-1 flex items-center justify-center p-6">
        <div class="text-center">
          <ShoppingBagIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
          <p class="text-gray-500 mb-4">Ajoutez des produits pour commencer vos achats</p>
          <button
            @click="cartStore.closeCart()"
            class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Continuer mes achats
          </button>
        </div>
      </div>

      <!-- Cart Items -->
      <div v-else class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
        >
          <!-- Product Image -->
          <div class="flex-shrink-0">
            <img
              :src="item.product.image"
              :alt="item.product.name"
              class="w-16 h-16 object-cover rounded-lg"
            />
          </div>

          <!-- Product Details -->
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-gray-900 text-sm line-clamp-2">
              {{ item.product.name }}
            </h4>
            
            <!-- Price -->
            <div class="flex items-center space-x-2 mt-1">
              <span
                v-if="item.product.promoPrice"
                class="text-sm font-medium text-rose-600"
              >
                {{ formatPrice(item.product.promoPrice) }}
              </span>
              <span
                :class="[
                  'text-sm',
                  item.product.promoPrice
                    ? 'text-gray-500 line-through'
                    : 'font-medium text-gray-900'
                ]"
              >
                {{ formatPrice(item.product.price) }}
              </span>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center space-x-2">
                <button
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1 || updatingItems[item.id]"
                  class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon class="w-3 h-3" />
                </button>
                
                <span class="text-sm font-medium w-8 text-center">
                  {{ item.quantity }}
                </span>
                
                <button
                  @click="increaseQuantity(item)"
                  :disabled="updatingItems[item.id] || (item.product.stock !== null && item.quantity >= item.product.stock)"
                  class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon class="w-3 h-3" />
                </button>
              </div>

              <button
                @click="removeItem(item)"
                :disabled="updatingItems[item.id]"
                class="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="cartStore.error" class="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <ExclamationCircleIcon class="w-5 h-5 text-red-600 mr-2" />
            <p class="text-sm text-red-800">{{ cartStore.error }}</p>
          </div>
          <button
            @click="cartStore.clearError()"
            class="text-red-600 hover:text-red-700"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!cartStore.isEmpty" class="border-t border-gray-200 p-4 space-y-4">
        <!-- Total -->
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-gray-900">Total:</span>
          <span class="text-lg font-bold text-gray-900">
            {{ formatPrice(cartStore.totalAmount) }}
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2">
          <NuxtLink
            to="/cart"
            @click="cartStore.closeCart()"
            class="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
          >
            Voir le panier
          </NuxtLink>
          
          <button
            @click="proceedToCheckout"
            :disabled="checkingOut"
            class="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ checkingOut ? 'Redirection...' : 'Commander' }}
          </button>
        </div>

        <!-- Free Shipping Progress -->
        <div v-if="freeShippingThreshold > 0 && cartStore.totalAmount < freeShippingThreshold" class="p-3 bg-blue-50 rounded-lg">
          <p class="text-xs text-blue-800 mb-2">
            Ajoutez {{ formatPrice(freeShippingThreshold - cartStore.totalAmount) }} pour la livraison gratuite
          </p>
          <div class="w-full bg-blue-200 rounded-full h-1.5">
            <div
              class="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min((cartStore.totalAmount / freeShippingThreshold) * 100, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  XMarkIcon,
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'
import type { CartItem } from '~/types'

const cartStore = useCartStore()

// Local state
const updatingItems = ref<Record<string, boolean>>({})
const checkingOut = ref(false)

// Configuration
const freeShippingThreshold = 50 // €50 for free shipping

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

const proceedToCheckout = async () => {
  if (checkingOut.value) return
  
  checkingOut.value = true
  
  try {
    cartStore.closeCart()
    await navigateTo('/checkout')
  } catch (error) {
    showNotification('Erreur lors de la redirection', 'error')
  } finally {
    checkingOut.value = false
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

// Close cart with Escape key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && cartStore.isOpen) {
      cartStore.closeCart()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>