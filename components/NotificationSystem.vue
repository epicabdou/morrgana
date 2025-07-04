<!-- components/NotificationSystem.vue -->
<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'px-4 py-3 rounded-lg shadow-lg max-w-sm',
          'flex items-center space-x-3',
          notificationClasses[notification.type]
        ]"
      >
        <div class="flex-shrink-0">
          <CheckCircleIcon 
            v-if="notification.type === 'success'" 
            class="w-5 h-5" 
          />
          <ExclamationCircleIcon 
            v-else-if="notification.type === 'error'" 
            class="w-5 h-5" 
          />
          <InformationCircleIcon 
            v-else-if="notification.type === 'info'" 
            class="w-5 h-5" 
          />
          <ExclamationTriangleIcon 
            v-else-if="notification.type === 'warning'" 
            class="w-5 h-5" 
          />
        </div>
        
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium">
            {{ notification.message }}
          </p>
          <p v-if="notification.description" class="text-xs mt-1 opacity-90">
            {{ notification.description }}
          </p>
        </div>
        
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  description?: string
  duration?: number
}

const notifications = ref<Notification[]>([])

const notificationClasses = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200'
}

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  const newNotification: Notification = {
    id,
    duration: 5000,
    ...notification
  }
  
  notifications.value.push(newNotification)
  
  // Auto-remove after duration
  if (newNotification.duration && newNotification.duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Global notification function
const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', description?: string) => {
  addNotification({ type, message, description })
}

// Make it globally available
if (process.client) {
  window.showNotification = showNotification
}

// Provide to components
provide('showNotification', showNotification)
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>