<!-- pages/products/[slug].vue -->
<template>
  <!-- Product Details -->
  <div v-if="product && !pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex mb-8" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
            Accueil
          </NuxtLink>
        </li>
        <ChevronRightIcon class="w-5 h-5 text-gray-400" />
        <li class="inline-flex items-center">
          <NuxtLink to="/products" class="text-gray-500 hover:text-gray-700">
            Produits
          </NuxtLink>
        </li>
        <ChevronRightIcon class="w-5 h-5 text-gray-400" />
        <li v-if="product.expand?.category">
          <NuxtLink :to="`/categories/${product.expand.category.slug}`" class="text-gray-500 hover:text-gray-700">
            {{ product.expand.category.name }}
          </NuxtLink>
        </li>
        <ChevronRightIcon class="w-5 h-5 text-gray-400" />
        <li>
          <span class="text-gray-900 font-medium">{{ product.name }}</span>
        </li>
      </ol>
    </nav>

    <div class="lg:grid lg:grid-cols-2 lg:gap-12">
      <!-- Product Images -->
      <div class="mb-8 lg:mb-0">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img
            :src="getImageUrl(product, selectedImage, '600x600')"
            :alt="product.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
        
        <!-- Image Gallery -->
        <div v-if="allImages.length > 1" class="grid grid-cols-4 gap-2">
          <button
            v-for="image in allImages"
            :key="image"
            @click="selectedImage = image"
            :class="[
              'aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors',
              selectedImage === image ? 'border-rose-500' : 'border-transparent hover:border-gray-300'
            ]"
          >
            <img
              :src="getImageUrl(product, image, '150x150')"
              :alt="product.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <!-- Product Title & Price -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ product.name }}
          </h1>
          
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center space-x-2">
              <span
                v-if="product.promoPrice"
                class="text-2xl font-bold text-rose-600"
              >
                {{ formatPrice(product.promoPrice) }}
              </span>
              <span
                :class="[
                  product.promoPrice
                    ? 'text-lg text-gray-500 line-through'
                    : 'text-2xl font-bold text-gray-900'
                ]"
              >
                {{ formatPrice(product.price) }}
              </span>
            </div>
            
            <span
              v-if="discountPercentage > 0"
              class="bg-red-500 text-white text-sm px-2 py-1 rounded-full"
            >
              -{{ discountPercentage }}%
            </span>
          </div>

          <!-- Stock Status -->
          <div class="mb-4">
            <span
              v-if="isOutOfStock"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
            >
              Rupture de stock
            </span>
            <span
              v-else-if="product.stock !== null && product.stock < 10"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
            >
              Plus que {{ product.stock }} en stock
            </span>
            <span
              v-else
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
            >
              En stock
            </span>
          </div>

          <!-- Short Description -->
          <p class="text-gray-500 text-lg">
            {{ product.shortDescription }}
          </p>
        </div>

        <!-- Quantity and Actions -->
        <div class="mb-8">
          <div class="flex items-center space-x-4 mb-4">
            <!-- Quantity Selector -->
            <div class="flex items-center space-x-3">
              <label class="text-sm font-medium text-gray-700">Quantité:</label>
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  class="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                <span class="px-4 py-2 font-medium">{{ quantity }}</span>
                <button
                  @click="increaseQuantity"
                  :disabled="isOutOfStock || (product.stock !== null && quantity >= product.stock)"
                  class="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4">
            <button
              @click="addToCart"
              :disabled="isOutOfStock || cartLoading"
              :class="[
                'flex-1 py-3 px-6 rounded-lg font-semibold transition-colors',
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : cartLoading
                  ? 'bg-rose-400 text-white cursor-not-allowed'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              ]"
            >
              <span v-if="cartLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ajout...
              </span>
              <span v-else>
                {{ isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier' }}
              </span>
            </button>

            <button
              @click="toggleWishlist"
              :disabled="wishlistLoading"
              :class="[
                'px-6 py-3 rounded-lg border transition-colors',
                isInWishlist
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <HeartIcon 
                :class="[
                  'w-5 h-5',
                  isInWishlist ? 'fill-current' : ''
                ]" 
              />
            </button>
          </div>
        </div>

        <!-- Product Details Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="space-y-4">
          <div v-if="activeTab === 'description'">
            <div v-html="product.longDescription" class="prose max-w-none"></div>
          </div>
          
          <div v-else-if="activeTab === 'specifications'" class="space-y-2">
            <div v-if="product.specifications">
              <div v-for="(value, key) in product.specifications" :key="key" class="flex justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-900">{{ key }}</span>
                <span class="text-gray-500">{{ value }}</span>
              </div>
            </div>
            <p v-else class="text-gray-500">Aucune spécification disponible.</p>
          </div>
          
          <div v-else-if="activeTab === 'shipping'">
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Livraison standard</h4>
                <p class="text-gray-500">Livraison en 3-5 jours ouvrés pour {{ formatPrice(50) }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Livraison express</h4>
                <p class="text-gray-500">Livraison en 24-48h pour {{ formatPrice(80) }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Livraison gratuite</h4>
                <p class="text-gray-500">Pour les commandes de plus de {{ formatPrice(500) }}</p>
              </div>
            </div>
          </div>
          
          <div v-else-if="activeTab === 'reviews'">
            <div class="space-y-6">
              <!-- Reviews Summary -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">Avis clients</h3>
                  <button
                    @click="showReviewForm = !showReviewForm"
                    class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 text-sm"
                  >
                    Écrire un avis
                  </button>
                </div>
                
                <div class="flex items-center space-x-4">
                  <div class="flex items-center">
                    <span class="text-3xl font-bold text-gray-900">{{ averageRating.toFixed(1) }}</span>
                    <div class="ml-2 flex items-center">
                      <StarIcon
                        v-for="i in 5"
                        :key="i"
                        :class="[
                          'w-5 h-5',
                          i <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        ]"
                      />
                    </div>
                  </div>
                  <span class="text-sm text-gray-500">{{ reviews.length }} avis</span>
                </div>
              </div>

              <!-- Review Form -->
              <div v-if="showReviewForm" class="bg-white border border-gray-200 rounded-lg p-6">
                <h4 class="font-semibold text-gray-900 mb-4">Donner votre avis</h4>
                <form @submit.prevent="submitReview">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Note</label>
                    <div class="flex items-center space-x-1">
                      <button
                        v-for="i in 5"
                        :key="i"
                        type="button"
                        @click="reviewForm.rating = i"
                        :class="[
                          'w-8 h-8 transition-colors',
                          i <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                        ]"
                      >
                        <StarIcon class="w-full h-full fill-current" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Votre avis</label>
                    <textarea
                      v-model="reviewForm.comment"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Partagez votre expérience avec ce produit..."
                      required
                    ></textarea>
                  </div>
                  
                  <div class="flex space-x-3">
                    <button
                      type="submit"
                      :disabled="reviewSubmitting"
                      class="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 disabled:opacity-50"
                    >
                      {{ reviewSubmitting ? 'Envoi...' : 'Publier l\'avis' }}
                    </button>
                    <button
                      type="button"
                      @click="showReviewForm = false"
                      class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>

              <!-- Reviews List -->
              <div class="space-y-4">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="font-medium text-gray-900">{{ review.expand?.user?.name || 'Client anonyme' }}</span>
                        <div class="flex items-center">
                          <StarIcon
                            v-for="i in 5"
                            :key="i"
                            :class="[
                              'w-4 h-4',
                              i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            ]"
                          />
                        </div>
                      </div>
                      <span class="text-sm text-gray-500">{{ formatDate(review.created) }}</span>
                    </div>
                  </div>
                  <p class="text-gray-700">{{ review.comment }}</p>
                </div>
                
                <div v-if="reviews.length === 0" class="text-center py-8 text-gray-500">
                  Aucun avis pour ce produit. Soyez le premier à donner votre avis !
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts.length > 0" class="mt-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Produits similaires</h2>
      <div v-if="loadingRelated" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          :product="relatedProduct"
        />
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="animate-pulse">
      <div class="lg:grid lg:grid-cols-2 lg:gap-12">
        <div class="bg-gray-200 aspect-square rounded-lg mb-8 lg:mb-0"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
          <div class="h-12 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
    <p class="text-gray-500 mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
    <NuxtLink to="/products" class="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors">
      Retour aux produits
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRightIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

