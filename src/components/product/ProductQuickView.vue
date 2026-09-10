<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import PriceDisplay from '@/components/ui/PriceDisplay.vue'
import QuantityStepper from '@/components/ui/QuantityStepper.vue'
import StarRating from '@/components/ui/StarRating.vue'
import { useQuickViewStore } from '@/stores/quickview'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const quickView = useQuickViewStore()
const cart = useCartStore()
const wishlist = useWishlistStore()

const selectedSize = ref('')
const quantity = ref(1)

watch(
  () => quickView.product,
  (product) => {
    if (product) {
      selectedSize.value = product.sizes.find((s) => s !== 'One Size') ?? product.sizes[0] ?? ''
      quantity.value = 1
    }
  },
  { immediate: true },
)

const outOfStock = computed(() => Boolean(quickView.product && quickView.product.stock === 0))

function addToCart() {
  const product = quickView.product
  if (!product || outOfStock.value) return
  cart.addItem({
    product,
    size: selectedSize.value || product.sizes[0],
    color: product.colors[0],
    quantity: quantity.value,
  })
}
</script>

<template>
  <BaseModal
    :open="quickView.open"
    size="lg"
    title="Quick view"
    subtitle="Select your size, then add to your bag."
    @close="quickView.close"
  >
    <div v-if="quickView.product" class="grid gap-6 sm:grid-cols-2">
      <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-beige/30">
        <img
          :src="quickView.product.images[0]"
          :alt="quickView.product.name"
          class="h-full w-full object-cover"
        />
        <div class="absolute left-3 top-3 flex gap-1.5">
          <BaseBadge v-if="quickView.product.discount" tone="clay">
            −{{ quickView.product.discount }}%
          </BaseBadge>
          <BaseBadge v-if="quickView.product.isNew" tone="gold">New</BaseBadge>
        </div>
      </div>

      <div class="flex flex-col">
        <p class="text-[11px] font-medium uppercase tracking-[0.16em] text-charcoal/40">
          {{ quickView.product.brand }}
        </p>
        <h3 class="mt-1 font-display text-xl leading-snug text-charcoal">
          {{ quickView.product.name }}
        </h3>
        <div class="mt-2 flex items-center gap-2">
          <StarRating :value="quickView.product.rating" :size="'sm'" />
          <span class="text-xs text-charcoal/45">
            {{ quickView.product.rating.toFixed(1) }} · {{ quickView.product.reviewCount }} reviews
          </span>
        </div>

        <div class="mt-3">
          <PriceDisplay
            :price="quickView.product.price"
            :original-price="quickView.product.originalPrice"
            :size="'lg'"
            show-discount
          />
        </div>

        <p class="mt-3 text-sm leading-relaxed text-charcoal/55 line-clamp-3">
          {{ quickView.product.description }}
        </p>

        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/60">
            Size
            <span class="ml-2 text-charcoal/40 normal-case tracking-normal">Size guide</span>
          </p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="size in quickView.product.sizes"
              :key="size"
              type="button"
              :class="[
                'min-w-11 rounded-full border px-3 py-2 text-xs font-semibold transition',
                selectedSize === size
                  ? 'border-charcoal bg-charcoal text-bone'
                  : 'border-charcoal/20 text-charcoal/70 hover:border-charcoal/50',
              ]"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <div class="mt-5 flex flex-1 items-end gap-3">
          <QuantityStepper v-model="quantity" :max="quickView.product.stock" />
          <BaseButton
            class="flex-1"
            :disabled="outOfStock"
            @click="addToCart"
          >
            <AppIcon name="bag-plus" :size="17" />
            {{ outOfStock ? 'Sold out' : 'Add to bag' }}
          </BaseButton>
        </div>

        <div class="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 font-medium text-charcoal/70 transition hover:text-clay"
            @click="wishlist.toggle(quickView.product!.id)"
          >
            <AppIcon
              :name="wishlist.has(quickView.product!.id) ? 'heart-fill' : 'heart'"
              :size="16"
              :class="wishlist.has(quickView.product!.id) ? 'text-clay' : ''"
            />
            {{ wishlist.has(quickView.product!.id) ? 'Saved' : 'Save' }}
          </button>
          <RouterLink
            :to="`/product/${quickView.product.id}`"
            class="font-semibold text-gold transition hover:text-gold-dark"
            @click="quickView.close"
          >
            View details →
          </RouterLink>
        </div>
      </div>
    </div>
  </BaseModal>
</template>