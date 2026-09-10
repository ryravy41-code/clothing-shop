<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useProductStore } from '@/stores/product'
import type { Product } from '@/types'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const query = ref<string>((route.query.q as string) ?? '')

watch(
  () => route.query.q,
  (q) => {
    query.value = typeof q === 'string' ? q : ''
  },
)

const results = computed<Product[]>(() => productStore.searchMatches(query.value))

const hasQuery = computed(() => query.value.trim().length > 0)

function submit() {
  void router.replace({ query: { q: query.value.trim() } })
}

const suggestions = ['Trench coat', 'Sneakers', 'Denim', 'Cashmere', 'Leather', 'Dress']
</script>

<template>
  <div class="wrap py-8 sm:py-10">
    <div class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Search</p>
      <h1 class="mt-2 font-display text-3xl text-charcoal sm:text-4xl">Find your next favourite</h1>
      <form class="relative mt-6" role="search" @submit.prevent="submit">
        <span class="pointer-events-none absolute inset-y-0 left-5 flex items-center text-charcoal/45">
          <AppIcon name="search" :size="20" />
        </span>
        <input
          v-model="query"
          type="search"
          placeholder="Try 'trench coat', 'sneakers', 'cashmere'…"
          class="h-14 w-full rounded-full border border-charcoal/15 bg-white pl-14 pr-32 text-base text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-gold"
          aria-label="Search products"
        />
        <button
          type="submit"
          class="absolute inset-y-1.5 right-1.5 rounded-full bg-charcoal px-5 text-sm font-semibold text-bone transition hover:bg-black"
        >
          Search
        </button>
      </form>
    </div>

    <div v-if="!hasQuery" class="mx-auto mt-10 max-w-2xl text-center">
      <p class="text-sm text-charcoal/55">Or start with a category</p>
      <div class="mt-4 flex flex-wrap justify-center gap-2">
        <button
          v-for="term in suggestions"
          :key="term"
          type="button"
          class="rounded-full border border-charcoal/15 bg-white px-4 py-2 text-sm text-charcoal/70 transition hover:border-gold hover:text-gold"
          @click="query = term; submit()"
        >
          {{ term }}
        </button>
      </div>
    </div>

    <div v-else-if="productStore.loading" class="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="aspect-[3/4] animate-shimmer rounded-3xl bg-charcoal/5" />
    </div>

    <EmptyState
      v-else-if="results.length === 0"
      class="mt-10"
      icon="search"
      title="No results found"
      :description="`We couldn't find anything matching “${query}”. Check the spelling or try a broader term.`"
      action-label="Browse all products"
      @action="router.push('/shop')"
    />

    <template v-else>
      <p class="mt-8 text-sm text-charcoal/50">
        {{ results.length }} result{{ results.length === 1 ? '' : 's' }} for “{{ query }}”
      </p>
      <div class="mt-5 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <ProductCard v-for="p in results" :key="p.id" :product="p" />
      </div>
      <div class="mt-10 flex justify-center">
        <BaseButton variant="outline" @click="router.push('/shop')">
          <AppIcon name="grid" :size="16" />
          Browse everything
        </BaseButton>
      </div>
    </template>
  </div>
</template>