import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    currentUser: null as User | null,
    isLoading: false,
    totalPages: 0,
    currentPage: 1
  }),

  actions: {
    async fetchUsers(page = 1, perPage = 20, filter = '') {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const result = await pb.collection('users').getList(page, perPage, {
          filter: filter,
          sort: '-created'
        })
        
        this.users = result.items
        this.totalPages = result.totalPages
        this.currentPage = page
      } catch (error) {
        console.error('Error fetching users:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchUser(id: string) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const user = await pb.collection('users').getOne(id)
        this.currentUser = user
        return user
      } catch (error) {
        console.error('Error fetching user:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateUser(id: string, data: any) {
      this.isLoading = true
      try {
        const pb = usePocketBase()
        const user = await pb.collection('users').update(id, data)
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = user
        }
        this.currentUser = user
        return user
      } catch (error) {
        console.error('Error updating user:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})