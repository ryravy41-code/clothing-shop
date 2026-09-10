<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CartItem } from '@/types'
import AppIcon from '@/components/ui/AppIcon.vue'
import QuantityStepper from '@/components/ui/QuantityStepper.vue'
import { formatCurrency } from '@/utils/format'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{ item: CartItem; compact?: boolean }>()
const cart = useCartStore()
</script>

<template>
  <div class="flex gap-4">
    <RouterLink
      :to="`/product/${item.productId}`"
      class="shrink-0 overflow-hidden rounded-2xl bg-beige/30"
    >
      <img :src="item.image" :alt="item.name" loading="lazy" class="h-24 w-20 object-cover" />
    </RouterLink>
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="truncate text-xs text-charcoal/50">{{ item.brand }}</p>
          <RouterLink
            :to="`/product/${item.productId}`"
            class="line-clamp-1 text-sm font-semibold text-charcoal transition hover:text-gold"
          >
            {{ item.name }}
          </RouterLink>
          <p class="mt-0.5 text-xs text-charcoal/55">
            {{ item.color }} · Size {{ item.size }}
          </p>
        </div>
        <button
          type="button"
          class="btn-icon -mr-1 -mt-1 !h-8 !w-8 text-charcoal/40 hover:text-clay"
          aria-label="Remove item"
          @click="cart.removeItem(item.key)"
        >
          <AppIcon name="trash" :size="15" />
        </button>
      </div>
      <div class="mt-3 flex items-center justify-between gap-3">
        <QuantityStepper
          v-model="item.quantity"
          :min="1"
          :max="item.stock"
          :size="'sm'"
        />
        <p class="text-sm font-semibold text-charcoal">
          {{ formatCurrency(item.price * item.quantity) }}
        </p>
      </div>
    </div>
  </div>
</template>