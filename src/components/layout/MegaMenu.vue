<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/product'
import type { CategoryId } from '@/types'

const productStore = useProductStore()

const MENU: { id: CategoryId; label: string }[] = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kids', label: 'Kids' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
]

const megaItems = (category: string) =>
  productStore.products.filter((p) => p.category === category).slice(0, 3)
</script>

<template>
  <nav class="hidden lg:block" aria-label="Primary">
    <ul class="flex items-center gap-1">
      <li
        v-for="item in MENU"
        :key="item.id"
        class="group relative"
      >
        <RouterLink
          :to="`/category/${item.id}`"
          class="flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-medium tracking-wide text-charcoal/85 transition hover:bg-charcoal/5 hover:text-charcoal"
        >
          {{ item.label }}
          <span class="text-charcoal/35 transition-transform duration-200 group-hover:rotate-180">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </RouterLink>

        <div
          class="invisible absolute left-1/2 z-40 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
        >
          <div class="w-[560px] overflow-hidden rounded-3xl border border-charcoal/8 bg-white p-6 shadow-2xl shadow-charcoal/10">
            <div class="grid grid-cols-[1fr_1.2fr] gap-6">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {{ item.label }}
                </p>
                <RouterLink
                  :to="`/category/${item.id}`"
                  class="mt-0.5 block font-display text-lg text-charcoal transition hover:text-gold"
                >
                  Shop all {{ item.label }}
                </RouterLink>
                <ul class="mt-3 space-y-1">
                  <li>
                    <RouterLink
                      :to="`/category/${item.id}`"
                      class="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-charcoal/70 transition hover:bg-bone hover:text-charcoal"
                    >
                      New arrivals
                      <span v-if="productStore.newArrivals.some((p) => p.category === item.id)" class="text-[10px] font-semibold uppercase tracking-wider text-gold">New</span>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink
                      :to="`/shop?category=${item.id}&sort=price-asc`"
                      class="rounded-lg px-3 py-2 text-sm text-charcoal/70 transition hover:bg-bone hover:text-charcoal"
                    >
                      Under $100
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink
                      :to="`/shop?category=${item.id}&sort=rating`"
                      class="rounded-lg px-3 py-2 text-sm text-charcoal/70 transition hover:bg-bone hover:text-charcoal"
                    >
                      Top rated
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink
                      :to="`/shop?category=${item.id}&discount=true`"
                      class="rounded-lg px-3 py-2 text-sm text-charcoal/70 transition hover:bg-bone hover:text-charcoal"
                    >
                      On sale
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <RouterLink
                  v-for="product in megaItems(item.id)"
                  :key="product.id"
                  :to="`/product/${product.id}`"
                  class="group/card flex flex-col overflow-hidden rounded-2xl bg-bone"
                >
                  <div class="aspect-[3/4] overflow-hidden bg-beige/40">
                    <img
                      :src="product.images[0]"
                      :alt="product.name"
                      loading="lazy"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />
                  </div>
                  <span class="truncate px-2 py-1.5 text-xs text-charcoal/70">{{ product.name }}</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li>
        <RouterLink
          to="/category/new-arrivals"
          class="rounded-full px-4 py-2.5 text-sm font-medium tracking-wide text-charcoal/85 transition hover:bg-charcoal/5 hover:text-charcoal"
        >
          New Arrivals
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/category/sale"
          class="rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide text-clay transition hover:bg-clay/5"
        >
          Sale
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>