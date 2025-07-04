export interface User {
  id: string
  email: string
  name: string
  fullName: string
  avatar?: string
  isAdmin: boolean
  verified: boolean
  created: string
  updated: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parent?: string
  created: string
  updated: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created: string
  updated: string
}

export interface Product {
  id: string
  name: string
  slug: string
  image: string
  gallery: string[]
  shortDescription: string
  longDescription: string
  price: number
  promoPrice?: number
  stock?: number
  category: string
  tags: string[]
  isFeatured: boolean
  isHero: boolean
  created: string
  updated: string
}

export interface Order {
  id: string
  user: string
  totalPrice: number
  status: 'en attente' | 'annulé' | 'livré' | 'en cours'
  created: string
  updated: string
}

export interface OrderItem {
  id: string
  order: string
  product: string
  quantity: number
  amount: number
  created: string
  updated: string
}

export interface Review {
  id: string
  user: string
  product: string
  rating: number
  comment: string
  created: string
  updated: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  message: string
  created: string
  updated: string
}

export interface ShippingAddress {
  id: string
  name: string
  user: string
  address: string
  city: string
  postCode: number
  phone: string
  isDefault: boolean
  created: string
  updated: string
}

export interface OAuthProvider {
  name: string
  displayName: string
  state: string
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: string
  authUrl: string
}

export interface AuthMethods {
  usernamePassword: boolean
  emailPassword: boolean
  authProviders: OAuthProvider[]
}

// Update User interface to include OAuth fields
export interface User {
  id: string
  email: string
  name: string
  fullName: string
  avatar?: string
  isAdmin: boolean
  verified: boolean
  created: string
  updated: string
  // OAuth related fields
  provider?: string
  providerId?: string
}