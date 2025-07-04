// stores/wishlist.ts
import { defineStore } from 'pinia'
import type { Product, Wishlist } from '~/types'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as Wishlist[],
    isLoading: false
  }),

  getters: {
    isInWishlist: (state) => (productId: string) => 
      state.items.some(item => item.product === productId)
  },

  actions: {
    async fetchWishlist() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

      this.isLoading = true
      try {
        const pb = usePocketBase()
        const result = await pb.collection('wishlist').getFullList({
          filter: `user = "${authStore.currentUser?.id}"`,
          expand: 'product'
        })
        this.items = result
      } catch (error) {
        console.error('Error fetching wishlist:', error)
      } finally {
        this.isLoading = false
      }
    },

    async addToWishlist(productId: string) {
      const authStore = useAuthStore()
      console.debug('addToWishlist called with productId:', productId)

      if (!authStore.isAuthenticated) {
        console.debug('User not authenticated. Redirecting to login.')
        // Redirect to login
        navigateTo('/auth/login')
        return
      }

      try {
        console.debug('User is authenticated:', authStore.currentUser)
        const pb = usePocketBase()
        console.debug('PocketBase instance created:', pb)

        const wishlistEntry = {
          user: authStore.currentUser?.id,
          product: productId
        }
        console.debug('Creating wishlist entry:', wishlistEntry)

        const created = await pb.collection('wishlist').create(wishlistEntry)
        console.debug('Wishlist entry created:', created)

        await this.fetchWishlist()
        console.debug('Wishlist refreshed successfully.')
      } catch (error) {
        console.error('Error adding to wishlist:', error)
      }
    },

    async removeFromWishlist(productId: string) {
      try {
        const item = this.items.find(item => item.product === productId)
        if (item) {
          const pb = usePocketBase()
          await pb.collection('wishlist').delete(item.id)
          this.items = this.items.filter(i => i.id !== item.id)
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error)
      }
    }
  }
})

// Helper function
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}