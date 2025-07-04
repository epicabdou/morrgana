<!-- pages/products/index.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h1>
      <p class="text-gray-600">Découvrez notre sélection de produits de qualité</p>
    </div>

    <!-- Filters and Search -->
    <div class="mb-8">
      <!-- Mobile Filter Button -->
      <div class="lg:hidden mb-4">
        <button
          @click="showMobileFilters = !showMobileFilters"
          class="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
        >
          <AdjustmentsHorizontalIcon class="w-5 h-5 mr-2" />
          Filtres
          <span v-if="activeFiltersCount > 0" class="ml-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>

      <div class="lg:grid lg:grid-cols-4 lg:gap-8">
        <!-- Sidebar Filters -->
        <div :class="[
          'lg:col-span-1',
          showMobileFilters ? 'block' : 'hidden lg:block'
        ]">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div class="relative">
                <input
                  v-model="filters.search"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Nom du produit..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <!-- Categories -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Catégories
              </label>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <label class="flex items-center">
                  <input
                    v-model="filters.categories"
                    value=""
                    type="radio"
                    class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Toutes les catégories</span>
                </label>
                <label
                  v-for="category in categories"
                  :key="category.id"
                  class="flex items-center"
                >
                  <input
                    v-model="filters.categories"
                    :value="category.id"
                    type="radio"
                    class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">
                    {{ category.name }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Prix
              </label>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model.number="filters.minPrice"
                    type="number"
                    placeholder="Min"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    @input="debouncedSearch"
                  />
                  <input
                    v-model.number="filters.maxPrice"
                    type="number"
                    placeholder="Max"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    @input="debouncedSearch"
                  />
                </div>
                
                <!-- Quick Price Filters -->
                <div class="space-y-2">
                  <button
                    v-for="priceRange in priceRanges"
                    :key="priceRange.label"
                    @click="selectPriceRange(priceRange)"
                    class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    {{ priceRange.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Availability -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Disponibilité
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="filters.inStock"
                    type="checkbox"
                    class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">En stock uniquement</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.onSale"
                    type="checkbox"
                    class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">En promotion</span>
                </label>
              </div>
            </div>

            <!-- Clear Filters -->
            <button
              v-if="activeFiltersCount > 0"
              @click="clearFilters"
              class="w-full px-4 py-2 text-sm text-rose-600 border border-rose-300 rounded-lg hover:bg-rose-50"
            >
              Effacer les filtres
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="lg:col-span-3 mt-6 lg:mt-0">
          <!-- Toolbar -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <!-- Results Count -->
            <div class="mb-4 sm:mb-0">
              <p class="text-sm text-gray-700">
                <span v-if="!isLoading">
                  Affichage de {{ ((currentPage - 1) * perPage) + 1 }} à 
                  {{ Math.min(currentPage * perPage, totalItems) }} sur {{ totalItems }} produits
                </span>
                <span v-else>Chargement...</span>
              </p>
            </div>

            <!-- Sort Options -->
            <div class="flex items-center space-x-4">
              <label class="text-sm text-gray-700">Trier par:</label>
              <select
                v-model="filters.sort"
                @change="fetchProducts"
                class="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="-created">Plus récents</option>
                <option value="created">Plus anciens</option>
                <option value="name">Nom A-Z</option>
                <option value="-name">Nom Z-A</option>
                <option value="price">Prix croissant</option>
                <option value="-price">Prix décroissant</option>
                <option value="-stock">Stock disponible</option>
              </select>

              <!-- View Toggle -->
              <div class="flex border border-gray-300 rounded-lg">
                <button
                  @click="viewMode = 'grid'"
                  :class="[
                    'px-3 py-1 text-sm',
                    viewMode === 'grid'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <Squares2X2Icon class="w-4 h-4" />
                </button>
                <button
                  @click="viewMode = 'list'"
                  :class="[
                    'px-3 py-1 text-sm border-l border-gray-300',
                    viewMode === 'list'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <ListBulletIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Active Filters -->
          <div v-if="activeFiltersCount > 0" class="mb-6">
            <div class="flex flex-wrap gap-2">
              <span class="text-sm text-gray-700">Filtres actifs:</span>
              
              <span
                v-if="filters.search"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-rose-100 text-rose-800"
              >
                Recherche: "{{ filters.search }}"
                <button @click="filters.search = ''; fetchProducts()" class="ml-1">
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
              
              <span
                v-if="filters.categories"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-rose-100 text-rose-800"
              >
                {{ getCategoryName(filters.categories) }}
                <button @click="filters.categories = ''; fetchProducts()" class="ml-1">
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
              
              <span
                v-if="filters.minPrice || filters.maxPrice"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-rose-100 text-rose-800"
              >
                Prix: {{ formatPrice(filters.minPrice || 0) }} - {{ formatPrice(filters.maxPrice || 9999) }}
                <button @click="filters.minPrice = null; filters.maxPrice = null; fetchProducts()" class="ml-1">
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
              
              <span
                v-if="filters.inStock"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-rose-100 text-rose-800"
              >
                En stock
                <button @click="filters.inStock = false; fetchProducts()" class="ml-1">
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
              
              <span
                v-if="filters.onSale"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-rose-100 text-rose-800"
              >
                En promotion
                <button @click="filters.onSale = false; fetchProducts()" class="ml-1">
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="n in 6"
              :key="n"
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
            >
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>

          <!-- Products Grid View -->
          <div
            v-else-if="viewMode === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- Products List View -->
          <div v-else-if="viewMode === 'list'" class="space-y-4">
            <div
              v-for="product in products"
              :key="product.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-6 hover:shadow-md transition-shadow"
            >
              <!-- Product Image -->
              <div class="flex-shrink-0">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">
                      <NuxtLink :to="`/products/${product.slug}`" class="hover:text-rose-600">
                        {{ product.name }}
                      </NuxtLink>
                    </h3>
                    
                    <p class="text-gray-600 text-sm mb-2 line-clamp-2">
                      {{ product.shortDescription }}
                    </p>

                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span v-if="product.expand?.category">
                        {{ product.expand.category.name }}
                      </span>
                      <span v-if="product.stock !== null">
                        {{ product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock' }}
                      </span>
                    </div>
                  </div>

                  <div class="text-right ml-4">
                    <!-- Price -->
                    <div class="flex items-center space-x-2 mb-3">
                      <span
                        v-if="product.promoPrice"
                        class="text-xl font-bold text-rose-600"
                      >
                        {{ formatPrice(product.promoPrice) }}
                      </span>
                      <span
                        :class="[
                          product.promoPrice
                            ? 'text-sm text-gray-500 line-through'
                            : 'text-xl font-bold text-gray-900'
                        ]"
                      >
                        {{ formatPrice(product.price) }}
                      </span>
                    </div>

                    <!-- Quick Actions -->
                    <div class="flex items-center space-x-2">
                      <button
                        @click="toggleWishlist(product.id)"
                        :class="[
                          'p-2 rounded-full border transition-colors',
                          wishlistStore.isInWishlist(product.id)
                            ? 'bg-rose-50 border-rose-300 text-rose-600'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        ]"
                      >
                        <HeartIcon 
                          :class="[
                            'w-4 h-4',
                            wishlistStore.isInWishlist(product.id) ? 'fill-current' : ''
                          ]" 
                        />
                      </button>
                      
                      <button
                        @click="addToCart(product)"
                        :disabled="product.stock !== null && product.stock <= 0"
                        class="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!isLoading && products.length === 0" class="text-center py-12">
            <div class="mb-6">
              <MagnifyingGlassIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p class="text-gray-600">
                {{ activeFiltersCount > 0 
                  ? 'Aucun produit ne correspond à vos critères de recherche.' 
                  : 'Aucun produit disponible pour le moment.' 
                }}
              </p>
            </div>
            
            <button
              v-if="activeFiltersCount > 0"
              @click="clearFilters"
              class="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="!isLoading && products.length > 0 && totalPages > 1" class="mt-12">
            <nav class="flex items-center justify-between border-t border-gray-200 pt-6">
              <div class="hidden md:block">
                <p class="text-sm text-gray-700">
                  Page {{ currentPage }} sur {{ totalPages }}
                </p>
              </div>
              
              <div class="flex-1 flex justify-center md:justify-end">
                <div class="flex items-center space-x-2">
                  <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage <= 1"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  
                  <!-- Page Numbers -->
                  <template v-for="page in visiblePages" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="goToPage(page)"
                      :class="[
                        'px-3 py-2 border text-sm rounded-lg',
                        currentPage === page
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-2 text-gray-500">...</span>
                  </template>
                  
                  <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  HeartIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/vue/24/outline'
import type { Product, Category } from '~/types'

// Meta
useHead({
  title: 'Produits - Morrgana',
  meta: [
    {
      name: 'description',
      content: 'Découvrez notre collection complète de produits de qualité. Filtrez par catégorie, prix et disponibilité.'
    }
  ]
})

// Stores
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// Reactive data
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const isLoading = ref(false)
const showMobileFilters = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

// Pagination
const currentPage = ref(1)
const perPage = 20
const totalItems = ref(0)
const totalPages = ref(1)

// Filters
const filters = reactive({
  search: '',
  categories: '',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  inStock: false,
  onSale: false,
  sort: '-created'
})

// Price ranges for quick filtering
const priceRanges = [
  { label: 'Moins de 25 MAD', min: 0, max: 25 },
  { label: '25 MAD - 50 MAD', min: 25, max: 50 },
  { label: '50 MAD - 100 MAD', min: 50, max: 100 },
  { label: '100 MAD - 200 MAD', min: 100, max: 200 },
  { label: 'Plus de 200 MAD', min: 200, max: null }
]

// Computed
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.search) count++
  if (filters.categories) count++
  if (filters.minPrice || filters.maxPrice) count++
  if (filters.inStock) count++
  if (filters.onSale) count++
  return count
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Methods
const fetchProducts = async (resetPage = true) => {
  if (resetPage) {
    currentPage.value = 1
  }
  
  isLoading.value = true
  
  try {
    const pb = usePocketBase()
    
    // Build filter string
    let filter = ''
    const filterParts = []
    
    if (filters.search) {
      filterParts.push(`(name ~ "${filters.search}" || shortDescription ~ "${filters.search}")`)
    }
    
    if (filters.categories) {
      filterParts.push(`category = "${filters.categories}"`)
    }
    
    if (filters.minPrice !== null && filters.minPrice > 0) {
      filterParts.push(`price >= ${filters.minPrice}`)
    }
    
    if (filters.maxPrice !== null && filters.maxPrice > 0) {
      filterParts.push(`price <= ${filters.maxPrice}`)
    }
    
    if (filters.inStock) {
      filterParts.push(`(stock > 0 || stock = null)`)
    }
    
    if (filters.onSale) {
      filterParts.push(`promoPrice != null`)
    }
    
    filter = filterParts.join(' && ')
    
    const result = await pb.collection('products').getList(currentPage.value, perPage, {
      filter: filter,
      expand: 'category,tags',
      sort: filters.sort
    })
    
    products.value = result.items
    totalItems.value = result.totalItems
    totalPages.value = result.totalPages
    
  } catch (error) {
    console.error('Error fetching products:', error)
    showNotification('Erreur lors du chargement des produits', 'error')
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const pb = usePocketBase()
    const result = await pb.collection('categories').getFullList({
      sort: 'name'
    })
    categories.value = result
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts(false)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.categories = ''
  filters.minPrice = null
  filters.maxPrice = null
  filters.inStock = false
  filters.onSale = false
  fetchProducts()
}

const selectPriceRange = (range: typeof priceRanges[0]) => {
  filters.minPrice = range.min
  filters.maxPrice = range.max
  fetchProducts()
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Catégorie inconnue'
}

const addToCart = async (product: Product) => {
  const success = await cartStore.addItem(product)
  if (success) {
    showNotification('Produit ajouté au panier', 'success')
  } else {
    showNotification(cartStore.error || 'Erreur lors de l\'ajout au panier', 'error')
  }
}

const toggleWishlist = async (productId: string) => {
  const success = await wishlistStore.toggleWishlist(productId)
  if (success) {
    const isInWishlist = wishlistStore.isInWishlist(productId)
    const message = isInWishlist ? 'Ajouté à la wishlist' : 'Retiré de la wishlist'
    showNotification(message, 'success')
  } else if (wishlistStore.error) {
    showNotification(wishlistStore.error, 'error')
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

// Debounced search
const debouncedSearch = useDebounceFn(fetchProducts, 300)

// Watch filters
watch(() => [filters.categories, filters.inStock, filters.onSale, filters.sort], () => {
  fetchProducts()
})

// Initialize
onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchCategories()
  ])
})

// Handle URL params for initial filters
onMounted(() => {
  const route = useRoute()
  if (route.query.category) {
    filters.categories = route.query.category as string
  }
  if (route.query.search) {
    filters.search = route.query.search as string
  }
  if (route.query.min_price) {
    filters.minPrice = Number(route.query.min_price)
  }
  if (route.query.max_price) {
    filters.maxPrice = Number(route.query.max_price)
  }
})

// Update URL when filters change
watch(filters, () => {
  const query: Record<string, string> = {}
  if (filters.search) query.search = filters.search
  if (filters.categories) query.category = filters.categories
  if (filters.minPrice) query.min_price = filters.minPrice.toString()
  if (filters.maxPrice) query.max_price = filters.maxPrice.toString()
  
  navigateTo({ 
    path: '/products',
    query: Object.keys(query).length > 0 ? query : undefined
  }, { replace: true })
}, { deep: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .lg\:hidden {
    display: none !important;
  }
}
</style>