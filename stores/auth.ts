// stores/auth.ts - FIXED VERSION
import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    isLoading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser?.isAdmin || false
  },

  actions: {
    setUser(user: User | null) {
      this.currentUser = user
    },

    clearUser() {
      this.currentUser = null
    },

    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const authData = await pb.collection('users').authWithPassword(email, password)
        this.setUser(authData.record)
        return authData
      } catch (error: any) {
        throw new Error(error.response?.message || 'Erreur de connexion')
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: {
      email: string
      password: string
      fullName: string
      newsletter?: boolean
    }) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        
        // Create user
        const user = await pb.collection('users').create({
          email: userData.email,
          password: userData.password,
          passwordConfirm: userData.password,
          fullName: userData.fullName,
          name: userData.fullName.split(' ')[0] // First name as username
        })
        
        // Request email verification
        await pb.collection('users').requestVerification(userData.email)
        
        // Auto login after registration
        const authData = await pb.collection('users').authWithPassword(
          userData.email, 
          userData.password
        )
        this.setUser(authData.record)
        
        return authData
      } catch (error: any) {
        throw new Error(error.response?.message || 'Erreur lors de la création du compte')
      } finally {
        this.isLoading = false
      }
    },

    async loginWithGoogle() {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const authData = await pb.collection('users').authWithOAuth2({
          provider: 'google',
          createData: {
            emailVisibility: true
          }
        })
        this.setUser(authData.record)
        return authData
      } catch (error: any) {
        throw new Error(error.response?.message || 'Erreur de connexion avec Google')
      } finally {
        this.isLoading = false
      }
    },

    async handleOAuthCallback(code: string, state: string | null) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        // This would be handled by PocketBase OAuth flow
        // Implementation depends on your OAuth setup
        const authData = await pb.collection('users').authWithOAuth2({
          provider: 'google',
          code,
          codeVerifier: state || ''
        })
        this.setUser(authData.record)
        return authData
      } catch (error: any) {
        throw new Error(error.response?.message || 'Erreur lors du callback OAuth')
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        const pb = usePocketBase()
        pb.authStore.clear()
        this.clearUser()
        
        // Clear cart and other user data
        const cartStore = useCartStore()
        cartStore.clear()

        navigateTo('/')
        
      } catch (error: any) {
        console.error('Logout error:', error)
      }
    },

    async refreshAuth() {
      try {
        const pb = usePocketBase()
        if (pb.authStore.isValid) {
          const authData = await pb.collection('users').authRefresh()
          this.setUser(authData.record)
        }
      } catch (error) {
        console.error('Auth refresh error:', error)
        this.clearUser()
      }
    },

    async updateProfile(data: Partial<User>) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        if (!this.currentUser) throw new Error('Utilisateur non connecté')
        
        const updatedUser = await pb.collection('users').update(
          this.currentUser.id,
          data
        )
        this.setUser(updatedUser)
        return updatedUser
      } catch (error: any) {
        throw new Error(error.response?.message || 'Erreur lors de la mise à jour du profil')
      } finally {
        this.isLoading = false
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        if (!this.currentUser) throw new Error('Utilisateur non connecté')
        
        await pb.collection('users').update(this.currentUser.id, {
          oldPassword: currentPassword,
          password: newPassword,
          passwordConfirm: newPassword
        })
        
        return true
      } catch (error: any) {
        throw new Error(error.response?.message || 'Erreur lors du changement de mot de passe')
      } finally {
        this.isLoading = false
      }
    },

    // FIXED: Correct method name
    initializeAuth() {
      const pb = usePocketBase()
      if (pb.authStore.isValid && pb.authStore.record) {
        this.setUser(pb.authStore.record as User)
      }
    }
  }
})