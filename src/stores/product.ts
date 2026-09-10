import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Pagination, Product, SortOption } from '@/types'
import { ApiError, mockApi, paginate } from '@/services/api'
import { PRODUCTS } from '@/data/products'
import { reviewsForProduct } from '@/data/reviews'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  async function fetchProducts() {
    if (initialized.value && products.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      const data = await mockApi<Product[]>(() => [...PRODUCTS])
      products.value = data
      initialized.value = true
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Failed to load products.'
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: number): Promise<Product> {
    return mockApi<Product | undefined>(
      () => PRODUCTS.find((p) => p.id === id),
      { failStatus: 404, failMessage: 'Product not found.' },
    ).then((product) => {
      if (!product) throw new ApiError('Product not found.', 404)
      return product
    })
  }

  const byId = computed(() => new Map(products.value.map((p) => [p.id, p])))

  function getProduct(id: number): Product | undefined {
    return byId.value.get(id)
  }

  const latest = computed(() => [...products.value].sort((a, b) => b.id - a.id))

  const featured = computed(() =>
    products.value.filter((p) => p.isBestSeller || p.rating >= 4.7).slice(0, 8),
  )

  const newArrivals = computed(() =>
    [...products.value].filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  )

  const bestSellers = computed(() =>
    [...products.value].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8),
  )

  const seasonalSale = computed(() => products.value.filter((p) => p.discount))

  function categoryProducts(category: string): Product[] {
    if (category === 'new-arrivals') return newArrivals.value
    if (category === 'sale') return seasonalSale.value
    return products.value.filter((p) => p.category === category)
  }

  function applyFilters(list: Product[], input: { category?: string; sort?: SortOption } = {}) {
    return mockApi<Product[]>(() => {
      let result = [...list]
      if (input.category && input.category !== 'all' && input.category !== 'sale')
        result = result.filter((p) => p.category === input.category)
      if (input.sort) result = sortProducts(result, input.sort)
      return result
    })
  }

  const searchMatches = (query: string): Product[] => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.value
      .map((p) => {
        const haystack = `${p.name} ${p.brand} ${p.category} ${p.tags.join(' ')}`.toLowerCase()
        let score = haystack.includes(q) ? 10 : 0
        if (p.name.toLowerCase().includes(q)) score += 40
        if (p.brand.toLowerCase().includes(q)) score += 20
        score -= Math.min(30, p.name.length / 3)
        return { p, score }
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p)
  }

  const suggestions = (query: string, limit = 6): Product[] => searchMatches(query).slice(0, limit)

  const reviewSummaries = (productId: number) => reviewsForProduct(productId)

  function related(id: number): Product[] {
    const current = getProduct(id)
    if (!current) return []
    return products.value
      .filter((p) => p.id !== id && p.category === current.category)
      .slice(0, 4)
  }

  function similar(id: number): Product[] {
    const current = getProduct(id)
    if (!current) return []
    return products.value
      .filter(
        (p) =>
          p.id !== id &&
          p.category !== current.category &&
          p.tags.some((t) => current.tags.includes(t)),
      )
      .slice(0, 4)
  }

  function completeTheLook(id: number): Product[] {
    const current = getProduct(id)
    if (!current) return []
    const wants: Record<string, string> = {}
    if (current.category === 'men' || current.category === 'women') wants.accessory = 'accessories'
    const pool = products.value.filter((p) => p.id !== id)
    const accessories = wants.accessory
      ? pool.filter((p) => p.category === wants.accessory).slice(0, 2)
      : pool.filter((p) => p.category === 'shoes').slice(0, 2)
    const base = pool.filter((p) => p.id !== id && p.category !== current.category).slice(0, 2)
    return [...accessories, ...base].slice(0, 4)
  }

  async function browse(
    input: {
      category?: string
      search?: string
      sort?: SortOption
      page?: number
      pageSize?: number
    } = {},
  ): Promise<{ items: Product[]; pagination: Pagination }> {
    const page = input.page ?? 1
    const pageSize = input.pageSize ?? 12
    let list = input.category ? categoryProducts(input.category) : [...products.value]
    if (input.search) list = searchMatches(input.search)
    if (input.sort) list = sortProducts(list, input.sort)
    const paginated = paginate(list, page, pageSize)
    return {
      items: paginated.items,
      pagination: {
        page: paginated.page,
        pageSize: paginated.pageSize,
        total: paginated.total,
      },
    }
  }

  function sortProducts(list: Product[], sort: SortOption): Product[] {
    switch (sort) {
      case 'newest':
        return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating)
      case 'popular':
        return [...list].sort((a, b) => b.soldCount - a.soldCount)
      case 'featured':
      default:
        return [...list].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller))
    }
  }

  return {
    products,
    loading,
    error,
    initialized,
    fetchProducts,
    fetchProduct,
    getProduct,
    byId,
    latest,
    featured,
    newArrivals,
    bestSellers,
    seasonalSale,
    categoryProducts,
    applyFilters,
    searchMatches,
    suggestions,
    reviewSummaries,
    related,
    similar,
    completeTheLook,
    browse,
    sortProducts,
  }
})