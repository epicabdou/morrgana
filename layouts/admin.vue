<!-- layouts/admin.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <AdminHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const sidebarOpen = ref(false)
</script>