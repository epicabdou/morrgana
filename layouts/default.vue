<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <PublicHeader />
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
    
    <!-- Footer -->
    <PublicFooter />
    
    <!-- Cart Sidebar -->
    <CartSidebar />
    
    <!-- Notification System -->
    <NotificationSystem />
  </div>
</template>

<script setup lang="ts">
// Auto-import composables are available globally
const cartStore = useCartStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()

// Initialize stores on client side
onMounted(() => {
  // Initialize cart from localStorage
  cartStore.initializeCart()
  
  // Initialize wishlist watcher
  useWishlistWatcher()
})

// Watch for authentication changes and handle errors
watch(
  () => [cartStore.error, wishlistStore.error],
  ([cartError, wishlistError]) => {
    if (cartError) {
      setTimeout(() => cartStore.clearError(), 5000)
    }
    if (wishlistError) {
      setTimeout(() => wishlistStore.clearError(), 5000)
    }
  }
)

// Global error handler for unhandled promise rejections
if (process.client) {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // Show user-friendly error message
    if (window.showNotification) {
      window.showNotification('Une erreur inattendue s\'est produite', 'error')
    }
  })
}
</script>