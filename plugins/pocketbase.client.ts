import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  const pb = usePocketBase()
  const authStore = useAuthStore()
  
  // Check if user is already authenticated
  if (pb.authStore.isValid) {
    try {
      await pb.collection('users').authRefresh()
      authStore.setUser(pb.authStore.model)
    } catch (error) {
      pb.authStore.clear()
    }
  }
})