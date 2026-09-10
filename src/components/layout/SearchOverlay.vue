<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { useProductStore } from '@/stores/product'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const productStore = useProductStore()

const query = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

const TRENDING = ['Trench coat', 'Sneakers', 'Cashmere', 'Denim', 'Gold watch']

watch(
  () => props.open,
  (open) => {
    if (open) {
      query.value = ''
      setTimeout(() => inputEl.value?.focus(), 60)
    }
  },
)

const suggestions = computed(() => (query.value.trim() ? productStore.suggestions(query.value, 5) : []))

const popular = computed(() =>
  [...productStore.products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4),
)

function submit() {
  if (!query.value.trim()) return
  emit('close')
  void router.push({ path: '/search', query: { q: query.value.trim() } })
}

function useSuggestion(term: string) {
  query.value = term
  submit()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="search">
      <div
        v-if="open"
        class="fixed inset-0 z-[95]"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div class="absolute inset-0 bg-ink/45 backdrop-blur-sm animate-fade" @click="emit('close')" />
        <div class="absolute inset-x-0 top-0 bg-bone pb-8 shadow-2xl animate-slide-down">
          <div class="wrap pt-6">
            <div class="flex items-center gap-2">
              <form class="relative flex-1" role="search" @submit.prevent="submit">
                <span class="pointer-events-none absolute inset-y-0 left-5 flex items-center text-charcoal/45">
                  <AppIcon name="search" :size="20" />
                </span>
                <input
                  ref="inputEl"
                  v-model="query"
                  type="search"
                  placeholder="Search brands, categories, products…"
                  class="h-14 w-full rounded-full border border-charcoal/15 bg-white pl-14 pr-16 text-base text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-gold"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  class="absolute inset-y-1.5 right-1.5 rounded-full bg-charcoal px-5 text-sm font-semibold text-bone transition hover:bg-black"
                >
                  Search
                </button>
              </form>
              <button
                type="button"
                class="btn-icon shrink-0 bg-white"
                aria-label="Close search"
                @click="emit('close')"
              >
                <AppIcon name="close" :size="18" />
              </button>
            </div>

            <div v-if="!query.trim()" class="mt-7 flex flex-col gap-6 sm:flex-row sm:gap-10">
              <div class="sm:w-56">
                <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/40">Trending</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <button
                    v-for="term in TRENDING"
                    :key="term"
                    type="button"
                    class="rounded-full border border-charcoal/15 bg-white px-3.5 py-1.5 text-sm text-charcoal/75 transition hover:border-gold hover:text-gold"
                    @click="useSuggestion(term)"
                  >
                    {{ term }}
                  </button>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/40">Popular now</p>
                <div class="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <ProductCard v-for="p in popular" :key="p.id" :product="p" @navigate="emit('close')" />
                </div>
              </div>
            </div>

            <div v-else-if="suggestions.length === 0" class="mt-8 flex flex-col items-center py-8 text-center">
              <AppIcon name="search" :size="32" class="text-charcoal/25" />
              <p class="mt-3 font-display text-lg text-charcoal">No matches for “{{ query }}”</p>
              <p class="mt-1 text-sm text-charcoal/50">
                Try a different search or browse popular categories.
              </p>
              <RouterLink
                to="/shop"
                class="mt-4 text-sm font-semibold text-gold underline-offset-4 hover:underline"
                @click="emit('close')"
              >
                Browse all products
              </RouterLink>
            </div>

            <div v-else class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <RouterLink
                v-for="p in suggestions"
                :key="p.id"
                :to="`/product/${p.id}`"
                class="flex items-center gap-4 rounded-2xl bg-white p-3 transition hover:shadow-lg hover:shadow-charcoal/5"
                @click="emit('close')"
              >
                <img :src="p.images[0]" :alt="p.name" loading="lazy" class="h-16 w-14 rounded-xl object-cover bg-beige/40" />
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-charcoal">{{ p.name }}</p>
                  <p class="text-xs text-charcoal/50">{{ p.brand }}</p>
                  <p class="mt-0.5 text-sm font-semibold text-gold">${{ p.price.toFixed(0) }}</p>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-enter-active,
.search-leave-active {
  transition: opacity 0.25s ease;
}
.search-enter-from,
.search-leave-to {
  opacity: 0;
}
.animate-slide-down {
  animation: slide-down 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>