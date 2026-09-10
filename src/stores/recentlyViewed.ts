import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { storageGet, storageSet } from '@/utils/storage'
import { useProductStore } from './product'

const RECENT_KEY = 'veste_recently_viewed'
const MAX_ITEMS = 12

export const useRecentlyViewedStore = defineStore('recentlyViewed', () => {
  const productStore = useProductStore()
  const ids = ref<number[]>(storageGet(RECENT_KEY, []))

  const init = () => {
    ids.value = storageGet<number[]>(RECENT_KEY, []).filter((id) =>
      productStore.products.some((p) => p.id === id),
    )
  }

  const add = (productId: number) => {
    ids.value = [productId, ...ids.value.filter((id) => id !== productId)].slice(0, MAX_ITEMS)
    storageSet(RECENT_KEY, ids.value)
  }

  const clear = () => {
    ids.value = []
    storageSet(RECENT_KEY, ids.value)
  }

  const products = computed(() =>
    ids.value
      .map((id) => productStore.getProduct(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
  )

  return { ids, add, clear, products, init }
})