// middleware/guest.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    return navigateTo('/account')
  }
})