// Get route params
const route = useRoute()
const slug = route.params.slug as string

// Composables
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// Data
const product = ref(null)
const relatedProducts = ref([])
const reviews = ref([])
const loadingRelated = ref(false)
const pending = ref(true)
const selectedImage = ref('')
const quantity = ref(1)
const activeTab = ref('description')

// Loading states
const cartLoading = ref(false)
const wishlistLoading = ref(false)

// Review form
const showReviewForm = ref(false)
const reviewSubmitting = ref(false)
const reviewForm = reactive({
  rating: 5,
  comment: ''
})

// Tabs configuration
const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Caractéristiques' },
  { id: 'shipping', label: 'Livraison' },
  { id: 'reviews', label: 'Avis clients' }
]

// Computed
const isOutOfStock = computed(() => product.value?.stock !== null && product.value?.stock <= 0)
const isInWishlist = computed(() => product.value ? wishlistStore.isInWishlist(product.value.id) : false)

const discountPercentage = computed(() => {
  if (!product.value?.promoPrice) return 0
  return Math.round(((product.value.price - product.value.promoPrice) / product.value.price) * 100)
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return sum / reviews.value.length
})

// Computed property for all images (main image + gallery)
const allImages = computed(() => {
  if (!product.value) return []
  
  const images = []
  
  // Add main image if it exists
  if (product.value.image) {
    images.push(product.value.image)
  }
  
  // Add gallery images if they exist
  if (product.value.gallery && Array.isArray(product.value.gallery)) {
    images.push(...product.value.gallery)
  }
  
  return images
})

