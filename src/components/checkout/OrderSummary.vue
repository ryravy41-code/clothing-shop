<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/utils/format'

withDefaults(
  defineProps<{
    shipping?: number | null
    title?: string
    showItems?: boolean
    compact?: boolean
  }>(),
  { shipping: null, title: 'Order summary', showItems: true, compact: false },
)

const cart = useCartStore()
</script>

<template>
  <div class="rounded-3xl border border-charcoal/8 bg-white p-6" :class="compact ? 'p-5' : ''">
    <h3 class="font-display text-lg text-charcoal">{{ title }}</h3>

    <ul v-if="showItems && cart.items.length" class="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
      <li v-for="item in cart.items" :key="item.key" class="flex items-center gap-3">
        <div class="relative shrink-0 overflow-hidden rounded-xl bg-beige/30">
          <img :src="item.image" :alt="item.name" loading="lazy" class="h-16 w-14 object-cover" />
          <span class="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-xl bg-charcoal px-1 text-[10px] font-bold text-bone">
            {{ item.quantity }}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-charcoal">{{ item.name }}</p>
          <p class="text-xs text-charcoal/50">{{ item.color }} · {{ item.size }}</p>
        </div>
        <p class="text-sm font-semibold text-charcoal">{{ formatCurrency(item.price * item.quantity) }}</p>
      </li>
    </ul>

    <dl class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between text-charcoal/65">
        <dt>Subtotal</dt>
        <dd class="font-medium text-charcoal">{{ formatCurrency(cart.subtotal) }}</dd>
      </div>
      <div v-if="cart.discountAmount > 0" class="flex justify-between text-green-700">
        <dt>Discount {{ cart.appliedCoupon ? `(${cart.appliedCoupon.code})` : '' }}</dt>
        <dd class="font-medium">−{{ formatCurrency(cart.discountAmount) }}</dd>
      </div>
      <div class="flex justify-between text-charcoal/65">
        <dt>Shipping</dt>
        <dd class="font-medium text-charcoal">
          {{ shipping === null ? (cart.shipping === 0 ? 'Free' : formatCurrency(cart.shipping)) : shipping === 0 ? 'Free' : formatCurrency(shipping) }}
        </dd>
      </div>
      <div class="flex justify-between border-t border-charcoal/10 pt-2.5 text-base font-semibold text-charcoal">
        <dt>Total</dt>
        <dd>
          {{ formatCurrency(shipping === null ? cart.total : cart.grandTotal + shipping) }}
        </dd>
      </div>
    </dl>

    <p v-if="cart.appliedCoupon" class="mt-3 flex items-center justify-between gap-2 rounded-xl bg-gold/10 px-3.5 py-2.5 text-xs font-medium text-charcoal">
      <span class="flex items-center gap-1.5">
        <AppIcon name="tag" :size="14" class="text-gold" />
        {{ cart.appliedCoupon.code }} applied
      </span>
      <button type="button" class="font-semibold text-charcoal/50 underline-offset-2 transition hover:text-charcoal" @click="cart.removeCoupon()">
        Remove
      </button>
    </p>
  </div>
</template>