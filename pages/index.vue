<!-- pages/index.vue -->
<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
      <div class="absolute inset-0 bg-black bg-opacity-20"></div>
      <div 
        v-if="heroProduct" 
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${getImageUrl(heroProduct, heroProduct.image)})` }"
      ></div>
      
      <div class="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Révélez la beauté de votre peau
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-gray-100">
          Découvrez nos gommages corporels naturels aux ingrédients soigneusement sélectionnés
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/products"
            class="bg-rose-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-rose-700 transition-colors"
          >
            Découvrir nos produits
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Notre histoire
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nos catégories</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez notre gamme complète de soins corporels naturels
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="category in featuredCategories"
            :key="category.id"
            class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div class="aspect-[4/3] bg-gray-200">
              <img
                :src="getImageUrl(category, category.image, '400x300')"
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 class="text-xl font-semibold mb-2">{{ category.name }}</h3>
              <p class="text-gray-200 text-sm mb-4">{{ category.description }}</p>
              <NuxtLink
                :to="`/categories/${category.slug}`"
                class="inline-flex items-center text-white hover:text-rose-300 transition-colors"
              >
                Découvrir
                <ArrowRightIcon class="w-4 h-4 ml-2" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Produits vedettes</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Nos best-sellers choisis avec amour pour votre bien-être
          </p>
        </div>
        
        <ProductGrid
          :products="featuredProducts"
          :is-loading="loadingFeatured"
          empty-message="Aucun produit vedette pour le moment."
        />
        
        <div class="text-center mt-12">
          <NuxtLink
            to="/products/bestsellers"
            class="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Voir tous les best-sellers
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- New Products -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nouveautés</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos dernières créations pour prendre soin de votre peau
          </p>
        </div>
        
        <ProductGrid
          :products="newProducts"
          :is-loading="loadingNew"
          empty-message="Aucune nouveauté pour le moment."
        />
        
        <div class="text-center mt-12">
          <NuxtLink
            to="/products/new"
            class="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Voir toutes les nouveautés
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-16 bg-rose-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          Restez informée de nos nouveautés
        </h2>
        <p class="text-xl text-rose-100 mb-8">
          Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre première commande
        </p>
        
        <form @submit.prevent="subscribeNewsletter" class="max-w-md mx-auto">
          <div class="flex">
            <input
              v-model="email"
              type="email"
              placeholder="Votre adresse e-mail"
              required
              class="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-rose-300"
            />
            <button
              type="submit"
              :disabled="isSubscribing"
              class="bg-white text-rose-600 px-6 py-3 rounded-r-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {{ isSubscribing ? 'Inscription...' : "S'inscrire" }}
            </button>
          </div>
          <p class="text-rose-100 text-sm mt-4">
            Nous respectons votre vie privée. Désabonnement possible à tout moment.
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

// SEO
useHead({
  title: 'Morrgana - Gommages Corporels Naturels',
  meta: [
    {
      name: 'description',
      content: 'Découvrez notre collection de gommages corporels naturels Morrgana. Produits de beauté authentiques pour révéler la beauté de votre peau.'
    }
  ]
})

// Data
const featuredProducts = ref([])
const newProducts = ref([])
const featuredCategories = ref([])
const heroProduct = ref(null)
const loadingFeatured = ref(true)
const loadingNew = ref(true)
const email = ref('')
const isSubscribing = ref(false)

// Fetch data
const fetchHomeData = async () => {
  try {
    const pb = usePocketBase()
    
    // Fetch hero product
    const heroResult = await pb.collection('products').getFirstListItem(
      'isHero = true',
      { expand: 'category,tags' }
    ).catch(() => null)
    
    if (heroResult) {
      heroProduct.value = heroResult
    }
    
    // Fetch featured products
    loadingFeatured.value = true
    const featuredResult = await pb.collection('products').getList(1, 8, {
      filter: 'isFeatured = true',
      expand: 'category,tags',
      sort: '-created'
    })
    featuredProducts.value = featuredResult.items
    loadingFeatured.value = false
    
    // Fetch new products
    loadingNew.value = true
    const newResult = await pb.collection('products').getList(1, 8, {
      expand: 'category,tags',
      sort: '-created'
    })
    newProducts.value = newResult.items
    loadingNew.value = false
    
    // Fetch featured categories
    const categoriesResult = await pb.collection('categories').getList(1, 6, {
      sort: 'name'
    })
    featuredCategories.value = categoriesResult.items
    
  } catch (error) {
    console.error('Error fetching home data:', error)
    loadingFeatured.value = false
    loadingNew.value = false
  }
}

const subscribeNewsletter = async () => {
  if (!email.value) return
  
  isSubscribing.value = true
  try {
    // TODO: Implement newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    console.log('Newsletter subscription successful')
    email.value = ''
  } catch (error) {
    console.error('Newsletter subscription error:', error)
  } finally {
    isSubscribing.value = false
  }
}

// Initialize
onMounted(() => {
  fetchHomeData()
})
</script>