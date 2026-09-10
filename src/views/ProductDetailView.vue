<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import PriceDisplay from '@/components/ui/PriceDisplay.vue'
import QuantityStepper from '@/components/ui/QuantityStepper.vue'
import StarRating from '@/components/ui/StarRating.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductReviews from '@/components/product/ProductReviews.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import { formatCurrency } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const recently = useRecentlyViewedStore()

const productId = computed(() => Number(route.params.id))
const product = computed(() => productStore.getProduct(productId.value))

const loading = ref(!productStore.initialized)
const error = ref<string | null>(null)

const selectedSize = ref('')
const quantity = ref(1)
const activeTab = ref<'details' | 'reviews' | 'shipping'>('details')

watch(productId, async (id) => {
  if (!Number.isInteger(id)) {
    error.value = 'Product not found.'
    return
  }
  if (!productStore.initialized) {
    loading.value = true
    await productStore.fetchProducts()
    loading.value = false
  }
  const p = productStore.getProduct(id)
  if (!p) {
    error.value = 'Product not found.'
    return
  }
  error.value = null
  selectedSize.value = p.sizes.find((s) => s !== 'One Size') ?? p.sizes[0] ?? ''
  quantity.value = 1
  recently.add(id)
}, { immediate: true })

const outOfStock = computed(() => Boolean(product.value && product.value.stock === 0))

const related = computed(() => product.value ? productStore.related(product.value.id) : [])
const look = computed(() => product.value ? productStore.completeTheLook(product.value.id) : [])

function addToCart() {
  if (!product.value) return
  cart.addItem({
    product: product.value,
    size: selectedSize.value || product.value.sizes[0],
    color: product.value.colors[0],
    quantity: quantity.value,
  })
}

function buyNow() {
  if (!product.value) return
  addToCart()
  void router.push('/checkout')
}

const savedAmount = computed(() => {
  if (!product.value?.originalPrice) return 0
  return Math.max(0, product.value.originalPrice - product.value.price)
})
</script>

