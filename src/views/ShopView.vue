<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { useProductStore } from '@/stores/product'
import { useFilterStore } from '@/stores/filter'
import { BRANDS, DEFAULT_SIZES, CATEGORIES } from '@/data/categories'
import type { CategoryId, SortOption } from '@/types'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const filterStore = useFilterStore()

const ui = reactive({
  showFilters: false,
  layout: ('grid' as 'grid' | 'list'),
})

const categoryFromRoute = computed<CategoryId | 'all'>(() => {
  const raw = route.params.category
  if (typeof raw === 'string' && raw !== 'shop') {
    return (CATEGORIES.some((c) => c.id === raw) ? raw : 'all') as CategoryId | 'all'
  }
  const q = route.query.category
  if (typeof q === 'string' && (q === 'all' || CATEGORIES.some((c) => c.id === q))) return q as CategoryId | 'all'
  return 'all'
})

const sortFromRoute = computed<SortOption>(() => {
  const q = route.query.sort
  const valid = ['featured', 'newest', 'price-asc', 'price-desc', 'rating', 'popular']
  return typeof q === 'string' && valid.includes(q) ? (q as SortOption) : 'featured'
})

const discountFromRoute = computed(() => route.query.discount === 'true')

function hydrate() {
  filterStore.setCategory(categoryFromRoute.value)
  filterStore.setSort(sortFromRoute.value)
  if (discountFromRoute.value !== filterStore.filters.discountOnly) {
    filterStore.toggleDiscountOnly()
  }
}

hydrate()

watch(
  [categoryFromRoute, sortFromRoute, discountFromRoute],
  () => {
    hydrate()
    replaceQuery()
  },
)

function replaceQuery() {
  const query: Record<string, string> = {}
  if (categoryFromRoute.value !== 'all') query.category = categoryFromRoute.value
  if (filterStore.filters.sort !== 'featured') query.sort = filterStore.filters.sort
  if (filterStore.filters.discountOnly) query.discount = 'true'
  if (filterStore.filters.search) query.q = filterStore.filters.search
  void router.replace({ query })
}

const title = computed(() => {
  const category = CATEGORIES.find((c) => c.id === categoryFromRoute.value)
  if (category) return category.label
  return 'All Products'
})

