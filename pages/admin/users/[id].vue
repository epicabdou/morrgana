<!-- pages/admin/users/[id].vue -->
<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/admin/users"
            class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Back to Users
          </NuxtLink>
        </div>
        <div v-if="user" class="flex space-x-3">
          <button
            v-if="!isEditing"
            @click="isEditing = true"
            class="btn btn-secondary"
          >
            <PencilIcon class="h-4 w-4 mr-2" />
            Edit User
          </button>
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            v-if="isEditing"
            @click="saveUser"
            :disabled="isSaving"
            class="btn btn-primary"
          >
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
      
      <div class="mt-4">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ user?.fullName || user?.name || 'User Details' }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          User account information and settings
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading user details...
      </div>
    </div>

    <div v-else-if="user" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main User Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Profile Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Profile Information</h3>
            
            <div v-if="!isEditing" class="space-y-4">
              <!-- Avatar -->
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div v-if="user.avatar" class="h-16 w-16 rounded-full overflow-hidden">
                    <img
                      class="h-16 w-16 object-cover"
                      :src="getImageUrl(user, 'avatar')"
                      :alt="user.fullName || user.name"
                    />
                  </div>
                  <div v-else class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <span class="text-lg font-medium text-gray-700">
                      {{ (user.fullName || user.name || user.email).charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900">
                    {{ user.fullName || user.name || 'N/A' }}
                  </h4>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>

              <!-- User Details -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Full Name</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user.fullName || 'Not provided' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Display Name</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user.name || 'Not provided' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email Visibility</label>
                  <p class="mt-1 text-sm text-gray-900">
                    {{ user.emailVisibility ? 'Public' : 'Private' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Edit Form -->
            <form v-else @submit.prevent="saveUser" class="space-y-4">
              <!-- Avatar Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div v-if="user.avatar" class="h-16 w-16 rounded-full overflow-hidden">
                      <img
                        class="h-16 w-16 object-cover"
                        :src="getImageUrl(user, 'avatar')"
                        :alt="user.fullName || user.name"
                      />
                    </div>
                    <div v-else class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-lg font-medium text-gray-700">
                        {{ (editForm.fullName || editForm.name || user.email).charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <input
                    ref="avatarInput"
                    type="file"
                    accept="image/*"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    id="fullName"
                    v-model="editForm.fullName"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Display Name</label>
                  <input
                    id="name"
                    v-model="editForm.name"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    v-model="editForm.email"
                    type="email"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div class="flex items-center">
                  <input
                    id="emailVisibility"
                    v-model="editForm.emailVisibility"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="emailVisibility" class="ml-2 block text-sm text-gray-900">
                    Make email public
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Account Status -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Account Status</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email Verification</label>
                  <p class="text-sm text-gray-500">User email verification status</p>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="editForm.verified"
                    type="checkbox"
                    :disabled="!isEditing"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-900">Verified</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Admin Privileges</label>
                  <p class="text-sm text-gray-500">Grant administrative access</p>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="editForm.isAdmin"
                    type="checkbox"
                    :disabled="!isEditing || user.id === authStore.user?.id"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-900">Administrator</span>
                </div>
              </div>
              
              <div v-if="user.id === authStore.user?.id" class="text-xs text-yellow-600">
                Note: You cannot remove your own admin privileges
              </div>
            </div>
          </div>
        </div>

        <!-- User Orders -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Orders</h3>
            
            <div v-if="userOrders.length === 0" class="text-center py-4 text-gray-500">
              No orders found for this user
            </div>
            
            <div v-else class="flow-root">
              <ul role="list" class="-my-5 divide-y divide-gray-200">
                <li v-for="order in userOrders" :key="order.id" class="py-4">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        Order #{{ order.id.slice(-8) }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ formatCurrency(order.totalPrice) }} • {{ formatDate(order.created) }}
                      </p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(order.status)
                      ]">
                        {{ order.status }}
                      </span>
                      <NuxtLink
                        :to="`/admin/orders/${order.id}`"
                        class="text-indigo-600 hover:text-indigo-900 text-sm"
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

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Stats -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">User Statistics</h3>
            
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Orders</span>
                <span class="text-sm font-medium text-gray-900">{{ userStats.totalOrders }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Spent</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(userStats.totalSpent) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Reviews Written</span>
                <span class="text-sm font-medium text-gray-900">{{ userStats.totalReviews }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Member Since</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ formatDate(user.created) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Last Updated</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ formatDate(user.updated) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Account Actions</h3>
            
            <div class="space-y-3">
              <button
                @click="sendVerificationEmail"
                :disabled="user.verified || isSendingEmail"
                class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSendingEmail">Sending...</span>
                <span v-else-if="user.verified">Email Verified</span>
                <span v-else>Send Verification Email</span>
              </button>
              
              <button
                @click="resetUserPassword"
                :disabled="isSendingEmail"
                class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Send Password Reset
              </button>
              
              <button
                v-if="user.id !== authStore.user?.id"
                @click="deleteUser"
                class="w-full flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete User Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-red-600">
      <ExclamationTriangleIcon class="h-12 w-12 mx-auto mb-4" />
      <h3 class="text-lg font-medium">User not found</h3>
      <p class="text-sm text-gray-500 mt-2">The user you're looking for doesn't exist or has been deleted.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  PencilIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const authStore = useAuthStore()

// State
const user = ref(null)
const userOrders = ref([])
const userStats = ref({
  totalOrders: 0,
  totalSpent: 0,
  totalReviews: 0
})
const isLoading = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const isSendingEmail = ref(false)

const avatarInput = ref<HTMLInputElement>()

// Edit form
const editForm = reactive({
  fullName: '',
  name: '',
  email: '',
  emailVisibility: false,
  verified: false,
  isAdmin: false
})

// Computed
const userId = computed(() => route.params.id as string)

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
  const pb = usePocketBase()
  return pb.files.getUrl(record, record[filename])
}

const fetchUser = async () => {
  isLoading.value = true
  try {
    const pb = usePocketBase()
    
    // Fetch user details
    const userData = await pb.collection('users').getOne(userId.value)
    user.value = userData
    
    // Initialize edit form
    editForm.fullName = userData.fullName || ''
    editForm.name = userData.name || ''
    editForm.email = userData.email || ''
    editForm.emailVisibility = userData.emailVisibility || false
    editForm.verified = userData.verified || false
    editForm.isAdmin = userData.isAdmin || false
    
    // Fetch user orders
    const orders = await pb.collection('orders').getList(1, 10, {
      filter: `user="${userId.value}"`,
      sort: '-created'
    })
    userOrders.value = orders.items
    
    // Calculate user statistics
    const allOrders = await pb.collection('orders').getFullList({
      filter: `user="${userId.value}"`
    })
    
    const reviews = await pb.collection('reviews').getFullList({
      filter: `user="${userId.value}"`
    })
    
    userStats.value = {
      totalOrders: allOrders.length,
      totalSpent: allOrders.reduce((sum, order) => sum + order.totalPrice, 0),
      totalReviews: reviews.length
    }
    
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    isLoading.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  // Reset form to original values
  if (user.value) {
    editForm.fullName = user.value.fullName || ''
    editForm.name = user.value.name || ''
    editForm.email = user.value.email || ''
    editForm.emailVisibility = user.value.emailVisibility || false
    editForm.verified = user.value.verified || false
    editForm.isAdmin = user.value.isAdmin || false
  }
}

const saveUser = async () => {
  isSaving.value = true
  try {
    const pb = usePocketBase()
    const formData = new FormData()
    
    // Add form fields
    Object.entries(editForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString())
      }
    })
    
    // Add avatar if selected
    if (avatarInput.value?.files?.[0]) {
      formData.append('avatar', avatarInput.value.files[0])
    }
    
    const updatedUser = await pb.collection('users').update(userId.value, formData)
    user.value = updatedUser
    isEditing.value = false
    
    // Show success message (you can implement a toast notification here)
    alert('User updated successfully!')
    
  } catch (error) {
    console.error('Error updating user:', error)
    alert('Failed to update user. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const sendVerificationEmail = async () => {
  isSendingEmail.value = true
  try {
    const pb = usePocketBase()
    await pb.collection('users').requestVerification(user.value.email)
    alert('Verification email sent successfully!')
  } catch (error) {
    console.error('Error sending verification email:', error)
    alert('Failed to send verification email.')
  } finally {
    isSendingEmail.value = false
  }
}

const resetUserPassword = async () => {
  isSendingEmail.value = true
  try {
    const pb = usePocketBase()
    await pb.collection('users').requestPasswordReset(user.value.email)
    alert('Password reset email sent successfully!')
  } catch (error) {
    console.error('Error sending password reset:', error)
    alert('Failed to send password reset email.')
  } finally {
    isSendingEmail.value = false
  }
}

const deleteUser = async () => {
  if (!confirm('Are you sure you want to delete this user account? This action cannot be undone.')) {
    return
  }
  
  try {
    const pb = usePocketBase()
    await pb.collection('users').delete(userId.value)
    alert('User deleted successfully!')
    await navigateTo('/admin/users')
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user. Please try again.')
  }
}

// Lifecycle
onMounted(() => {
  fetchUser()
})
</script>