<template>
  <div class="wrap py-8 sm:py-10">
    <Breadcrumbs
      v-if="product"
      class="mb-6"
      :crumbs="[
        { label: 'Shop', to: '/shop' },
        { label: product.category, to: `/category/${product.category}` },
        { label: product.name },
      ]"
    />

    <div v-if="loading" class="grid gap-10 lg:grid-cols-2">
      <BaseSkeleton class="aspect-[4/5] w-full rounded-3xl" />
      <div class="space-y-4">
        <BaseSkeleton class="h-4 w-24" />
        <BaseSkeleton class="h-8 w-3/4" />
        <BaseSkeleton class="h-4 w-40" />
        <BaseSkeleton class="h-10 w-32" />
        <BaseSkeleton class="h-5 w-full" />
        <BaseSkeleton class="h-5 w-2/3" />
        <BaseSkeleton class="mt-6 h-12 w-full" />
        <BaseSkeleton class="h-12 w-full" />
      </div>
    </div>

    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="router.push({ name: 'shop' })"
    />

    <template v-else-if="product">
      <div class="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery :images="product.images" :alt="product.name" />

        <div class="flex flex-col">
          <div class="flex items-center gap-3">
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-charcoal/45">
              {{ product.brand }}
            </p>
            <span class="flex items-center gap-1 text-xs text-charcoal/45">
              <AppIcon name="check-circle" :size="13" class="text-green-600" />
              In stock
            </span>
          </div>

          <h1 class="mt-2 font-display text-3xl leading-tight text-charcoal sm:text-4xl">
            {{ product.name }}
          </h1>

          <div class="mt-3 flex flex-wrap items-center gap-3">
            <RouterLink to="#reviews" class="flex items-center gap-1.5">
              <StarRating :value="product.rating" :size="'sm'" />
              <span class="text-sm text-charcoal/50">
                {{ product.rating.toFixed(1) }} · {{ product.reviewCount }} reviews
              </span>
            </RouterLink>
            <span class="text-charcoal/30">•</span>
            <span class="text-sm" :class="product.stock > 20 ? 'text-green-700' : 'text-clay'">
              {{ product.stock > 20 ? 'In stock, ready to ship' : `Only ${product.stock} left` }}
            </span>
          </div>

          <div class="mt-4 flex items-center gap-3">
            <PriceDisplay :price="product.price" :original-price="product.originalPrice" :size="'lg'" show-discount />
            <BaseBadge v-if="savedAmount > 0" tone="green">
              Save {{ formatCurrency(savedAmount) }}
            </BaseBadge>
          </div>

          <p class="mt-5 text-sm leading-relaxed text-charcoal/60">
            {{ product.description }}
          </p>

          <div class="mt-5">
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/60">Size</p>
              <button type="button" class="text-xs font-medium text-gold transition hover:text-gold-dark">
                Size guide
              </button>
            </div>
            <div class="mt-2.5 flex flex-wrap gap-2">
              <button
                v-for="size in product.sizes"
                :key="size"
                type="button"
                :class="[
                  'min-w-12 rounded-full border px-4 py-2.5 text-xs font-bold transition',
                  selectedSize === size
                    ? 'border-charcoal bg-charcoal text-bone'
                    : 'border-charcoal/20 text-charcoal/70 hover:border-charcoal/50',
                ]"
                :aria-label="`Select size ${size}`"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="mt-7 flex flex-col gap-3 sm:flex-row">
            <QuantityStepper v-model="quantity" :max="product.stock" />
            <BaseButton
              size="lg"
              class="sm:flex-1"
              :disabled="outOfStock"
              @click="addToCart"
            >
              <AppIcon name="bag-plus" :size="18" />
              {{ outOfStock ? 'Sold out' : `Add to bag · ${formatCurrency(product.price * quantity)}` }}
            </BaseButton>
            <BaseButton
              size="lg"
              variant="gold"
              :disabled="outOfStock"
              @click="buyNow"
            >
              Buy now
            </BaseButton>
          </div>

          <button
            type="button"
            :class="[
              'mx-auto mt-4 flex items-center gap-2 text-sm font-medium transition sm:mx-0',
              wishlist.has(product.id) ? 'text-clay' : 'text-charcoal/60 hover:text-clay',
            ]"
            @click="wishlist.toggle(product.id)"
          >
            <AppIcon :name="wishlist.has(product.id) ? 'heart-fill' : 'heart'" :size="17" />
            {{ wishlist.has(product.id) ? 'Saved to wishlist' : 'Save to wishlist' }}
          </button>

          <div class="mt-7 grid grid-cols-3 gap-3 border-t border-charcoal/10 pt-6 text-center">
            <div class="rounded-2xl bg-beige/40 p-3.5">
              <AppIcon name="truck" :size="20" class="mx-auto text-gold" />
              <p class="mt-1.5 text-[11px] font-medium text-charcoal/70">Free shipping over $150</p>
            </div>
            <div class="rounded-2xl bg-beige/40 p-3.5">
              <AppIcon name="refresh" :size="20" class="mx-auto text-gold" />
              <p class="mt-1.5 text-[11px] font-medium text-charcoal/70">30-day returns</p>
            </div>
            <div class="rounded-2xl bg-beige/40 p-3.5">
              <AppIcon name="shield" :size="20" class="mx-auto text-gold" />
              <p class="mt-1.5 text-[11px] font-medium text-charcoal/70">Secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      <!-- DETAILS / REVIEWS TABS -->
      <section id="reviews" class="mt-16">
        <div class="flex gap-1 overflow-x-auto rounded-full border border-charcoal/10 bg-white p-1.5 sm:w-fit">
          <button
            v-for="tab in [
              { id: 'details', label: 'Details & care' },
              { id: 'reviews', label: `Reviews (${product.reviewCount})` },
              { id: 'shipping', label: 'Shipping & returns' },
            ]"
            :key="tab.id"
            type="button"
            :class="[
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition',
              activeTab === tab.id ? 'bg-charcoal text-bone' : 'text-charcoal/60 hover:text-charcoal',
            ]"
            @click="activeTab = tab.id as typeof activeTab"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="mt-8">
          <div v-if="activeTab === 'details'" class="grid gap-8 lg:grid-cols-2">
            <div class="rounded-3xl border border-charcoal/8 bg-white p-7">
              <h3 class="font-display text-lg text-charcoal">What makes it special</h3>
              <ul class="mt-4 space-y-3">
                <li v-for="detail in product.details" :key="detail" class="flex items-start gap-2.5 text-sm text-charcoal/70">
                  <AppIcon name="check" :size="16" class="mt-0.5 shrink-0 text-gold" />
                  {{ detail }}
                </li>
              </ul>
            </div>
            <div class="rounded-3xl border border-charcoal/8 bg-white p-7">
              <h3 class="font-display text-lg text-charcoal">Details</h3>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between border-b border-charcoal/8 pb-2.5">
                  <dt class="text-charcoal/50">Material</dt>
                  <dd class="font-medium text-charcoal">{{ product.material ?? 'Premium fabric' }}</dd>
                </div>
                <div class="flex justify-between border-b border-charcoal/8 pb-2.5">
                  <dt class="text-charcoal/50">Brand</dt>
                  <dd class="font-medium text-charcoal">{{ product.brand }}</dd>
                </div>
                <div class="flex justify-between border-b border-charcoal/8 pb-2.5">
                  <dt class="text-charcoal/50">Category</dt>
                  <dd class="font-medium capitalize text-charcoal">{{ product.category }}</dd>
                </div>
                <div class="flex justify-between border-b border-charcoal/8 pb-2.5">
                  <dt class="text-charcoal/50">Available sizes</dt>
                  <dd class="font-medium text-charcoal">{{ product.sizes.join(', ') }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-charcoal/50">Tags</dt>
                  <dd class="flex gap-1.5">
                    <span v-for="tag in product.tags" :key="tag" class="rounded-full bg-beige/60 px-2.5 py-0.5 text-xs text-charcoal/65">
                      {{ tag }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div v-else-if="activeTab === 'reviews'">
            <ProductReviews :product="product" />
          </div>

          <div v-else class="grid gap-6 sm:grid-cols-3">
            <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
              <AppIcon name="truck" :size="22" class="text-gold" />
              <p class="mt-3 font-display text-base text-charcoal">Delivery</p>
              <p class="mt-1.5 text-sm leading-relaxed text-charcoal/55">
                Standard shipping arrives in 3–5 business days. Express delivery in 1–2 days for $24.95.
              </p>
            </div>
            <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
              <AppIcon name="refresh" :size="22" class="text-gold" />
              <p class="mt-3 font-display text-base text-charcoal">Returns</p>
              <p class="mt-1.5 text-sm leading-relaxed text-charcoal/55">
                Not the one? You have 30 days to return unworn items for a full refund or exchange.
              </p>
            </div>
            <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
              <AppIcon name="shield" :size="22" class="text-gold" />
              <p class="mt-3 font-display text-base text-charcoal">Guarantee</p>
              <p class="mt-1.5 text-sm leading-relaxed text-charcoal/55">
                Every piece is quality-checked before it ships. Our atelier standards go beyond what you'd expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- COMPLETE THE LOOK -->
      <section v-if="look.length" class="mt-20">
        <SectionHeader
          eyebrow="Styling"
          title="Complete the look"
          description="Editor-styled pieces that pair perfectly with this one."
        />
        <div class="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <ProductCard v-for="p in look" :key="p.id" :product="p" />
        </div>
      </section>

      <!-- RELATED -->
      <section v-if="related.length" class="mt-16">
        <SectionHeader
          eyebrow="You may also like"
          title="Similar products"
          link-label="Shop full category"
          :link-to="`/category/${product.category}`"
        />
        <div class="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <ProductCard v-for="p in related" :key="p.id" :product="p" />
        </div>
      </section>
    </template>
  </div>
</template>