// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo(`/auth/unauth?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})