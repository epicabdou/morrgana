import { defineStore } from 'pinia'
import type { Product } from '~/types'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    currentProduct: null as Product | null,
    isLoading: false,
    totalPages: 0,
    currentPage: 1
  }),

  actions: {
    async fetchProducts(page = 1, perPage = 20, filter = '') {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const result = await pb.collection('products').getList(page, perPage, {
          filter: filter,
          expand: 'category,tags',
          sort: '-created'
        })
        
        this.products = result.items
        this.totalPages = result.totalPages
        this.currentPage = page
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchProduct(id: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const product = await pb.collection('products').getOne(id, {
          expand: 'category,tags'
        })
        this.currentProduct = product
        return product
      } catch (error) {
        console.error('Error fetching product:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createProduct(data: FormData) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const product = await pb.collection('products').create(data)
        this.products.unshift(product)
        return product
      } catch (error) {
        console.error('Error creating product:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateProduct(id: string, data: FormData) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const product = await pb.collection('products').update(id, data)
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = product
        }
        this.currentProduct = product
        return product
      } catch (error) {
        console.error('Error updating product:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteProduct(id: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        await pb.collection('products').delete(id)
        this.products = this.products.filter(p => p.id !== id)
      } catch (error) {
        console.error('Error deleting product:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})