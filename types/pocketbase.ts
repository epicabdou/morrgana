// types/pocketbase.ts
import PocketBase from 'pocketbase'

export interface User {
  id: string
  email: string
  name: string
  fullName: string
  avatar?: string
  isAdmin: boolean
  verified: boolean
  emailVisibility: boolean
  created: string
  updated: string
  // OAuth fields
  provider?: string
  providerId?: string
}

export interface AuthResponse {
  record: User
  token: string
  meta?: {
    id?: string
    name?: string
    email?: string
    picture?: string
    given_name?: string
    family_name?: string
  }
}

export interface Collections {
  users: User
  // Add other collection types here as needed
  products: any
  categories: any
  orders: any
  reviews: any
  contact: any
  shippingAddresses: any
}

export type TypedPocketBase = PocketBase & {
  collection<T extends keyof Collections>(name: T): {
    authWithPassword(email: string, password: string): Promise<AuthResponse>
    authWithOAuth2(options: {
      provider: string
      createData?: Partial<User>
      scopes?: string[]
      query?: Record<string, any>
    }): Promise<AuthResponse>
    authRefresh(): Promise<AuthResponse>
    requestVerification(email: string): Promise<boolean>
    requestPasswordReset(email: string): Promise<boolean>
    getOne(id: string, options?: any): Promise<Collections[T]>
    getList(page?: number, perPage?: number, options?: any): Promise<{
      page: number
      perPage: number
      totalItems: number
      totalPages: number
      items: Collections[T][]
    }>
    getFullList(options?: any): Promise<Collections[T][]>
    create(data: Partial<Collections[T]>): Promise<Collections[T]>
    update(id: string, data: Partial<Collections[T]>): Promise<Collections[T]>
    delete(id: string): Promise<boolean>
  }
}