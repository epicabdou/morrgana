<!-- components/CartSidebar.vue -->
<template>
  <div
    v-if="cartStore.isOpen"
    class="fixed inset-0 z-50 overflow-hidden"
    @click="cartStore.closeCart()"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50" />
    
    <div
      class="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
      @click.stop
    >
      <div class="flex h-full flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 class="text-lg font-semibold text-gray-900">
            Panier ({{ cartStore.totalItems }})
          </h2>
          <button
            @click="cartStore.closeCart()"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cartStore.isEmpty" class="text-center py-8">
            <ShoppingBagIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">Votre panier est vide</p>
            <NuxtLink
              to="/products"
              @click="cartStore.closeCart()"
              class="mt-4 inline-block bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700"
            >
              Découvrir nos produits
            </NuxtLink>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center space-x-4 border-b border-gray-200 pb-4"
            >
              <img
                :src="getImageUrl(item.product, item.product.image, '100x100')"
                :alt="item.product.name"
                class="h-16 w-16 rounded-lg object-cover"
              />
              
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-2">
                  {{ item.product.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ formatPrice(item.product.promoPrice || item.product.price) }}
                </p>
                
                <!-- Quantity Controls -->
                <div class="flex items-center mt-2">
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-50"
                  >
                    <MinusIcon class="w-4 h-4" />
                  </button>
                  <span class="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 text-sm">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-50"
                  >
                    <PlusIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  {{ formatPrice(item.amount) }}
                </p>
                <button
                  @click="cartStore.removeItem(item.id)"
                  class="text-red-500 hover:text-red-700 text-sm mt-1"
                >
                  Retirer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!cartStore.isEmpty" class="border-t border-gray-200 p-4 space-y-4">
          <div class="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{{ formatPrice(cartStore.totalAmount) }}</span>
          </div>
          
          <div class="space-y-2">
            <NuxtLink
              to="/cart"
              @click="cartStore.closeCart()"
              class="w-full block text-center bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Voir le panier
            </NuxtLink>
            <NuxtLink
              to="/checkout"
              @click="cartStore.closeCart()"
              class="w-full block text-center bg-rose-600 text-white py-3 px-4 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Commander
            </NuxtLink>
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
  PlusIcon
} from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
</script>