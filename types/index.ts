// types/index.ts
export interface Product {
  id: string
  name: string
  slug: string
  image: string
  gallery: string[]
  shortDescription: string
  longDescription: string
  price: number
  promoPrice?: number | null
  stock?: number | null
  category: string
  tags: string[]
  isFeatured: boolean
  isHero: boolean
  created: string
  updated: string
  expand?: {
    category?: Category
    tags?: Tag[]
  }
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
  expand?: {
    parent?: Category
  }
}

export interface Tag {
  id: string
  name: string
  slug: string
  color: string
  created: string
  updated: string
}

export interface Order {
  id: string
  user: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  shippingAddress: string
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  trackingNumber?: string
  notes?: string
  created: string
  updated: string
  expand?: {
    user?: User
    shippingAddress?: ShippingAddress
  }
}

export interface OrderItem {
  id: string
  order: string
  product: string
  quantity: number
  amount: number
  created: string
  updated: string
  expand?: {
    order?: Order
    product?: Product
  }
}

export interface ShippingAddress {
  id: string
  user: string
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
  created: string
  updated: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  amount: number
}

export interface Wishlist {
  id: string
  user: string
  product: string
  created: string
  updated: string
  expand?: {
    product?: Product
  }
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created: string
  updated: string
}

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
  provider?: string
  providerId?: string
}