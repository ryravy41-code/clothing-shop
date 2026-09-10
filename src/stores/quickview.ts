import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/types'
import { useProductStore } from './product'

export const useQuickViewStore = defineStore('quickview', () => {
  const productStore = useProductStore()
  const productId = ref<number | null>(null)
  const open = computed(() => productId.value !== null)
  const product = computed<Product | null>(
    () => (productId.value !== null ? productStore.getProduct(productId.value) : null) ?? null,
  )

  function openFor(id: number) {
    productId.value = id
  }

  function close() {
    productId.value = null
  }

  return { productId, open, product, openFor, close }
})