<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PriceDisplay from '@/components/ui/PriceDisplay.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { RouterLink, useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'
import { discountPercent } from '@/utils/format'

const router = useRouter()
const wishlist = useWishlistStore()
const cart = useCartStore()
const productStore = useProductStore()

const sizeFor = (productId: number) => {
  const p = productStore.getProduct(productId)
  return p ? (p.sizes.find((s) => s !== 'One Size') ?? p.sizes[0]) : ''
}
</script>

<template>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Saved items</p>
    <h1 class="mt-1 font-display text-3xl text-charcoal">My wishlist</h1>
    <p v-if="wishlist.count > 0" class="mt-1 text-sm text-charcoal/50">
      {{ wishlist.count }} {{ wishlist.count === 1 ? 'item' : 'items' }} saved for later
    </p>

    <EmptyState
      v-if="wishlist.count === 0"
      class="mt-8"
      icon="heart"
      title="Nothing saved yet"
      description="Tap the heart on any product to build your wishlist."
      action-label="Browse the shop"
      @action="router.push('/shop')"
    />

    <ul v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="product in wishlist.products"
        :key="product.id"
        class="group flex flex-col rounded-3xl border border-charcoal/8 bg-white p-4 transition hover:shadow-lg hover:shadow-charcoal/5"
      >
        <RouterLink :to="`/product/${product.id}`" class="relative overflow-hidden rounded-2xl bg-beige/30">
          <img
            :src="product.images[0]"
            :alt="product.name"
            loading="lazy"
            class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <BaseBadge v-if="discountPercent(product.price, product.originalPrice)" class="absolute left-3 top-3" tone="clay">
            −{{ discountPercent(product.price, product.originalPrice) }}%
          </BaseBadge>
          <button
            type="button"
            class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-clay shadow-md transition hover:scale-110"
            :aria-label="`Remove ${product.name} from wishlist`"
            @click.prevent="wishlist.remove(product.id)"
          >
            <AppIcon name="heart" :size="17" :filled="true" />
          </button>
        </RouterLink>
        <div class="mt-4 flex flex-1 flex-col">
          <p class="text-xs font-medium uppercase tracking-wider text-charcoal/45">{{ product.brand }}</p>
          <RouterLink :to="`/product/${product.id}`" class="mt-0.5 truncate text-sm font-semibold text-charcoal transition hover:text-gold">
            {{ product.name }}
          </RouterLink>
          <div class="mt-2 flex items-center gap-2">
            <PriceDisplay :price="product.price" :original-price="product.originalPrice" />
          </div>
          <div class="mt-4 flex gap-2 pt-1">
            <BaseButton
              size="sm"
              class="flex-1"
              @click="wishlist.moveToCart(product.id)"
            >
              <AppIcon name="bag" :size="14" />
              Move to bag
            </BaseButton>
            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition hover:border-charcoal hover:text-charcoal"
              :title="`Add ${product.name} in ${sizeFor(product.id)} to bag`"
              @click="cart.addItem({ product, size: sizeFor(product.id), color: product.colors[0] })"
            >
              <AppIcon name="bag-plus" :size="15" />
            </button>
            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition hover:border-charcoal hover:text-charcoal"
              :title="`View ${product.name}`"
              @click="router.push(`/product/${product.id}`)"
            >
              <AppIcon name="eye" :size="15" />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>