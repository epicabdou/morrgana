// stores/wishlist.ts
import { defineStore } from 'pinia'
import type { Product, Wishlist } from '~/types'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as Wishlist[],
    isLoading: false,
    error: null as string | null,
    initialized: false
  }),

  getters: {
    isInWishlist: (state) => (productId: string) => 
      state.items.some(item => item.product === productId),
    
    wishlistCount: (state) => state.items.length
  },

  actions: {
    async initializeWishlist() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated || this.initialized) return
      
      await this.fetchWishlist()
      this.initialized = true
    },

    async fetchWishlist() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        this.items = []
        return
      }

      this.isLoading = true
      this.error = null
      
      try {
        const pb = usePocketBase()
        const result = await pb.collection('wishlist').getFullList({
          filter: `user = "${authStore.currentUser?.id}"`,
          expand: 'product',
          sort: '-created'
        })
        this.items = result
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        this.error = 'Erreur lors du chargement de la wishlist'
        this.items = []
      } finally {
        this.isLoading = false
      }
    },

    async addToWishlist(productId: string) {
      const authStore = useAuthStore()
      
      if (!productId) {
        this.error = 'Produit invalide'
        return false
      }

      if (!authStore.isAuthenticated) {
        // Store the intended action for after login
        if (process.client) {
          localStorage.setItem('pendingWishlistAction', JSON.stringify({
            action: 'add',
            productId,
            timestamp: Date.now()
          }))
        }
        navigateTo('/auth/login')
        return false
      }

      // Check if already in wishlist
      if (this.isInWishlist(productId)) {
        this.error = 'Produit déjà dans la wishlist'
        return false
      }

      this.error = null
      
      try {
        const pb = usePocketBase()
        const wishlistEntry = {
          user: authStore.currentUser?.id,
          product: productId
        }

        const created = await pb.collection('wishlist').create(wishlistEntry)
        
        // Add to local state immediately for better UX
        this.items.unshift(created)
        
        return true
      } catch (error) {
        console.error('Error adding to wishlist:', error)
        this.error = 'Erreur lors de l\'ajout à la wishlist'
        return false
      }
    },

    async removeFromWishlist(productId: string) {
      if (!productId) {
        this.error = 'Produit invalide'
        return false
      }

      const item = this.items.find(item => item.product === productId)
      if (!item) {
        this.error = 'Produit non trouvé dans la wishlist'
        return false
      }

      this.error = null
      
      try {
        const pb = usePocketBase()
        await pb.collection('wishlist').delete(item.id)
        
        // Remove from local state immediately for better UX
        this.items = this.items.filter(i => i.id !== item.id)
        
        return true
      } catch (error) {
        console.error('Error removing from wishlist:', error)
        this.error = 'Erreur lors de la suppression de la wishlist'
        return false
      }
    },

    async toggleWishlist(productId: string) {
      if (this.isInWishlist(productId)) {
        return await this.removeFromWishlist(productId)
      } else {
        return await this.addToWishlist(productId)
      }
    },

    async processPendingAction() {
      if (!process.client) return
      
      try {
        const pendingAction = localStorage.getItem('pendingWishlistAction')
        if (pendingAction) {
          const action = JSON.parse(pendingAction)
          
          // Check if action is not too old (24 hours)
          if (Date.now() - action.timestamp < 24 * 60 * 60 * 1000) {
            if (action.action === 'add') {
              await this.addToWishlist(action.productId)
            }
          }
          
          localStorage.removeItem('pendingWishlistAction')
        }
      } catch (error) {
        console.error('Error processing pending wishlist action:', error)
      }
    },

    clearWishlist() {
      this.items = []
      this.error = null
      this.initialized = false
    },

    clearError() {
      this.error = null
    }
  }
})

// Watch for authentication changes
export const useWishlistWatcher = () => {
  const wishlistStore = useWishlistStore()
  const authStore = useAuthStore()

  watch(
    () => authStore.isAuthenticated,
    async (isAuthenticated) => {
      if (isAuthenticated) {
        await wishlistStore.initializeWishlist()
        await wishlistStore.processPendingAction()
      } else {
        wishlistStore.clearWishlist()
      }
    },
    { immediate: true }
  )
}