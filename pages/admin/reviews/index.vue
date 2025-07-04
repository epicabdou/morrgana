<!-- pages/admin/reviews/index.vue -->
<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage product reviews and ratings.
        </p>
      </div>
    </div>

    <!-- Reviews table -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="isLoading">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
                <tr v-else-if="reviews.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No reviews found
                  </td>
                </tr>
                <tr v-else v-for="review in reviews" :key="review.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ review.expand?.product?.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ review.expand?.user?.fullName || review.expand?.user?.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ review.expand?.user?.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex">
                        <StarIcon
                          v-for="i in 5"
                          :key="i"
                          :class="[
                            'h-4 w-4',
                            i <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          ]"
                          fill="currentColor"
                        />
                      </div>
                      <span class="ml-2 text-sm text-gray-600">{{ review.rating || 0 }}/5</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {{ review.comment }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(review.created) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="deleteReview(review.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/20/solid'

definePageMeta({
  layout: 'admin'
})

const reviews = ref([])
const isLoading = ref(false)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const fetchReviews = async () => {
  isLoading.value = true
  try {
    const pb = usePocketBase()
    const result = await pb.collection('reviews').getFullList({
      expand: 'user,product',
      sort: '-created'
    })
    reviews.value = result
  } catch (error) {
    console.error('Error fetching reviews:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteReview = async (id: string) => {
  if (confirm('Are you sure you want to delete this review?')) {
    try {
      const pb = usePocketBase()
      await pb.collection('reviews').delete(id)
      reviews.value = reviews.value.filter(r => r.id !== id)
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }
}

onMounted(() => {
  fetchReviews()
})
</script>