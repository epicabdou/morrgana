// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth state from PocketBase on app start
  await authStore.initAuth()
  
  // Set up periodic auth refresh (every 15 minutes)
  if (process.client) {
    setInterval(() => {
      if (authStore.isAuthenticated) {
        authStore.refreshAuth()
      }
    }, 15 * 60 * 1000) // 15 minutes
  }
})