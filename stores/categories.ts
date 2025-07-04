import { defineStore } from 'pinia'
import type { Category } from '~/types'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    currentCategory: null as Category | null,
    isLoading: false
  }),

  actions: {
    async fetchCategories() {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const result = await pb.collection('categories').getFullList({
          sort: 'name'
        })
        this.categories = result
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createCategory(data: FormData) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const category = await pb.collection('categories').create(data)
        this.categories.push(category)
        return category
      } catch (error) {
        console.error('Error creating category:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateCategory(id: string, data: FormData) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const category = await pb.collection('categories').update(id, data)
        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = category
        }
        return category
      } catch (error) {
        console.error('Error updating category:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteCategory(id: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        await pb.collection('categories').delete(id)
        this.categories = this.categories.filter(c => c.id !== id)
      } catch (error) {
        console.error('Error deleting category:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})