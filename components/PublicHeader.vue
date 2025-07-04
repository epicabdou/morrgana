<!-- components/PublicHeader.vue -->
<template>
  <header class="bg-white shadow-sm">
    <!-- Top Bar -->
    <div class="bg-rose-50 border-b border-rose-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-10 text-sm">
          <div class="text-rose-600">
            ✨ Livraison gratuite à partir de 500 MAD
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/contact" class="text-gray-600 hover:text-rose-600">
              Contact
            </NuxtLink>
            <NuxtLink to="/faq" class="text-gray-600 hover:text-rose-600">
              FAQ
            </NuxtLink>
            <div class="flex items-center space-x-2">
              <span class="text-gray-600">MAD</span>
              <span class="text-gray-400">|</span>
              <span class="text-gray-600">FR</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <img src="/logo.svg" alt="Morrgana" class="h-8 w-auto" />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/products" class="text-gray-900 hover:text-rose-600 font-medium">
            Produits
          </NuxtLink>
          <div class="relative group">
            <button class="text-gray-900 hover:text-rose-600 font-medium flex items-center">
              Catégories
              <ChevronDownIcon class="w-4 h-4 ml-1" />
            </button>
            <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="py-2">
                <NuxtLink
                  v-for="category in categories"
                  :key="category.id"
                  :to="`/categories/${category.slug}`"
                  class="block px-4 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                >
                  {{ category.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
          <NuxtLink to="/products/new" class="text-gray-900 hover:text-rose-600 font-medium">
            Nouveautés
          </NuxtLink>
          <NuxtLink to="/products/deals" class="text-gray-900 hover:text-rose-600 font-medium">
            Promotions
          </NuxtLink>
          <NuxtLink to="/about" class="text-gray-900 hover:text-rose-600 font-medium">
            À propos
          </NuxtLink>
        </div>

        <!-- Search -->
        <div class="hidden md:flex flex-1 max-w-xs mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Rechercher..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
            />
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- User Menu -->
          <div class="relative" v-if="authStore.isAuthenticated">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center text-gray-700 hover:text-rose-600"
            >
              <UserIcon class="w-6 h-6" />
            </button>
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <div class="py-2">
                <NuxtLink to="/account" class="block px-4 py-2 text-gray-700 hover:bg-rose-50">
                  Mon compte
                </NuxtLink>
                <NuxtLink to="/account/orders" class="block px-4 py-2 text-gray-700 hover:bg-rose-50">
                  Mes commandes
                </NuxtLink>
                <NuxtLink to="/account/watchlist" class="block px-4 py-2 text-gray-700 hover:bg-rose-50">
                  Ma wishlist
                </NuxtLink>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
          <NuxtLink v-else to="/auth/login" class="text-gray-700 hover:text-rose-600">
            <UserIcon class="w-6 h-6" />
          </NuxtLink>

          <!-- Wishlist -->
          <NuxtLink to="/account/watchlist" class="relative text-gray-700 hover:text-rose-600">
            <HeartIcon class="w-6 h-6" />
            <span
              v-if="wishlistStore.items.length > 0"
              class="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ wishlistStore.items.length }}
            </span>
          </NuxtLink>

          <!-- Cart -->
          <button
            @click="cartStore.toggleCart()"
            class="relative text-gray-700 hover:text-rose-600"
          >
            <ShoppingBagIcon class="w-6 h-6" />
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden text-gray-700 hover:text-rose-600"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <div class="space-y-4">
          <!-- Mobile Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Rechercher..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
            />
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <!-- Mobile Navigation -->
          <div class="space-y-2">
            <NuxtLink to="/products" class="block text-gray-900 hover:text-rose-600 font-medium">
              Produits
            </NuxtLink>
            <NuxtLink to="/categories" class="block text-gray-900 hover:text-rose-600 font-medium">
              Catégories
            </NuxtLink>
            <NuxtLink to="/products/new" class="block text-gray-900 hover:text-rose-600 font-medium">
              Nouveautés
            </NuxtLink>
            <NuxtLink to="/products/deals" class="block text-gray-900 hover:text-rose-600 font-medium">
              Promotions
            </NuxtLink>
            <NuxtLink to="/about" class="block text-gray-900 hover:text-rose-600 font-medium">
              À propos
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  UserIcon,
  HeartIcon,
  ShoppingBagIcon,
  Bars3Icon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const searchQuery = ref('')
const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const categories = ref([])

// Fetch categories for dropdown
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

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search/${encodeURIComponent(searchQuery.value.trim())}`)
    showMobileMenu.value = false
  }
}

const logout = async () => {
  await authStore.logout()
  showUserMenu.value = false
}

// Close dropdowns when clicking outside
onMounted(() => {
  fetchCategories()
  
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>