const filtered = computed(() => {
  const f = filterStore.filters
  let list = productStore.products

  if (f.category !== 'all' && f.category !== 'sale') {
    list = list.filter((p) => p.category === f.category)
  }
  if (f.category === 'sale') list = list.filter((p) => p.discount)

  if (f.brands.length) list = list.filter((p) => f.brands.includes(p.brand))
  if (f.sizes.length) list = list.filter((p) => p.sizes.some((s) => f.sizes.includes(s)))
  if (f.priceMin !== null) list = list.filter((p) => p.price >= (f.priceMin ?? 0))
  if (f.priceMax !== null) list = list.filter((p) => p.price <= (f.priceMax ?? Infinity))
  if (f.rating !== null) list = list.filter((p) => p.rating >= (f.rating ?? 0))
  if (f.discountOnly) list = list.filter((p) => p.discount && p.discount > 0)
  if (f.inStockOnly) list = list.filter((p) => p.stock > 0)
  if (f.search) {
    const q = f.search.toLowerCase()
    list = list.filter((p) =>
      `${p.name} ${p.brand} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(q),
    )
  }

  return productStore.sortProducts(list, f.sort)
})

const inRange = (val: number | null, fallback: number) => val ?? fallback

function clearAll() {
  filterStore.reset()
  filterStore.setCategory(categoryFromRoute.value)
}

const priceBounds = computed(() => {
  const prices = productStore.products.map((p) => p.price)
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
})

const selectedCategory = computed(() => filterStore.filters.category)

function selectCategory(id: CategoryId | 'all') {
  filterStore.setCategory(id)
  ui.showFilters = false
  if (id === 'all') void router.push({ path: '/shop', query: { sort: filterStore.filters.sort } })
  else void router.push({ path: `/category/${id}`, query: { sort: filterStore.filters.sort } })
}
</script>

<template>
  <div class="wrap py-8 sm:py-10">
    <Breadcrumbs
      :crumbs="[{ label: title }]"
      class="mb-6"
    />

    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl text-charcoal sm:text-4xl">{{ title }}</h1>
        <p class="mt-1 text-sm text-charcoal/50">
          {{ filtered.length }} product{{ filtered.length === 1 ? '' : 's' }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <div class="flex overflow-hidden rounded-full border border-charcoal/15 bg-white">
          <button
            type="button"
            :class="[
              'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition',
              ui.layout === 'grid' ? 'bg-charcoal text-bone' : 'text-charcoal/60 hover:text-charcoal',
            ]"
            :aria-pressed="ui.layout === 'grid'"
            @click="ui.layout = 'grid'"
          >
            <AppIcon name="grid" :size="15" />
            Grid
          </button>
          <button
            type="button"
            :class="[
              'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition',
              ui.layout === 'list' ? 'bg-charcoal text-bone' : 'text-charcoal/60 hover:text-charcoal',
            ]"
            :aria-pressed="ui.layout === 'list'"
            @click="ui.layout = 'list'"
          >
            <AppIcon name="list" :size="15" />
            List
          </button>
        </div>

        <div class="relative">
          <select
            :value="filterStore.filters.sort"
            class="h-10 appearance-none rounded-full border border-charcoal/15 bg-white pl-4 pr-9 text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Sort products"
            @change="filterStore.setSort(($event.target as HTMLSelectElement).value as SortOption)"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
          <span class="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-charcoal/45">
            <AppIcon name="chev-down" :size="15" />
          </span>
        </div>

        <button
          type="button"
          class="flex h-10 items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-4 text-sm font-medium text-charcoal transition hover:border-charcoal/40"
          @click="ui.showFilters = !ui.showFilters"
        >
          <AppIcon name="filter" :size="15" />
          Filters
          <span
            v-if="filterStore.activeCount > 0"
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold text-white"
          >
            {{ filterStore.activeCount }}
          </span>
        </button>
      </div>
    </div>

    <div class="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
      <!-- FILTER SIDEBAR -->
      <aside
        :class="[
          'lg:col-span-0',
          ui.showFilters ? 'block' : 'hidden lg:block',
        ]"
      >
        <div class="sticky top-28 space-y-6 rounded-3xl border border-charcoal/8 bg-white p-6">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal/70">Refine</p>
            <button
              type="button"
              class="text-xs font-semibold text-clay transition hover:opacity-70"
              @click="clearAll"
            >
              Clear all
            </button>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/50">Category</p>
            <div class="mt-3 flex flex-col gap-1.5">
              <button
                v-for="category in [{ id: 'all' as const, label: 'All' }, ...CATEGORIES]"
                :key="category.id"
                type="button"
                class="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition hover:bg-bone"
                :class="selectedCategory === category.id ? 'font-semibold text-charcoal' : 'text-charcoal/65'"
                @click="selectCategory(category.id)"
              >
                {{ category.label }}
                <span
                  v-if="selectedCategory === category.id"
                  class="flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-bone"
                >
                  <AppIcon name="check" :size="11" />
                </span>
              </button>
            </div>
          </div>

          <div class="border-t border-charcoal/8 pt-5">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/50">Brand</p>
            <div class="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1">
              <BaseCheckbox
                v-for="brand in BRANDS"
                :key="brand"
                :model-value="filterStore.filters.brands.includes(brand)"
                :label="brand"
                :name="`brand-${brand}`"
                @update:model-value="filterStore.toggleBrand(brand)"
              />
            </div>
          </div>

          <div class="border-t border-charcoal/8 pt-5">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/50">Size</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="size in [...DEFAULT_SIZES, 'One Size', '28', '30', '38', '40', '42']"
                :key="size"
                type="button"
                :class="[
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  filterStore.filters.sizes.includes(size)
                    ? 'border-charcoal bg-charcoal text-bone'
                    : 'border-charcoal/20 text-charcoal/65 hover:border-charcoal/50',
                ]"
                @click="filterStore.toggleSize(size)"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="border-t border-charcoal/8 pt-5">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/50">Price</p>
            <div class="mt-3 flex items-center gap-2">
              <input
                type="number"
                :value="inRange(filterStore.filters.priceMin, priceBounds.min)"
                class="h-10 w-full rounded-xl border border-charcoal/15 px-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label="Minimum price"
                :min="priceBounds.min"
                :max="inRange(filterStore.filters.priceMax ?? 0, priceBounds.max)"
                @change="
                  filterStore.setPriceRange(
                    Math.max(priceBounds.min, Number(($event.target as HTMLInputElement).value)),
                    filterStore.filters.priceMax,
                  )
                "
              />
              <span class="text-charcoal/40">—</span>
              <input
                type="number"
                :value="inRange(filterStore.filters.priceMax, priceBounds.max)"
                class="h-10 w-full rounded-xl border border-charcoal/15 px-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label="Maximum price"
                :min="inRange(filterStore.filters.priceMin ?? 0, priceBounds.min)"
                :max="priceBounds.max"
                @change="
                  filterStore.setPriceRange(
                    filterStore.filters.priceMin,
                    Math.min(priceBounds.max, Number(($event.target as HTMLInputElement).value)),
                  )
                "
              />
            </div>
            <div class="mt-3 flex items-center justify-between text-xs font-medium text-charcoal/50">
              <span>${{ priceBounds.min }}</span>
              <span>${{ priceBounds.max }}</span>
            </div>
          </div>

          <div class="border-t border-charcoal/8 pt-5">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/50">Rating</p>
            <div class="mt-3 flex flex-col gap-2">
              <BaseCheckbox
                v-for="r in [4.5, 4, 3]"
                :key="r"
                :model-value="filterStore.filters.rating === r"
                :label="`${r}★ and above`"
                :name="`rating-${r}`"
                @update:model-value="filterStore.setMinRating(filterStore.filters.rating === r ? null : r)"
              />
            </div>
          </div>

          <div class="space-y-3 border-t border-charcoal/8 pt-5">
            <BaseCheckbox
              :model-value="filterStore.filters.discountOnly"
              label="On sale only"
              name="sale"
              @update:model-value="filterStore.toggleDiscountOnly()"
            />
            <BaseCheckbox
              :model-value="filterStore.filters.inStockOnly"
              label="In stock only"
              name="stock"
              @update:model-value="filterStore.toggleInStock()"
            />
          </div>
        </div>
      </aside>

      <!-- RESULTS -->
      <div class="min-w-0 lg:col-span-1">
        <div v-if="productStore.loading" class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          <BaseSkeleton v-for="i in 6" :key="i" class="aspect-[3/4] w-full rounded-2xl" />
        </div>

        <ErrorState
          v-else-if="productStore.error"
          :message="productStore.error"
          class="lg:col-span-2"
          @retry="productStore.fetchProducts()"
        />

        <div v-else-if="filtered.length === 0" class="lg:col-span-2">
          <EmptyState
            icon="search"
            title="No products match your filters"
            description="Try widening your price range or clearing a few filters to see more pieces."
            action-label="Clear filters"
            @action="clearAll"
          />
        </div>

        <div
          v-else
          :class="[
            'grid gap-4 sm:gap-6',
            ui.layout === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
          ]"
        >
          <ProductCard
            v-for="p in filtered"
            :key="p.id"
            :product="p"
            :layout="ui.layout"
            :class="ui.layout === 'list' ? 'lg:!flex-row' : ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>