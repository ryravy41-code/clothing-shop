export type CategoryId =
  | 'men'
  | 'women'
  | 'kids'
  | 'shoes'
  | 'accessories'
  | 'new-arrivals'
  | 'sale'

export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type ProductSize = string
export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'popular'

export interface Product {
  id: number
  name: string
  description: string
  details: string[]
  price: number
  originalPrice?: number
  category: Exclude<CategoryId, 'new-arrivals' | 'sale'>
  brand: string
  images: string[]
  colors: string[]
  sizes: ProductSize[]
  rating: number
  reviewCount: number
  stock: number
  isNew: boolean
  isBestSeller: boolean
  discount?: number
  material?: string
  tags: string[]
  soldCount: number
  createdAt: string
}

export interface Review {
  id: number
  productId: number
  author: string
  rating: number
  title: string
  text: string
  date: string
  verifiedPurchase: boolean
}

export interface CartItem {
  key: string
  productId: number
  name: string
  image: string
  brand: string
  color: string
  size: string
  price: number
  quantity: number
  stock: number
}

export type WishlistItem = {
  productId: number
  addedAt: string
}

export type DeliveryMethod = 'standard' | 'express'
export type PaymentMethodType = 'card' | 'cod' | 'wallet'

export interface ShippingAddress {
  id: string
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  birthDate?: string
  gender?: string
  avatar?: string
  addresses: ShippingAddress[]
  createdAt: string
}

export type OrderStatus =
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  productId: number
  name: string
  image: string
  price: number
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  paymentMethod: string
  shippingAddress: ShippingAddress
  createdAt: string
  tracking: Record<OrderStatus, string>
}

export type CouponType = 'percent' | 'fixed' | 'shipping'

export interface Coupon {
  code: string
  type: CouponType
  value: number
  minOrder?: number
  description: string
  expiresAt: string
}

export interface ProductFilter {
  category: CategoryId | 'all'
  brands: string[]
  sizes: string[]
  colors: string[]
  priceMin: number | null
  priceMax: number | null
  rating: number | null
  discountOnly: boolean
  search: string
  sort: SortOption
  inStockOnly: boolean
}

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info' | 'coupon'
  title: string
  message?: string
}

export interface CardDetails {
  number: string
  name: string
  expMonth: string
  expYear: string
  cvc: string
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
}