// stores/cart.ts
import { defineStore } from 'pinia'
import type { Product, CartItem } from '~/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
    isLoading: false
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: (state) => state.items.reduce((sum, item) => sum + item.amount, 0),
    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    initializeCart() {
      if (process.client) {
        const savedCart = localStorage.getItem('morrgana_cart')
        if (savedCart) {
          this.items = JSON.parse(savedCart)
        }
      }
    },

    addItem(product: Product, quantity: number = 1) {
      const existingItem = this.items.find(item => item.product.id === product.id)
      const price = product.promoPrice || product.price
      
      if (existingItem) {
        existingItem.quantity += quantity
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
    },

    removeItem(itemId: string) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.saveToStorage()
    },

    updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId)
        } else {
          const price = item.product.promoPrice || item.product.price
          item.quantity = quantity
          item.amount = quantity * price
          this.saveToStorage()
        }
      }
    },

    clear() {
      this.items = []
      this.saveToStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    closeCart() {
      this.isOpen = false
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem('morrgana_cart', JSON.stringify(this.items))
      }
    }
  }
})