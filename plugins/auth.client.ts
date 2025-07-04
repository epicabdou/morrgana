// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth state from PocketBase
  authStore.initializeAuth()
  
  // Set up auth store listener for PocketBase changes
  const pb = usePocketBase()
  pb.authStore.onChange((token, record) => {
    if (record) {
      authStore.setUser(record as any)
    } else {
      authStore.clearUser()
    }
  })
})