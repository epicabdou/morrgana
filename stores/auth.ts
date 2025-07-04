// stores/auth.ts - Fixed for new PocketBase OAuth format
import { defineStore } from 'pinia'
import type { User } from '~/types/pocketbase'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user && !!state.user.id,
    isAdmin: (state): boolean => !!state.user?.isAdmin,
    isVerified: (state): boolean => !!state.user?.verified,
    currentUser: (state): User | null => state.user
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
      this.error = null
    },

    clearUser() {
      this.user = null
      this.error = null
    },

    setError(error: string) {
      this.error = error
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    // Initialize auth state from PocketBase
    async initAuth() {
      const pb = usePocketBase()
      
      if (pb.authStore.isValid && pb.authStore.record) {
        try {
          // Verify the token is still valid
          await pb.collection('users').authRefresh()
          this.setUser(pb.authStore.record as User)
        } catch (error) {
          console.warn('Auth token expired, clearing auth state')
          pb.authStore.clear()
          this.clearUser()
        }
      }
    },

    // Email/Password login
    async loginWithPassword(email: string, password: string) {
      this.setLoading(true)
      this.setError('')
      
      try {
        const pb = usePocketBase()
        const authData = await pb.collection('users').authWithPassword(email, password)
        
        // Check if user has required permissions (admin for this app)
        if (!authData.record.isAdmin) {
          await this.logout()
          throw new Error('Access denied. Admin privileges required.')
        }
        
        this.setUser(authData.record)
        return authData
      } catch (error: any) {
        const errorMessage = error?.message || 'Login failed'
        this.setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        this.setLoading(false)
      }
    },

    // Fixed Google OAuth implementation
    async loginWithGoogle() {
      this.setLoading(true)
      this.setError('')
      
      try {
        const pb = usePocketBase()
        
        console.log('Starting Google OAuth...')
        
        // Step 1: Check if OAuth providers are available (updated format)
        let authMethods
        try {
          authMethods = await pb.collection('users').listAuthMethods()
          console.log('Auth methods response:', authMethods)
          
          // Check new format: authMethods.oauth2.providers
          const oauthProviders = authMethods.oauth2?.providers || []
          
          if (oauthProviders.length === 0) {
            throw new Error('No OAuth providers configured in PocketBase')
          }
          
          const googleProvider = oauthProviders.find(p => p.name === 'google')
          if (!googleProvider) {
            throw new Error('Google OAuth provider not found in PocketBase configuration')
          }
          
          console.log('Google provider found:', googleProvider)
        } catch (methodError) {
          console.error('Error checking auth methods:', methodError)
          throw new Error('Cannot access PocketBase auth methods. Check your PocketBase configuration.')
        }
        
        // Step 2: Attempt OAuth (simplified - PocketBase handles everything)
        console.log('Attempting OAuth...')
        let authData
        try {
          authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })
          console.log('OAuth successful:', authData)
        } catch (oauthError: any) {
          console.error('OAuth error details:', oauthError)
          
          // Handle specific OAuth errors
          if (oauthError.status === 400) {
            if (oauthError.data?.message?.includes('redirect_uri')) {
              throw new Error('OAuth redirect URI mismatch. Please check your Google OAuth settings.')
            } else if (oauthError.data?.data?.fullName) {
              throw new Error('Missing required field: fullName. Please make this field optional in PocketBase users collection.')
            } else {
              throw new Error(`OAuth configuration error: ${oauthError.data?.message || oauthError.message}`)
            }
          } else {
            throw new Error(`OAuth failed: ${oauthError.message}`)
          }
        }
        
        // Step 3: Validate auth data
        if (!authData || !authData.record) {
          throw new Error('OAuth succeeded but no user record returned')
        }
        
        console.log('User record:', authData.record)
        
        // Step 4: Update fullName if needed
        if (!authData.record.fullName) {
          // Try to extract name from email or set a default
          const displayName = authData.record.email.split('@')[0]
          
          try {
            console.log('Setting default fullName...')
            const updatedUser = await pb.collection('users').update(authData.record.id, {
              fullName: displayName
            })
            authData.record = updatedUser as User
            console.log('Updated user record:', updatedUser)
          } catch (updateError) {
            console.warn('Could not update fullName (non-critical):', updateError)
            // Set fullName locally if update fails
            authData.record.fullName = displayName
          }
        }
        
        // Step 5: Check admin privileges
        console.log('Checking admin privileges for user:', authData.record.email)
        if (!authData.record.isAdmin) {
          console.log('User is not admin, clearing auth and showing error...')
          // Don't call logout here as it will cause navigation issues
          pb.authStore.clear()
          throw new Error('Access denied. Admin privileges required. Please contact an administrator to grant admin access to your account.')
        }
        
        console.log('Login successful! User is admin.')
        this.setUser(authData.record)
        return authData
        
      } catch (error: any) {
        console.error('Google login error:', error)
        
        let errorMessage = error.message || 'Google login failed'
        
        // Don't modify error messages that are already specific
        if (!error.message?.includes('Admin privileges required') && 
            !error.message?.includes('OAuth') && 
            !error.message?.includes('redirect_uri')) {
          errorMessage = `Google login failed: ${errorMessage}`
        }
        
        this.setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        this.setLoading(false)
      }
    },

    // Logout
    async logout() {
      try {
        const pb = usePocketBase()
        pb.authStore.clear()
        this.clearUser()
        
        // Navigate to login page
        await navigateTo('/auth/login')
      } catch (error) {
        console.error('Logout error:', error)
        // Clear state anyway
        this.clearUser()
        await navigateTo('/auth/login')
      }
    },

    // Refresh authentication
    async refreshAuth() {
      try {
        const pb = usePocketBase()
        if (pb.authStore.isValid) {
          const authData = await pb.collection('users').authRefresh()
          this.setUser(authData.record)
          return authData
        }
      } catch (error) {
        console.warn('Auth refresh failed:', error)
        await this.logout()
      }
    },

    // Update user profile
    async updateProfile(data: Partial<User>) {
      if (!this.user) throw new Error('No user logged in')
      
      try {
        const pb = usePocketBase()
        const updatedUser = await pb.collection('users').update(this.user.id, data)
        this.setUser(updatedUser as User)
        return updatedUser
      } catch (error: any) {
        const errorMessage = error?.message || 'Profile update failed'
        this.setError(errorMessage)
        throw new Error(errorMessage)
      }
    },

    // Request password reset
    async requestPasswordReset(email: string) {
      try {
        const pb = usePocketBase()
        await pb.collection('users').requestPasswordReset(email)
        return true
      } catch (error: any) {
        const errorMessage = error?.message || 'Password reset request failed'
        this.setError(errorMessage)
        throw new Error(errorMessage)
      }
    }
  }
})