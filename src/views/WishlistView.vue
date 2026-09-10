<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const wishlist = useWishlistStore()
const auth = useAuthStore()
</script>

<template>
  <div class="wrap py-8 sm:py-10">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Saved for later</p>
        <h1 class="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Wishlist</h1>
        <p v-if="wishlist.count > 0" class="mt-2 text-sm text-charcoal/50">
          {{ wishlist.count }} item{{ wishlist.count === 1 ? '' : 's' }} saved
        </p>
      </div>
      <RouterLink to="/shop" class="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal transition hover:text-gold">
        <AppIcon name="arrow-left" :size="16" />
        Continue shopping
      </RouterLink>
    </div>

    <EmptyState
      v-if="wishlist.products.length === 0"
      class="mt-8"
      icon="heart"
      title="Your wishlist is empty"
      description="Tap the heart on any product to keep it here for later — we'll remember."
      action-label="Discover products"
      @action="router.push('/shop')"
    />

    <div v-else class="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      <div v-for="p in wishlist.products" :key="p.id" class="relative">
        <ProductCard :product="p" />
        <button
          type="button"
          class="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-clay shadow-lg transition hover:scale-110"
          :aria-label="`Remove ${p.name} from wishlist`"
          @click="wishlist.remove(p.id)"
        >
          <AppIcon name="trash" :size="14" />
        </button>
      </div>
    </div>

    <div v-if="wishlist.products.length > 0 && !auth.isAuthenticated" class="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-charcoal/15 bg-white p-8 text-center">
      <AppIcon name="user" :size="26" class="text-gold" />
      <p class="mt-3 font-display text-lg text-charcoal">Keep your wishlist in sync</p>
      <p class="mt-1 max-w-md text-sm text-charcoal/55">
        Sign in and your saved items will follow you across every device.
      </p>
      <RouterLink to="/login">
        <BaseButton class="mt-4" variant="outline">Sign in</BaseButton>
      </RouterLink>
    </div>
  </div>
</template>