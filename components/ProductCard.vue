<!-- components/ProductCard.vue -->
<template>
  <div class="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden rounded-t-lg">
      <img
        :src="getImageUrl(product, 'image')"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
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
          :disabled="wishlistLoading"
          class="p-2 bg-white rounded-full shadow-md hover:bg-rose-50 transition-colors disabled:opacity-50"
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
      <p class="text-sm text-gray-500 mb-3 line-clamp-2">
        {{ product.shortDescription }}
      </p>

      <!-- Rating -->
      <div class="flex items-center space-x-2 mb-3">
        <div class="flex items-center">
          <StarIcon
            v-for="i in 5"
            :key="i"
            :class="[
              'w-4 h-4',
              i <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            ]"
          />
        </div>
        <span class="text-sm text-gray-500">
          {{ averageRating > 0 ? averageRating.toFixed(1) : 'Nouveau' }}
        </span>
        <span v-if="reviewCount > 0" class="text-sm text-gray-400">
          ({{ reviewCount }} avis)
        </span>
      </div>

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

      <!-- Stock Info -->
      <div v-if="!isOutOfStock && product.stock !== null && product.stock < 10" class="mb-3">
        <span class="text-sm text-orange-600">
          Plus que {{ product.stock }} en stock
        </span>
      </div>

      <!-- Add to Cart Button -->
      <button
        @click.stop="addToCart"
        :disabled="isOutOfStock || cartLoading"
        :class="[
          'w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200',
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : cartLoading
            ? 'bg-rose-400 text-white cursor-not-allowed'
            : 'bg-rose-600 text-white hover:bg-rose-700'
        ]"
      >
        <span v-if="cartLoading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Ajout...
        </span>
        <span v-else>
          {{ isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon, EyeIcon, StarIcon } from '@heroicons/vue/24/outline'
import type { Product } from '~/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// Loading states
const cartLoading = ref(false)
const wishlistLoading = ref(false)

// Product rating data
const averageRating = ref(0)
const reviewCount = ref(0)

// Computed properties
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

// Methods
const addToCart = async () => {
  if (isOutOfStock.value || cartLoading.value) return
  
  cartLoading.value = true
  
  try {
    const success = await cartStore.addItem(props.product)
    
    if (success) {
      showNotification('Produit ajouté au panier', 'success')
    } else {
      showNotification(cartStore.error || 'Erreur lors de l\'ajout au panier', 'error')
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    showNotification('Erreur lors de l\'ajout au panier', 'error')
  } finally {
    cartLoading.value = false
  }
}

const toggleWishlist = async () => {
  if (wishlistLoading.value) return
  
  wishlistLoading.value = true
  
  try {
    const success = await wishlistStore.toggleWishlist(props.product.id)
    
    if (success) {
      const message = isInWishlist.value 
        ? 'Ajouté à la wishlist' 
        : 'Retiré de la wishlist'
      showNotification(message, 'success')
    } else if (wishlistStore.error) {
      showNotification(wishlistStore.error, 'error')
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error)
    showNotification('Erreur lors de la mise à jour de la wishlist', 'error')
  } finally {
    wishlistLoading.value = false
  }
}

const quickView = () => {
  // Navigate to product page
  navigateTo(`/products/${props.product.slug}`)
}

const fetchProductRating = async () => {
  try {
    const pb = usePocketBase()
    
    // Fetch reviews for this product
    const reviews = await pb.collection('reviews').getFullList({
      filter: `product = "${props.product.id}"`,
      fields: 'rating'
    })
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      averageRating.value = totalRating / reviews.length
      reviewCount.value = reviews.length
    } else {
      averageRating.value = 0
      reviewCount.value = 0
    }
  } catch (error) {
    console.error('Error fetching product rating:', error)
    averageRating.value = 0
    reviewCount.value = 0
  }
}

// Helper functions
const getImageUrl = (record: any, filename: string) => {
  if (!record || !record[filename]) return '/placeholder-image.jpg'
  const pb = usePocketBase()
  return pb.files.getUrl(record, record[filename])
}

const formatPrice = (price: number) => {
  return `${price.toFixed(2)} MAD`
}

// Notification function
const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  if (process.client && window.showNotification) {
    window.showNotification(message, type)
  } else {
    console.log(`${type}: ${message}`)
  }
}

// Initialize rating data when component mounts
onMounted(() => {
  fetchProductRating()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>