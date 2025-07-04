<!-- pages/admin/index.vue -->
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-600">
        Welcome back! Here's what's happening with your store.
      </p>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="stat.icon" class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
                <dd class="text-lg font-medium text-gray-900">
                  <span v-if="stat.loading" class="animate-pulse">Loading...</span>
                  <span v-else-if="stat.error" class="text-red-500">Error</span>
                  <span v-else>{{ stat.value }}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="globalError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ globalError }}</p>
          <button 
            @click="loadAllData" 
            class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Orders -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Recent Orders</h3>
              <NuxtLink
                to="/admin/orders"
                class="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all
              </NuxtLink>
            </div>
            
            <div v-if="ordersLoading" class="text-center py-8 text-gray-500">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="mt-2">Loading orders...</p>
            </div>
            
            <div v-else-if="ordersError" class="text-center py-8 text-red-500">
              <ExclamationTriangleIcon class="h-8 w-8 mx-auto mb-2" />
              <p>{{ ordersError }}</p>
              <button 
                @click="loadRecentOrders" 
                class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Retry
              </button>
            </div>
            
            <div v-else-if="recentOrders.length === 0" class="text-center py-8 text-gray-500">
              <ShoppingCartIcon class="h-8 w-8 mx-auto mb-2" />
              <p>No orders yet</p>
            </div>
            
            <div v-else>
              <ul class="divide-y divide-gray-200">
                <li v-for="order in recentOrders" :key="order.id" class="py-4">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-900">
                          Order #{{ order.id.slice(-8) }}
                        </p>
                        <span :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(order.status)
                        ]">
                          {{ order.status }}
                        </span>
                      </div>
                      <div class="mt-1 flex items-center text-sm text-gray-500">
                        <span>{{ order.expand?.user?.fullName || order.expand?.user?.email || 'Unknown Customer' }}</span>
                        <span class="mx-2">•</span>
                        <span>{{ formatCurrency(order.totalPrice) }}</span>
                        <span class="mx-2">•</span>
                        <span>{{ formatDate(order.created) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <NuxtLink
                        :to="`/admin/orders/${order.id}`"
                        class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View
                      </NuxtLink>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Info -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <NuxtLink
                to="/admin/products/create"
                class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Add Product
              </NuxtLink>
              <NuxtLink
                to="/admin/categories/create"
                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <TagIcon class="h-4 w-4 mr-2" />
                Add Category
              </NuxtLink>
              <NuxtLink
                to="/admin/users"
                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <UsersIcon class="h-4 w-4 mr-2" />
                Manage Users
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Database</span>
                <span class="flex items-center text-sm text-green-600">
                  <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Connected
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Last Updated</span>
                <span class="text-sm text-gray-900">{{ lastUpdated }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">User Role</span>
                <span class="text-sm font-medium text-indigo-600">{{ userRole }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ShoppingBagIcon,
  TagIcon,
  ShoppingCartIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

// Page metadata
definePageMeta({
  layout: 'admin'
})

// Composables
const pb = usePocketBase()
const authStore = useAuthStore()

// Reactive data
const stats = ref([
  { name: 'Total Products', value: '0', icon: ShoppingBagIcon, loading: true, error: false },
  { name: 'Categories', value: '0', icon: TagIcon, loading: true, error: false },
  { name: 'Total Orders', value: '0', icon: ShoppingCartIcon, loading: true, error: false },
  { name: 'Total Users', value: '0', icon: UsersIcon, loading: true, error: false },
])

const recentOrders = ref([])
const ordersLoading = ref(false)
const ordersError = ref('')
const globalError = ref('')

// Computed properties
const lastUpdated = computed(() => {
  return new Date().toLocaleTimeString('fr-FR')
})

const userRole = computed(() => {
  return authStore.currentUser?.isAdmin ? 'Administrator' : 'User'
})

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  const colors = {
    'en_attente': 'bg-yellow-100 text-yellow-800',
    'en attente': 'bg-yellow-100 text-yellow-800',
    'confirmé': 'bg-blue-100 text-blue-800',
    'en_cours': 'bg-blue-100 text-blue-800',
    'en cours': 'bg-blue-100 text-blue-800',
    'expédié': 'bg-purple-100 text-purple-800',
    'livré': 'bg-green-100 text-green-800',
    'annulé': 'bg-red-100 text-red-800'
  }
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

// Data loading functions
const loadStats = async () => {
  const collections = ['products', 'categories', 'orders', 'users']
  
  for (let i = 0; i < collections.length; i++) {
    try {
      stats.value[i].loading = true
      stats.value[i].error = false
      
      const result = await pb.collection(collections[i]).getList(1, 1)
      stats.value[i].value = result.totalItems.toString()
      
      // Add small delay between requests to avoid rate limiting
      if (i < collections.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error(`Error loading ${collections[i]} stats:`, error)
      stats.value[i].value = 'Error'
      stats.value[i].error = true
    } finally {
      stats.value[i].loading = false
    }
  }
}

const loadRecentOrders = async () => {
  ordersLoading.value = true
  ordersError.value = ''
  
  try {
    const result = await pb.collection('orders').getList(1, 5, {
      sort: '-created',
      expand: 'user'
    })
    
    recentOrders.value = result.items
  } catch (error: any) {
    console.error('Error loading recent orders:', error)
    ordersError.value = 'Failed to load recent orders'
    
    if (error.status === 429) {
      ordersError.value = 'Too many requests. Please wait a moment.'
    }
  } finally {
    ordersLoading.value = false
  }
}

const loadAllData = async () => {
  globalError.value = ''
  
  try {
    // Load stats and orders in parallel with a small delay
    await Promise.all([
      loadStats(),
      new Promise(resolve => setTimeout(resolve, 200)).then(() => loadRecentOrders())
    ])
  } catch (error: any) {
    console.error('Error loading dashboard data:', error)
    globalError.value = 'Failed to load dashboard data. Please check your connection.'
  }
}

// Lifecycle
onMounted(() => {
  // Start loading data with a small delay to ensure proper initialization
  setTimeout(loadAllData, 100)
})

// Auto-refresh data every 5 minutes
onMounted(() => {
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      loadAllData()
    }
  }, 5 * 60 * 1000) // 5 minutes
  
  // Cleanup interval on unmount
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>