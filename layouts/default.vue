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

// Initialize cart from localStorage on client side
onMounted(() => {
  cartStore.initializeCart()
})
</script>