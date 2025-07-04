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
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="exportContacts"
          :disabled="messages.length === 0 || isLoading"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Contacts
        </button>
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

    <!-- Message Details Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isModalOpen && selectedMessage" 
          class="fixed inset-0 z-50 overflow-y-auto"
          @click="closeModal"
        >
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity"></div>
          
          <!-- Modal container -->
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition
              enter-active-class="duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                v-if="isModalOpen && selectedMessage"
                @click.stop
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <!-- Modal header -->
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    Contact Message Details
                  </h3>
                  <button
                    @click="closeModal"
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Modal content -->
                <div class="space-y-4">
                  <div>
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-medium text-gray-700">Name</label>
                      <button
                        @click="copyToClipboard(selectedMessage.name, 'Name')"
                        class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
                        title="Copy name"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedMessage.name }}</p>
                  </div>
                  
                  <div>
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-medium text-gray-700">Email</label>
                      <button
                        @click="copyToClipboard(selectedMessage.email, 'Email')"
                        class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
                        title="Copy email"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p class="mt-1 text-sm text-gray-900">
                      <a 
                        :href="`mailto:${selectedMessage.email}`" 
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        {{ selectedMessage.email }}
                      </a>
                    </p>
                  </div>
                  
                  <div v-if="selectedMessage.phone">
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-medium text-gray-700">Phone</label>
                      <button
                        @click="copyToClipboard(selectedMessage.phone, 'Phone')"
                        class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
                        title="Copy phone"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p class="mt-1 text-sm text-gray-900">
                      <a 
                        :href="`tel:${selectedMessage.phone}`" 
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        {{ selectedMessage.phone }}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-medium text-gray-700">Message</label>
                      <button
                        @click="copyToClipboard(selectedMessage.message, 'Message')"
                        class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
                        title="Copy message"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <div class="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">
                      {{ selectedMessage.message }}
                    </div>
                  </div>
                  
                  <div>
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-medium text-gray-700">Date Received</label>
                      <button
                        @click="copyToClipboard(formatDate(selectedMessage.created), 'Date')"
                        class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
                        title="Copy date"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedMessage.created) }}</p>
                  </div>
                </div>

                <!-- Modal footer -->
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    @click="deleteMessage(selectedMessage.id)"
                    type="button"
                    class="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Delete Message
                  </button>
                  <button
                    @click="closeModal"
                    type="button"
                    class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Copy Feedback Toast -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="showCopyFeedback"
          class="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg"
        >
          {{ copyFeedbackText }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

// Reactive state
const messages = ref([])
const isLoading = ref(false)
const selectedMessage = ref(null)
const isModalOpen = ref(false)
const showCopyFeedback = ref(false)
const copyFeedbackText = ref('')

// Copy to clipboard functionality
const copyToClipboard = async (text: string, fieldName: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copyFeedbackText.value = `${fieldName} copied!`
    showCopyFeedback.value = true
    
    // Hide feedback after 2 seconds
    setTimeout(() => {
      showCopyFeedback.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    copyFeedbackText.value = `${fieldName} copied!`
    showCopyFeedback.value = true
    setTimeout(() => {
      showCopyFeedback.value = false
    }, 2000)
  }
}

// Export contacts to CSV
const exportContacts = () => {
  if (messages.value.length === 0) {
    alert('No contacts to export')
    return
  }

  try {
    // Prepare CSV headers
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Date Received']
    
    // Prepare CSV rows
    const rows = messages.value.map(message => [
      message.name || '',
      message.email || '',
      message.phone || '',
      (message.message || '').replace(/"/g, '""'), // Escape quotes in message
      formatDate(message.created) || ''
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `contact-messages-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Error exporting contacts:', error)
    alert('Failed to export contacts. Please try again.')
  }
}
const formatDate = (date: string) => {
  if (!date) return 'N/A'
  
  try {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Fetch messages from PocketBase
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
    // You might want to show a toast notification here
  } finally {
    isLoading.value = false
  }
}

// Open modal with selected message
const viewMessage = (message: any) => {
  selectedMessage.value = message
  isModalOpen.value = true
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden'
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
  
  // Small delay to allow transition to complete before clearing selectedMessage
  setTimeout(() => {
    selectedMessage.value = null
  }, 200)
  
  // Restore body scrolling
  document.body.style.overflow = ''
}

// Delete message with confirmation
const deleteMessage = async (id: string) => {
  if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
    return
  }

  try {
    const pb = usePocketBase()
    await pb.collection('contact').delete(id)
    
    // Remove from local array
    messages.value = messages.value.filter(m => m.id !== id)
    
    // Close modal if the deleted message was being viewed
    if (selectedMessage.value?.id === id) {
      closeModal()
    }
    
    // You might want to show a success toast notification here
  } catch (error) {
    console.error('Error deleting message:', error)
    alert('Failed to delete message. Please try again.')
  }
}

// Handle escape key to close modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchMessages()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  // Ensure body overflow is restored on component unmount
  document.body.style.overflow = ''
})
</script>