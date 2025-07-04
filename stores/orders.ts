import { defineStore } from 'pinia'
import type { Order, OrderItem } from '~/types'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    orderItems: [] as OrderItem[],
    isLoading: false,
    totalPages: 0,
    currentPage: 1
  }),

  actions: {
    async fetchOrders(page = 1, perPage = 20, filter = '') {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const result = await pb.collection('orders').getList(page, perPage, {
          filter: filter,
          expand: 'user',
          sort: '-created'
        })
        
        this.orders = result.items
        this.totalPages = result.totalPages
        this.currentPage = page
      } catch (error) {
        console.error('Error fetching orders:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchOrder(id: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const order = await pb.collection('orders').getOne(id, {
          expand: 'user'
        })
        this.currentOrder = order
        
        // Fetch order items
        const orderItems = await pb.collection('orderItems').getFullList({
          filter: `order="${id}"`,
          expand: 'product'
        })
        this.orderItems = orderItems
        
        return order
      } catch (error) {
        console.error('Error fetching order:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateOrderStatus(id: string, status: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const order = await pb.collection('orders').update(id, { status })
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index] = order
        }
        this.currentOrder = order
        return order
      } catch (error) {
        console.error('Error updating order status:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})