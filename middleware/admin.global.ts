export default defineNuxtRouteMiddleware((to) => {
  // Only apply to /admin routes
  if (!to.path.startsWith('/admin')) {
    return
  }
  
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }
  
  // Check if user is admin
  if (!authStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin privileges required.'
    })
  }
})