<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Product } from '@/types'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import PriceDisplay from '@/components/ui/PriceDisplay.vue'
import StarRating from '@/components/ui/StarRating.vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useQuickViewStore } from '@/stores/quickview'

const props = withDefaults(
  defineProps<{
    product: Product
    layout?: 'grid' | 'list'
  }>(),
  { layout: 'grid' },
)

const emit = defineEmits<{ navigate: [] }>()
const wishlist = useWishlistStore()
const quickView = useQuickViewStore()

const hovered = ref(false)
const secondImage = computed(() => props.product.images[1] ?? props.product.images[0])

const discount = computed(() => {
  if (!props.product.originalPrice) return 0
  return Math.round(
    ((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100,
  )
})

const inStock = computed(() => props.product.stock > 0)

function toggleWishlist(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  wishlist.toggle(props.product.id)
}

function quickViewOpen(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  quickView.openFor(props.product.id)
}
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm shadow-charcoal/5 ring-1 ring-charcoal/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-charcoal/10"
    :class="layout === 'list' ? 'sm:flex-row' : ''"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div
      :class="[
        'relative overflow-hidden bg-beige/30',
        layout === 'list' ? 'aspect-[4/3] sm:aspect-auto sm:w-52 shrink-0' : 'aspect-[3/4]',
      ]"
    >
      <RouterLink :to="`/product/${product.id}`" @click="emit('navigate')">
        <img
          :src="product.images[0]"
          :alt="product.name"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <img
          v-if="secondImage !== product.images[0]"
          :src="secondImage"
          :alt="`${product.name} alternate view`"
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </RouterLink>

      <div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">
        <BaseBadge v-if="discount > 0" tone="clay">−{{ discount }}%</BaseBadge>
        <BaseBadge v-if="product.isNew && discount === 0" tone="gold">New</BaseBadge>
        <BaseBadge v-if="product.isBestSeller && discount === 0 && !product.isNew" tone="dark">
          Best Seller
        </BaseBadge>
      </div>

      <button
        type="button"
        :class="[
          'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur transition-all duration-200',
          wishlist.has(product.id)
            ? 'bg-white text-clay'
            : 'bg-white/90 text-charcoal/60 hover:text-clay',
          hovered || wishlist.has(product.id) ? 'opacity-100' : 'opacity-0 sm:opacity-0',
        ]"
        :aria-label="wishlist.has(product.id) ? 'Remove from wishlist' : 'Save to wishlist'"
        @click="toggleWishlist"
      >
        <AppIcon :name="wishlist.has(product.id) ? 'heart-fill' : 'heart'" :size="17" />
      </button>

      <div
        v-if="inStock"
        class="absolute inset-x-3 bottom-3 translate-y-14 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <button
          type="button"
          class="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-2.5 text-sm font-semibold text-charcoal shadow-lg backdrop-blur transition hover:bg-charcoal hover:text-bone"
          @click="quickViewOpen"
        >
          <AppIcon name="eye" :size="16" />
          Quick view
        </button>
      </div>

      <div
        v-if="!inStock"
        class="absolute inset-0 flex items-center justify-center bg-bone/70 backdrop-blur-[2px]"
      >
        <span class="px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/70">
          Sold out
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-1 p-4" :class="layout === 'list' ? 'sm:p-5' : ''">
      <p class="text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal/40">
        {{ product.brand }}
      </p>
      <RouterLink
        :to="`/product/${product.id}`"
        class="line-clamp-1 font-display text-[15px] text-charcoal transition hover:text-gold"
        @click="emit('navigate')"
      >
        {{ product.name }}
      </RouterLink>
      <div class="mt-0.5 flex items-center gap-1.5">
        <StarRating :value="product.rating" :size="'sm'" />
        <span class="text-xs text-charcoal/45">({{ product.reviewCount }})</span>
      </div>
      <div class="mt-1 flex items-center justify-between gap-2">
        <PriceDisplay :price="product.price" :original-price="product.originalPrice" :size="'sm'" show-discount />
      </div>
    </div>
  </article>
</template>