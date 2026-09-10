import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { CartItem, Coupon, Product } from '@/types'
import { storageGet, storageSet } from '@/utils/storage'
import { findCoupon } from '@/data/coupons'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE, EXPRESS_SHIPPING_FEE } from '@/data/categories'
import { useToastStore } from './toast'

const CART_KEY = 'veste_cart'
const COUPON_KEY = 'veste_cart_coupon'
export const COUPON_ERRORS = {
  INVALID: 'This coupon code is not valid.',
  MIN_ORDER: 'This coupon requires a minimum subtotal.',
  EXPIRED: 'This coupon has expired.',
} as const

export const shippingFor = (subtotal: number, method: 'standard' | 'express' = 'standard'): number => {
  if (method === 'express') return EXPRESS_SHIPPING_FEE
  if (subtotal === 0) return 0
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  return SHIPPING_FLAT_RATE
}

export const useCartStore = defineStore('cart', () => {
  const toasts = useToastStore()

  const items = ref<CartItem[]>(storageGet(CART_KEY, []))
  const appliedCoupon = ref<Coupon | null>(storageGet(COUPON_KEY, null))
  const isOpen = ref(false)
  const lastAddedKey = ref<string | null>(null)

  function persist() {
    storageSet(CART_KEY, items.value)
    storageSet(COUPON_KEY, appliedCoupon.value)
  }

  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0),
  )

  const discountAmount = computed(() => {
    const coupon = appliedCoupon.value
    if (!coupon) return 0
    if (coupon.type === 'percent') return (subtotal.value * coupon.value) / 100
    if (coupon.type === 'fixed') return Math.min(coupon.value, subtotal.value)
    if (coupon.type === 'shipping') return Math.min(shippingFor(subtotal.value), subtotal.value)
    return 0
  })

  const grandTotal = computed(() => subtotal.value - discountAmount.value)

  const shipping = computed(() =>
    appliedCoupon.value?.type === 'shipping' ? 0 : shippingFor(subtotal.value),
  )

  const total = computed(() => grandTotal.value + shipping.value)

  const priceAfterDiscount = (sub: number): number => {
    const coupon = appliedCoupon.value
    if (!coupon) return sub
    if (coupon.type === 'percent') return sub - (sub * coupon.value) / 100
    if (coupon.type === 'fixed') return Math.max(0, sub - coupon.value)
    if (coupon.type === 'shipping') return sub
    return sub
  }

  function applyCoupon(code: string): { ok: boolean; message: string } {
    const coupon = findCoupon(code)
    if (!coupon) return { ok: false, message: COUPON_ERRORS.INVALID }
    if (coupon.minOrder && subtotal.value < coupon.minOrder) {
      const shortage = coupon.minOrder - subtotal.value
      return {
        ok: false,
        message: `This coupon needs a minimum order of $${coupon.minOrder}. Add $${shortage} more to qualify.`,
      }
    }
    if (new Date(coupon.expiresAt) < new Date()) return { ok: false, message: COUPON_ERRORS.EXPIRED }
    if (appliedCoupon.value?.code === coupon.code) {
      return { ok: false, message: 'This coupon is already applied.' }
    }
    appliedCoupon.value = coupon
    persist()
    toasts.coupon('Coupon applied', `"${coupon.code}" — ${coupon.description.toLowerCase()}.`)
    return { ok: true, message: '' }
  }

  function removeCoupon() {
    appliedCoupon.value = null
    persist()
    toasts.info('Coupon removed', 'No discount is applied anymore.')
  }

  function addItem(options: {
    product: Product
    size: string
    color: string
    quantity?: number
    silent?: boolean
  }): { key: string } {
    const qty = options.quantity ?? 1
    const key = `${options.product.id}-${options.color}-${options.size}`
    const existing = items.value.find((i) => i.key === key)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, options.product.stock)
    } else {
      items.value.push({
        key,
        productId: options.product.id,
        name: options.product.name,
        image: options.product.images[0],
        brand: options.product.brand,
        color: options.color,
        size: options.size,
        price: options.product.price,
        quantity: qty,
        stock: options.product.stock,
      })
    }
    lastAddedKey.value = key
    persist()
    if (!options.silent) {
      toasts.success('Added to bag', `${options.product.name} (${options.color} / ${options.size})`)
    }
    return { key }
  }

  function updateQuantity(key: string, quantity: number) {
    const item = items.value.find((i) => i.key === key)
    if (!item) return
    if (quantity <= 0) {
      removeItem(key)
      return
    }
    item.quantity = Math.min(quantity, item.stock)
    persist()
  }

  function removeItem(key: string) {
    const item = items.value.find((i) => i.key === key)
    items.value = items.value.filter((i) => i.key !== key)
    if (lastAddedKey.value === key) lastAddedKey.value = null
    persist()
    if (item) toasts.info('Removed from bag', `${item.name} was removed.`)
  }

  function clear() {
    items.value = []
    appliedCoupon.value = null
    persist()
  }

  const hasItem = (key: string) => items.value.some((i) => i.key === key)

  const recentlyAdded = computed<CartItem | null>(
    () => items.value.find((i) => i.key === lastAddedKey.value) ?? null,
  )

  return {
    items,
    appliedCoupon,
    isOpen,
    lastAddedKey,
    itemCount,
    subtotal,
    discountAmount,
    grandTotal,
    shipping,
    total,
    priceAfterDiscount,
    applyCoupon,
    removeCoupon,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    hasItem,
    recentlyAdded,
  }
})

export type CartStore = ReturnType<typeof useCartStore>

export const cartItemKey = (productId: number, color: string, size: string) =>
  `${productId}-${color}-${size}`