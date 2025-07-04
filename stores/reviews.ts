import { defineStore } from 'pinia'
import type { Review } from '~/types'

export const useReviewsStore = defineStore('reviews', {
  state: () => ({
    reviews: [] as Review[],
    currentReview: null as Review | null,
    isLoading: false,
    totalPages: 0,
    currentPage: 1
  }),

  actions: {
    async fetchReviews(page = 1, perPage = 20, filter = '') {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const result = await pb.collection('reviews').getList(page, perPage, {
          filter: filter,
          expand: 'user,product',
          sort: '-created'
        })
        
        this.reviews = result.items
        this.totalPages = result.totalPages
        this.currentPage = page
      } catch (error) {
        console.error('Error fetching reviews:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteReview(id: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        await pb.collection('reviews').delete(id)
        this.reviews = this.reviews.filter(r => r.id !== id)
      } catch (error) {
        console.error('Error deleting review:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})