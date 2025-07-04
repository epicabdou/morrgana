<!-- components/ProductCard.vue -->
<template>
  <div class="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden rounded-t-lg">
      <img
        :src="getImageUrl(product, product.image, '400x400')"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col space-y-1">
        <span v-if="product.promoPrice" class="bg-red-500 text-white text-xs px-2 py-1 rounded">
          -{{ discountPercentage }}%
        </span>
        <span v-if="isNew" class="bg-green-500 text-white text-xs px-2 py-1 rounded">
          Nouveau
        </span>
        <span v-if="product.isFeatured" class="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          ⭐ Vedette
        </span>
      </div>

      <!-- Quick Actions -->
      <div class="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          @click.stop="toggleWishlist"
          class="p-2 bg-white rounded-full shadow-md hover:bg-rose-50 transition-colors"
          :class="{ 'text-rose-500': isInWishlist, 'text-gray-400': !isInWishlist }"
        >
          <HeartIcon class="w-5 h-5" :class="{ 'fill-current': isInWishlist }" />
        </button>
        <button
          @click.stop="quickView"
          class="p-2 bg-white rounded-full shadow-md hover:bg-rose-50 transition-colors text-gray-400 hover:text-rose-500"
        >
          <EyeIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Out of Stock Overlay -->
      <div v-if="isOutOfStock" class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-t-lg">
        <span class="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
          Rupture de stock
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Category -->
      <div class="text-sm text-gray-500 mb-1">
        {{ product.expand?.category?.name }}
      </div>

      <!-- Title -->
      <h3 class="font-medium text-gray-900 mb-2 line-clamp-2">
        <NuxtLink :to="`/products/${product.slug}`" class="hover:text-rose-600">
          {{ product.name }}
        </NuxtLink>
      </h3>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ product.shortDescription }}
      </p>

      <!-- Price -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <span v-if="product.promoPrice" class="text-lg font-bold text-rose-600">
            {{ formatPrice(product.promoPrice) }}
          </span>
          <span
            :class="[
              product.promoPrice ? 'text-sm text-gray-500 line-through' : 'text-lg font-bold text-gray-900'
            ]"
          >
            {{ formatPrice(product.price) }}
          </span>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button
        @click.stop="addToCart"
        :disabled="isOutOfStock"
        class="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {{ isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon, EyeIcon } from '@heroicons/vue/24/outline'
import type { Product } from '~/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))
const isOutOfStock = computed(() => props.product.stock !== null && props.product.stock <= 0)

const isNew = computed(() => {
  const createdDate = new Date(props.product.created)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return createdDate > weekAgo
})

const discountPercentage = computed(() => {
  if (!props.product.promoPrice) return 0
  return Math.round(((props.product.price - props.product.promoPrice) / props.product.price) * 100)
})

const addToCart = () => {
  if (!isOutOfStock.value) {
    cartStore.addItem(props.product)
    // Show success notification
    showNotification('Produit ajouté au panier', 'success')
  }
}

const toggleWishlist = async () => {
  try {
    if (isInWishlist.value) {
      await wishlistStore.removeFromWishlist(props.product.id)
      //showNotification('Retiré de la wishlist', 'info')
    } else {
      await wishlistStore.addToWishlist(props.product.id)
      //showNotification('Ajouté à la wishlist', 'success')
    }
  } catch (error) {
    //showNotification('Erreur lors de la mise à jour de la wishlist', 'error')
  }
}

const quickView = () => {
  // Open quick view modal
  // TODO: Implement quick view modal
  navigateTo(`/products/${props.product.slug}`)
}

// Mock notification function - implement with your preferred notification system
const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
  // TODO: Implement notification system
  console.log(`${type}: ${message}`)
}
</script>