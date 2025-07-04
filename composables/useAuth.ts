// composables/useAuth.ts
export const useAuth = () => {
  const authStore = useAuthStore()
  
  const login = async (email: string, password: string) => {
    return await authStore.login(email, password)
  }
  
  const register = async (userData: {
    email: string
    password: string
    fullName: string
    newsletter?: boolean
  }) => {
    return await authStore.register(userData)
  }
  
  const logout = async () => {
    await authStore.logout()
    await navigateTo('/')
  }
  
  const loginWithGoogle = async () => {
    return await authStore.loginWithGoogle()
  }
  
  return {
    // State
    currentUser: computed(() => authStore.currentUser),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    isLoading: computed(() => authStore.isLoading),
    
    // Actions
    login,
    register,
    logout,
    loginWithGoogle,
    refreshAuth: authStore.refreshAuth,
    updateProfile: authStore.updateProfile,
    changePassword: authStore.changePassword
  }
}