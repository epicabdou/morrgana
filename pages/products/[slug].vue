<!-- pages/products/[slug].vue -->
<template>
  <div v-if="product">
    <!-- Breadcrumb -->
    <nav class="bg-gray-50 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol class="flex items-center space-x-2 text-sm">
          <li><NuxtLink to="/" class="text-gray-500 hover:text-rose-600">Accueil</NuxtLink></li>
          <li><ChevronRightIcon class="w-4 h-4 text-gray-400" /></li>
          <li><NuxtLink to="/products" class="text-gray-500 hover:text-rose-600">Produits</NuxtLink></li>
          <li v-if="product.expand?.category">
            <ChevronRightIcon class="w-4 h-4 text-gray-400" />
          </li>
          <li v-if="product.expand?.category">
            <NuxtLink 
              :to="`/categories/${product.expand.category.slug}`" 
              class="text-gray-500 hover:text-rose-600"
            >
              {{ product.expand.category.name }}
            </NuxtLink>
          </li>
          <li><ChevronRightIcon class="w-4 h-4 text-gray-400" /></li>
          <li class="text-gray-900 font-medium">{{ product.name }}</li>
        </ol>
      </div>
    </nav>

    <!-- Product Details -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-2 lg:gap-12">
        <!-- Product Images -->
        <div class="mb-8 lg:mb-0">
          <!-- Main Image -->
          <div class="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="getImageUrl(product, selectedImage, '600x600')"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Gallery Thumbnails -->
          <div v-if="product.gallery && product.gallery.length > 0" class="grid grid-cols-4 gap-4">
            <button
              @click="selectedImage = product.image"
              class="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2"
              :class="{ 'border-rose-500': selectedImage === product.image, 'border-transparent': selectedImage !== product.image }"
            >
              <img
                :src="getImageUrl(product, product.image, '150x150')"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </button>
            <button
              v-for="image in product.gallery"
              :key="image"
              @click="selectedImage = image"
              class="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2"
              :class="{ 'border-rose-500': selectedImage === image, 'border-transparent': selectedImage !== image }"
            >
              <img
                :src="getImageUrl(product, image, '150x150')"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <!-- Category -->
          <div v-if="product.expand?.category" class="text-sm text-rose-600 font-medium mb-2">
            {{ product.expand.category.name }}
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            {{ product.name }}
          </h1>

          <!-- Price -->
          <div class="flex items-center space-x-4 mb-6">
            <span v-if="product.promoPrice" class="text-3xl font-bold text-rose-600">
              {{ formatPrice(product.promoPrice) }}
            </span>
            <span
              :class="[
                product.promoPrice 
                  ? 'text-xl text-gray-500 line-through' 
                  : 'text-3xl font-bold text-gray-900'
              ]"
            >
              {{ formatPrice(product.price) }}
            </span>
            <span v-if="product.promoPrice" class="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
              -{{ discountPercentage }}%
            </span>
          </div>

          <!-- Short Description -->
          <p class="text-lg text-gray-600 mb-6">
            {{ product.shortDescription }}
          </p>

          <!-- Stock Status -->
          <div class="mb-6">
            <span v-if="isOutOfStock" class="text-red-600 font-medium">
              ❌ Rupture de stock
            </span>
            <span v-else-if="product.stock && product.stock <= 5" class="text-yellow-600 font-medium">
              ⚠️ Stock limité ({{ product.stock }} restant{{ product.stock !== 1 ? 's' : '' }})
            </span>
            <span v-else class="text-green-600 font-medium">
              ✅ En stock
            </span>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <div class="flex items-center border border-gray-300 rounded-lg">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="p-3 hover:bg-gray-50"
              >
                <MinusIcon class="w-4 h-4" />
              </button>
              <span class="px-4 py-3 min-w-[60px] text-center">{{ quantity }}</span>
              <button
                @click="quantity++"
                class="p-3 hover:bg-gray-50"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>
            
            <button
              @click="addToCart"
              :disabled="isOutOfStock"
              class="flex-1 bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {{ isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier' }}
            </button>
            
            <button
              @click="toggleWishlist"
              class="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              :class="{ 'text-rose-500 border-rose-500': isInWishlist }"
            >
              <HeartIcon class="w-6 h-6" :class="{ 'fill-current': isInWishlist }" />
            </button>
          </div>

          <!-- Tags -->
          <div v-if="product.expand?.tags && product.expand.tags.length > 0" class="mb-8">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="tag in product.expand.tags"
                :key="tag.id"
                :to="`/tags/${tag.slug}`"
                class="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                #{{ tag.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Features -->
          <div class="border-t border-gray-200 pt-8">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <span class="text-green-600 text-2xl">🌿</span>
                </div>
                <span class="text-sm font-medium text-gray-900">100% Naturel</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span class="text-blue-600 text-2xl">🚚</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Livraison gratuite</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <span class="text-purple-600 text-2xl">♻️</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Éco-responsable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="mt-16">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'description'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'description'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Description
            </button>
            <button
              @click="activeTab = 'ingredients'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'ingredients'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Ingrédients
            </button>
            <button
              @click="activeTab = 'usage'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'usage'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Utilisation
            </button>
          </nav>
        </div>

        <div class="py-8">
          <div v-if="activeTab === 'description'" class="prose max-w-none" v-html="product.longDescription"></div>
          <div v-else-if="activeTab === 'ingredients'" class="prose max-w-none">
            <p>Ingrédients naturels soigneusement sélectionnés pour leur qualité et leurs bienfaits.</p>
            <!-- Add ingredients content here -->
          </div>
          <div v-else-if="activeTab === 'usage'" class="prose max-w-none">
            <p>Mode d'emploi pour une utilisation optimale de votre gommage corporel.</p>
            <!-- Add usage instructions here -->
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Produits similaires</h2>
        <ProductGrid
          :products="relatedProducts"
          :is-loading="loadingRelated"
          empty-message="Aucun produit similaire trouvé."
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
    <p class="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
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
  PlusIcon
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
const loadingRelated = ref(false)
const pending = ref(true)
const selectedImage = ref('')
const quantity = ref(1)
const activeTab = ref('description')

// Computed
const isOutOfStock = computed(() => product.value?.stock !== null && product.value?.stock <= 0)
const isInWishlist = computed(() => product.value ? wishlistStore.isInWishlist(product.value.id) : false)

const discountPercentage = computed(() => {
  if (!product.value?.promoPrice) return 0
  return Math.round(((product.value.price - product.value.promoPrice) / product.value.price) * 100)
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
    selectedImage.value = result.image
    
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
    
    // Fetch related products
    await fetchRelatedProducts()
    
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

const addToCart = () => {
  if (product.value && !isOutOfStock.value) {
    cartStore.addItem(product.value, quantity.value)
  }
}

const toggleWishlist = async () => {
  if (!product.value) return
  
  try {
    if (isInWishlist.value) {
      await wishlistStore.removeFromWishlist(product.value.id)
    } else {
      await wishlistStore.addToWishlist(product.value.id)
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error)
  }
}

// Initialize
onMounted(() => {
  fetchProduct()
})
</script>