// Methods
const fetchProduct = async () => {
  try {
    const pb = usePocketBase()
    const result = await pb.collection('products').getFirstListItem(
      `slug = "${slug}"`,
      { expand: 'category,tags' }
    )
    
    product.value = result
    // Set the first available image as selected
    selectedImage.value = result.image || (result.gallery && result.gallery[0]) || ''
    
    // Set SEO
    useHead({
      title: `${result.name} - Morrgana`,
      meta: [
        {
          name: 'description',
          content: result.shortDescription
        }
      ]
    })
    
    // Fetch related products and reviews
    await Promise.all([
      fetchRelatedProducts(),
      fetchReviews()
    ])
    
  } catch (error) {
    console.error('Error fetching product:', error)
    throw createError({
      statusCode: 404,
      statusMessage: 'Produit non trouvé'
    })
  } finally {
    pending.value = false
  }
}

const fetchRelatedProducts = async () => {
  if (!product.value) return
  
  loadingRelated.value = true
  try {
    const pb = usePocketBase()
    const result = await pb.collection('products').getList(1, 4, {
      filter: `category = "${product.value.category}" && id != "${product.value.id}"`,
      expand: 'category,tags',
      sort: '-created'
    })
    relatedProducts.value = result.items
  } catch (error) {
    console.error('Error fetching related products:', error)
  } finally {
    loadingRelated.value = false
  }
}

const fetchReviews = async () => {
  if (!product.value) return
  
  try {
    const pb = usePocketBase()
    const result = await pb.collection('reviews').getFullList({
      filter: `product = "${product.value.id}"`,
      expand: 'user',
      sort: '-created'
    })
    reviews.value = result
  } catch (error) {
    console.error('Error fetching reviews:', error)
    reviews.value = []
  }
}

const submitReview = async () => {
  if (!product.value || reviewSubmitting.value) return
  
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    showNotification('Vous devez être connecté pour laisser un avis', 'error')
    return
  }
  
  reviewSubmitting.value = true
  
  try {
    const pb = usePocketBase()
    await pb.collection('reviews').create({
      product: product.value.id,
      user: authStore.currentUser.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment
    })
    
    // Reset form and refresh reviews
    reviewForm.rating = 5
    reviewForm.comment = ''
    showReviewForm.value = false
    await fetchReviews()
    
    showNotification('Votre avis a été publié avec succès', 'success')
  } catch (error) {
    console.error('Error submitting review:', error)
    showNotification('Erreur lors de la publication de votre avis', 'error')
  } finally {
    reviewSubmitting.value = false
  }
}

const increaseQuantity = () => {
  if (product.value?.stock !== null && quantity.value >= product.value.stock) return
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  if (!product.value || isOutOfStock.value || cartLoading.value) return
  
  cartLoading.value = true
  
  try {
    const success = await cartStore.addItem(product.value, quantity.value)
    
    if (success) {
      showNotification(`${quantity.value} × ${product.value.name} ajouté(s) au panier`, 'success')
      quantity.value = 1 // Reset quantity
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
  if (!product.value || wishlistLoading.value) return
  
  wishlistLoading.value = true
  
  try {
    const success = await wishlistStore.toggleWishlist(product.value.id)
    
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

// Helper functions
const getImageUrl = (record: any, filename: string, size?: string): string => {
  if (!record || !filename) return '/placeholder-image.jpg'
  
  const pb = usePocketBase()
  const baseUrl = `${pb.baseUrl}/api/files/${record.collectionName}/${record.id}/${filename}`
  return size ? `${baseUrl}?thumb=${size}` : baseUrl
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-image.jpg'
}

// Format price helper
const formatPrice = (price: number) => {
  return `${price.toFixed(2)} MAD`
}

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
  fetchProduct()
})
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}

.prose {
  color: rgb(107 114 128);
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: rgb(17 24 39);
  font-weight: 600;
}

.prose ul,
.prose ol {
  margin-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 1rem;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>