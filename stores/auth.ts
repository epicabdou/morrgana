import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isLoading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.isAdmin || false
  },

  actions: {
    setUser(user: any) {
      this.user = user
    },

    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const authData = await pb.collection('users').authWithPassword(email, password)
        
        if (!authData.record.isAdmin) {
          await this.logout()
          throw new Error('Access denied. Admin privileges required.')
        }
        
        this.setUser(authData.record)
        return authData
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loginWithGoogle() {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        
        // Initialize Google OAuth with proper configuration
        const authData = await pb.collection('users').authWithOAuth2({
          provider: 'google',
          createData: {
            emailVisibility: true,
            verified: true, // Auto-verify OAuth users
          },
          // Add scopes if needed
          scopes: ['email', 'profile']
        })
        
        // Check if user has admin privileges
        if (!authData.record.isAdmin) {
          await this.logout()
          throw new Error('Access denied. Admin privileges required. Please contact administrator.')
        }
        
        this.setUser(authData.record)
        return authData
      } catch (error) {
        console.error('Google login error:', error)
        // Provide more specific error messages
        if (error.status === 400) {
          throw new Error('OAuth configuration error. Please check your Google OAuth settings in PocketBase.')
        }
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      const pb = usePocketBase()
      pb.authStore.clear()
      this.user = null
      await navigateTo('/login')
    }
  }
})