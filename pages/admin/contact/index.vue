<!-- pages/admin/contact/index.vue -->
<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Contact Messages</h1>
        <p class="mt-2 text-sm text-gray-700">
          View and manage customer contact form submissions.
        </p>
      </div>
    </div>

    <!-- Contact messages table -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
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
                <tr v-else-if="messages.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No messages found
                  </td>
                </tr>
                <tr v-else v-for="message in messages" :key="message.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ message.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a :href="`mailto:${message.email}`" class="text-indigo-600 hover:text-indigo-900">
                      {{ message.email }}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a :href="`tel:${message.phone}`" class="text-indigo-600 hover:text-indigo-900">
                      {{ message.phone }}
                    </a>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div class="truncate" :title="message.message">
                      {{ message.message }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(message.created) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="viewMessage(message)"
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      @click="deleteMessage(message.id)"
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

    <!-- Message modal -->
    <div v-if="selectedMessage" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="selectedMessage = null"></div>
        
        <div class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                Contact Message
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Name</label>
                  <p class="mt-1 text-sm text-gray-900">{{ selectedMessage.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <p class="mt-1 text-sm text-gray-900">
                    <a :href="`mailto:${selectedMessage.email}`" class="text-indigo-600 hover:text-indigo-900">
                      {{ selectedMessage.email }}
                    </a>
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <p class="mt-1 text-sm text-gray-900">
                    <a :href="`tel:${selectedMessage.phone}`" class="text-indigo-600 hover:text-indigo-900">
                      {{ selectedMessage.phone }}
                    </a>
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Message</label>
                  <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ selectedMessage.message }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Date</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedMessage.created) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="selectedMessage = null"
              type="button"
              class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const messages = ref([])
const isLoading = ref(false)
const selectedMessage = ref(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchMessages = async () => {
  isLoading.value = true
  try {
    const pb = usePocketBase()
    const result = await pb.collection('contact').getFullList({
      sort: '-created'
    })
    messages.value = result
  } catch (error) {
    console.error('Error fetching contact messages:', error)
  } finally {
    isLoading.value = false
  }
}

const viewMessage = (message) => {
  selectedMessage.value = message
}

const deleteMessage = async (id: string) => {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      const pb = usePocketBase()
      await pb.collection('contact').delete(id)
      messages.value = messages.value.filter(m => m.id !== id)
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message')
    }
  }
}

onMounted(() => {
  fetchMessages()
})
</script>