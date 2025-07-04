<!-- pages/admin/orders/[id].vue -->
<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">
            Order #{{ order?.id.slice(-8) }}
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Order details and status management
          </p>
        </div>
        <div v-if="order">
          <select
            v-model="orderStatus"
            @change="updateStatus"
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="en attente">En attente</option>
            <option value="en cours">En cours</option>
            <option value="livré">Livré</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="ordersStore.isLoading" class="text-center py-8">
      Loading...
    </div>

    <div v-else-if="order" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Order Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Order Items -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Order Items</h3>
            <div class="flow-root">
              <ul role="list" class="-my-6 divide-y divide-gray-200">
                <li v-for="item in orderItems" :key="item.id" class="py-6 flex">
                  <div class="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                    <img
                      :src="getImageUrl(item.expand?.product, 'image')"
                      :alt="item.expand?.product?.name"
                      class="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div class="ml-4 flex-1 flex flex-col">
                    <div>
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3>{{ item.expand?.product?.name }}</h3>
                        <p class="ml-4">{{ formatCurrency(item.amount) }}</p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">
                        {{ item.expand?.product?.shortDescription }}
                      </p>
                    </div>
                    <div class="flex-1 flex items-end justify-between text-sm">
                      <p class="text-gray-500">Qty {{ item.quantity }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="space-y-6">
        <!-- Customer Info -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Customer</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ order.expand?.user?.fullName || order.expand?.user?.name }}
                </p>
                <p class="text-sm text-gray-500">{{ order.expand?.user?.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Summary</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Order Date</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ formatDate(order.created) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Status</span>
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  getStatusColor(order.status)
                ]">
                  {{ order.status }}
                </span>
              </div>
              <hr />
              <div class="flex justify-between">
                <span class="text-base font-medium text-gray-900">Total</span>
                <span class="text-base font-medium text-gray-900">
                  {{ formatCurrency(order.totalPrice) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-red-600">
      Order not found
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const ordersStore = useOrdersStore()

const order = computed(() => ordersStore.currentOrder)
const orderItems = computed(() => ordersStore.orderItems)
const orderStatus = ref('')

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

const getImageUrl = (record: any, filename: string) => {
  if (!record || !record[filename]) return '/placeholder-image.jpg'
  const pb = usePocketBase()
  return pb.files.getUrl(record, record[filename])
}

const updateStatus = async () => {
  try {
    await ordersStore.updateOrderStatus(route.params.id as string, orderStatus.value)
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Failed to update order status')
  }
}

onMounted(async () => {
  await ordersStore.fetchOrder(route.params.id as string)
  if (order.value) {
    orderStatus.value = order.value.status
  }
})

watch(order, (newOrder) => {
  if (newOrder) {
    orderStatus.value = newOrder.status
  }
}, { immediate: true })
</script>