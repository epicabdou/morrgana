// composables/usePocketBase.ts
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '~/types/pocketbase'

let pb: TypedPocketBase

export const usePocketBase = (): TypedPocketBase => {
  if (!pb) {
    const config = useRuntimeConfig()
    pb = new PocketBase(config.public.pocketbaseUrl) as TypedPocketBase
    
    // Configure auth store to persist in localStorage
    pb.authStore.onChange((token, record) => {
      // This automatically syncs auth state changes across tabs
      if (process.client) {
        const authStore = useAuthStore()
        if (record) {
          authStore.setUser(record)
        } else {
          authStore.clearUser()
        }
      }
    })
  }
  
  return pb
}