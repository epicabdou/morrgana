<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
    
    <div class="mt-8">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Stats cards -->
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
                    <span v-else>{{ stat.value }}</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ error }}</p>
          <button 
            @click="loadDashboardData" 
            class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Recent orders -->
    <div class="mt-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
          <div class="mt-5">
            <div v-if="ordersLoading" class="text-center py-4 text-gray-500">
              <div class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading orders...
              </div>
            </div>
            <div v-else-if="recentOrders.length === 0" class="text-center py-4 text-gray-500">
              No orders found
            </div>
            <div v-else class="flow-root">
              <ul role="list" class="-my-5 divide-y divide-gray-200">
                <li v-for="order in recentOrders" :key="order.id" class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        Order #{{ order.id.slice(-8) }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ formatCurrency(order.totalPrice) }} • {{ formatDate(order.created) }}
                      </p>
                    </div>
                    <div>
                      <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(order.status)
                      ]">
                        {{ order.status }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
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
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// This is correct - definePageMeta should only be in pages
definePageMeta({
  layout: 'admin'
})

const stats = ref([
  { name: 'Total Products', value: '0', icon: ShoppingBagIcon, loading: true },
  { name: 'Categories', value: '0', icon: TagIcon, loading: true },
  { name: 'Orders', value: '0', icon: ShoppingCartIcon, loading: true },
  { name: 'Users', value: '0', icon: UsersIcon, loading: true },
])

const recentOrders = ref([])
const error = ref('')
const ordersLoading = ref(false)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const getStatusColor = (status: string) => {
  const colors = {
    'en attente': 'bg-yellow-100 text-yellow-800',
    'en cours': 'bg-blue-100 text-blue-800',
    'livré': 'bg-green-100 text-green-800',
    'annulé': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const loadDashboardData = async () => {
  error.value = ''
  
  try {
    const { pb, withRetry } = usePocketBaseWithRetry()
    
    // Load stats with staggered requests to avoid rate limiting
    const statsPromises = [
      () => pb.collection('products').getList(1, 1),
      () => pb.collection('categories').getList(1, 1),
      () => pb.collection('orders').getList(1, 1),
      () => pb.collection('users').getList(1, 1),
    ]
    
    // Execute with delays to avoid rate limiting
    for (let i = 0; i < statsPromises.length; i++) {
      try {
        const result = await withRetry(statsPromises[i])
        stats.value[i].value = result.totalItems.toString()
        stats.value[i].loading = false
        
        // Add delay between requests
        if (i < statsPromises.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      } catch (err) {
        console.error(`Error loading stat ${i}:`, err)
        stats.value[i].value = 'Error'
        stats.value[i].loading = false
      }
    }
    
    // Load recent orders separately
    ordersLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300)) // Additional delay
      const orders = await withRetry(() => 
        pb.collection('orders').getList(1, 5, {
          sort: '-created',
          expand: 'user'
        })
      )
      recentOrders.value = orders.items
    } catch (err) {
      console.error('Error loading orders:', err)
      error.value = 'Failed to load recent orders. Please try again.'
    } finally {
      ordersLoading.value = false
    }
    
  } catch (err: any) {
    console.error('Error loading dashboard data:', err)
    if (err.status === 429) {
      error.value = 'Too many requests. Please wait a moment and try again.'
    } else {
      error.value = 'Failed to load dashboard data. Please check your connection and try again.'
    }
  }
}

onMounted(() => {
  // Add initial delay to avoid immediate rate limiting
  setTimeout(loadDashboardData, 500)
})
</script>