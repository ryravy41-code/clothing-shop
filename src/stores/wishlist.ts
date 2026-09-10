import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { WishlistItem } from '@/types'
import { storageGet, storageSet } from '@/utils/storage'
import { useProductStore } from './product'
import { useCartStore } from './cart'
import { useToastStore } from './toast'

const WISHLIST_KEY = 'veste_wishlist'

export const useWishlistStore = defineStore('wishlist', () => {
  const toasts = useToastStore()
  const productStore = useProductStore()
  const cartStore = useCartStore()

  const items = ref<WishlistItem[]>(storageGet(WISHLIST_KEY, []))

  function persist() {
    storageSet(WISHLIST_KEY, items.value)
  }

  const has = (productId: number) => items.value.some((i) => i.productId === productId)

  function toggle(productId: number): boolean {
    const idx = items.value.findIndex((i) => i.productId === productId)
    if (idx >= 0) {
      items.value.splice(idx, 1)
      persist()
      toasts.info('Removed from wishlist', 'Kept for later items were updated.')
      return false
    }
    items.value.push({ productId, addedAt: new Date().toISOString() })
    persist()
    const product = productStore.getProduct(productId)
    toasts.success('Saved to wishlist', product ? product.name : 'Stored for later.')
    return true
  }

  function remove(productId: number) {
    items.value = items.value.filter((i) => i.productId !== productId)
    persist()
  }

  function moveToCart(productId: number): boolean {
    const product = productStore.getProduct(productId)
    if (!product) return false
    const size = product.sizes.find((s) => s !== 'One Size') ?? product.sizes[0]
    const color = product.colors[0]
    cartStore.addItem({ product, size, color, silent: true })
    remove(productId)
    toasts.success('Moved to bag', `${product.name} was added to your bag.`)
    return true
  }

  const count = computed(() => items.value.length)

  const products = computed(() =>
    items.value
      .map((i) => productStore.getProduct(i.productId))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
  )

  return { items, has, toggle, remove, moveToCart, count, products }
})