// stores/cart.ts
import { defineStore } from 'pinia'
import type { Product, CartItem } from '~/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: (state) => state.items.reduce((sum, item) => sum + item.amount, 0),
    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    initializeCart() {
      if (process.client) {
        try {
          const savedCart = localStorage.getItem('morrgana_cart')
          if (savedCart) {
            this.items = JSON.parse(savedCart)
            // Validate cart items and remove invalid ones
            this.validateCartItems()
          }
        } catch (error) {
          console.error('Error loading cart from storage:', error)
          this.items = []
          this.clearStorage()
        }
      }
    },

    validateCartItems() {
      // Remove items with invalid data
      this.items = this.items.filter(item => {
        return item.product && item.product.id && item.quantity > 0
      })
      this.saveToStorage()
    },

    async addItem(product: Product, quantity: number = 1) {
      if (!product || !product.id) {
        this.error = 'Produit invalide'
        return false
      }

      // Check stock availability
      if (product.stock !== null && product.stock < quantity) {
        this.error = 'Stock insuffisant'
        return false
      }

      this.error = null
      const existingItem = this.items.find(item => item.product.id === product.id)
      const price = product.promoPrice || product.price
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        
        // Check total quantity against stock
        if (product.stock !== null && product.stock < newQuantity) {
          this.error = 'Stock insuffisant pour cette quantité'
          return false
        }
        
        existingItem.quantity = newQuantity
        existingItem.amount = existingItem.quantity * price
      } else {
        this.items.push({
          id: generateId(),
          product,
          quantity,
          amount: quantity * price
        })
      }
      
      this.saveToStorage()
      this.isOpen = true
      return true
    },

    removeItem(itemId: string) {
      if (!itemId) return false
      
      this.items = this.items.filter(item => item.id !== itemId)
      this.saveToStorage()
      return true
    },

    updateQuantity(itemId: string, quantity: number) {
      if (!itemId || quantity < 0) return false
      
      const item = this.items.find(item => item.id === itemId)
      if (!item) return false
      
      if (quantity === 0) {
        return this.removeItem(itemId)
      }
      
      // Check stock availability
      if (item.product.stock !== null && item.product.stock < quantity) {
        this.error = 'Stock insuffisant'
        return false
      }
      
      const price = item.product.promoPrice || item.product.price
      item.quantity = quantity
      item.amount = quantity * price
      this.saveToStorage()
      return true
    },

    clear() {
      this.items = []
      this.error = null
      this.saveToStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    closeCart() {
      this.isOpen = false
    },

    openCart() {
      this.isOpen = true
    },

    saveToStorage() {
      if (process.client) {
        try {
          localStorage.setItem('morrgana_cart', JSON.stringify(this.items))
        } catch (error) {
          console.error('Error saving cart to storage:', error)
          // Handle storage quota exceeded or other storage errors
          if (error.name === 'QuotaExceededError') {
            this.error = 'Espace de stockage insuffisant'
          }
        }
      }
    },

    clearStorage() {
      if (process.client) {
        try {
          localStorage.removeItem('morrgana_cart')
        } catch (error) {
          console.error('Error clearing cart storage:', error)
        }
      }
    },

    clearError() {
      this.error = null
    }
  }
})

// Helper function
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}