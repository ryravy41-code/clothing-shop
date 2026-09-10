import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { CategoryId, ProductFilter, SortOption } from '@/types'
import { storageGet, storageSet } from '@/utils/storage'

const STORAGE_KEY = 'veste_filters'

const DEFAULT_FILTERS: ProductFilter = {
  category: 'all',
  brands: [],
  sizes: [],
  colors: [],
  priceMin: null,
  priceMax: null,
  rating: null,
  discountOnly: false,
  search: '',
  sort: 'featured',
  inStockOnly: false,
}

export const useFilterStore = defineStore('filter', () => {
  const filters = reactive<ProductFilter>(storageGet(STORAGE_KEY, DEFAULT_FILTERS, 'session'))

  function commit() {
    storageSet(STORAGE_KEY, JSON.parse(JSON.stringify(filters)), 'session')
  }

  function setCategory(category: CategoryId | 'all') {
    filters.category = category
    commit()
  }

  function setSort(sort: SortOption) {
    filters.sort = sort
    commit()
  }

  function setSearch(search: string) {
    filters.search = search
    commit()
  }

  function toggleBrand(brand: string) {
    const idx = filters.brands.indexOf(brand)
    if (idx >= 0) filters.brands.splice(idx, 1)
    else filters.brands.push(brand)
    commit()
  }

  function toggleSize(size: string) {
    const idx = filters.sizes.indexOf(size)
    if (idx >= 0) filters.sizes.splice(idx, 1)
    else filters.sizes.push(size)
    commit()
  }

  function toggleColor(color: string) {
    const idx = filters.colors.indexOf(color)
    if (idx >= 0) filters.colors.splice(idx, 1)
    else filters.colors.push(color)
    commit()
  }

  function setPriceRange(min: number | null, max: number | null) {
    filters.priceMin = min
    filters.priceMax = max
    commit()
  }

  function setMinRating(rating: number | null) {
    filters.rating = rating
    commit()
  }

  function toggleDiscountOnly() {
    filters.discountOnly = !filters.discountOnly
    commit()
  }

  function toggleInStock() {
    filters.inStockOnly = !filters.inStockOnly
    commit()
  }

  function reset() {
    Object.assign(filters, DEFAULT_FILTERS)
    commit()
  }

  const activeCount = computed(() => {
    let count = 0
    if (filters.category !== 'all') count++
    count += filters.brands.length
    count += filters.sizes.length
    count += filters.colors.length
    if (filters.priceMin !== null) count++
    if (filters.priceMax !== null) count++
    if (filters.rating !== null) count++
    if (filters.discountOnly) count++
    if (filters.inStockOnly) count++
    if (filters.sort !== 'featured') count++
    return count
  })

  return {
    filters,
    activeCount,
    setCategory,
    setSort,
    setSearch,
    toggleBrand,
    toggleSize,
    toggleColor,
    setPriceRange,
    setMinRating,
    toggleDiscountOnly,
    toggleInStock,
    reset,
  }
})