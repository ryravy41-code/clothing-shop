<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { useOrderStore, ORDER_STATUS_LABEL } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/utils/format'
import type { Order as OrderType } from '@/types'

const route = useRoute()
const orderStore = useOrderStore()
const cart = useCartStore()

const order = ref<OrderType | null>(null)

onMounted(() => {
  const id = typeof route.query.id === 'string' ? route.query.id : null
  order.value = id ? (orderStore.getById(id) ?? null) : null
})
</script>

<template>
  <div class="mx-auto w-full max-w-2xl px-4 py-16">
    <div class="text-center">
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600/10">
        <AppIcon name="check-circle" :size="40" class="text-green-600" />
      </div>
      <h1 class="mt-5 font-display text-3xl text-charcoal sm:text-4xl">
        Thank you, {{ route.query.name || 'shopper' }}!
      </h1>
      <p class="mx-auto mt-3 max-w-md text-charcoal/60">
        Your order is confirmed. We've emailed the details and will let you know as soon as it ships.
      </p>
    </div>

    <div v-if="order" class="mt-8 overflow-hidden rounded-3xl border border-charcoal/8 bg-white">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/8 bg-bone/60 px-6 py-4">
        <div>
          <p class="font-mono text-sm font-bold text-charcoal">{{ order.id }}</p>
          <p class="text-xs text-charcoal/50">Estimated delivery {{ order.deliveryMethod === 'express' ? '1–2' : '3–5' }} business days</p>
        </div>
        <BaseBadge tone="green">{{ ORDER_STATUS_LABEL[order.status] }}</BaseBadge>
      </div>

      <ul class="divide-y divide-charcoal/8 px-6">
        <li v-for="item in order.items" :key="item.productId + item.size" class="flex items-center gap-4 py-4">
          <img :src="item.image" :alt="item.name" loading="lazy" class="h-16 w-12 rounded-xl object-cover" />
          <div class="min-w-0 flex-1">
            <RouterLink :to="`/product/${item.productId}`" class="block truncate text-sm font-semibold text-charcoal hover:text-gold">
              {{ item.name }}
            </RouterLink>
            <p class="text-xs text-charcoal/50">{{ item.color }} · Size {{ item.size }} · Qty {{ item.quantity }}</p>
          </div>
          <p class="text-sm font-semibold text-charcoal">{{ formatCurrency(item.price * item.quantity) }}</p>
        </li>
      </ul>

      <div class="space-y-2 border-t border-charcoal/8 bg-bone/40 px-6 py-4 text-sm">
        <div v-if="order.discount > 0" class="flex justify-between text-green-700">
          <span>Discount{{ order.couponCode ? ` (${order.couponCode})` : '' }}</span>
          <span class="font-medium">−{{ formatCurrency(order.discount) }}</span>
        </div>
        <div class="flex justify-between text-charcoal/65">
          <span>Shipping</span>
          <span class="font-medium text-charcoal">{{ order.shipping === 0 ? 'Free' : formatCurrency(order.shipping) }}</span>
        </div>
        <div class="flex justify-between border-t border-charcoal/10 pt-2 text-base font-semibold text-charcoal">
          <span>Total</span>
          <span>{{ formatCurrency(order.total) }}</span>
        </div>
      </div>
    </div>

    <div class="mt-8 grid gap-4 sm:grid-cols-3">
      <RouterLink
        :to="order ? `/track-order?id=${order.id}` : '/track-order'"
        class="rounded-3xl border border-charcoal/8 bg-white p-5 text-center transition hover:shadow-md"
      >
        <span class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-beige/60 text-gold">
          <AppIcon name="truck" :size="17" />
        </span>
        <p class="mt-2.5 text-sm font-semibold text-charcoal">Track order</p>
        <p class="mt-0.5 text-xs text-charcoal/50">Follow every step</p>
      </RouterLink>
      <RouterLink
        :to="order ? `/account/orders/${order.id}` : '/account/orders'"
        class="rounded-3xl border border-charcoal/8 bg-white p-5 text-center transition hover:shadow-md"
      >
        <span class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-beige/60 text-gold">
          <AppIcon name="package" :size="17" />
        </span>
        <p class="mt-2.5 text-sm font-semibold text-charcoal">My orders</p>
        <p class="mt-0.5 text-xs text-charcoal/50">Invoice & returns</p>
      </RouterLink>
      <RouterLink
        to="/shop"
        class="rounded-3xl border border-charcoal/8 bg-white p-5 text-center transition hover:shadow-md"
      >
        <span class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-beige/60 text-gold">
          <AppIcon name="bag-plus" :size="17" />
        </span>
        <p class="mt-2.5 text-sm font-semibold text-charcoal">Keep shopping</p>
        <p class="mt-0.5 text-xs text-charcoal/50">Discover more styles</p>
      </RouterLink>
    </div>

    <div class="mt-8 rounded-2xl border border-charcoal/8 bg-bone/40 p-5 text-center text-sm text-charcoal/60">
      Questions about your order? Visit our
      <RouterLink to="/faq" class="font-semibold text-gold hover:text-gold-dark">FAQ</RouterLink>
      or
      <RouterLink to="/contact" class="font-semibold text-gold hover:text-gold-dark">contact support</RouterLink>.
    </div>

    <div class="mt-8 text-center">
      <RouterLink :to="cart.itemCount > 0 ? '/cart' : '/shop'">
        <BaseButton variant="outline" size="sm">
          <AppIcon name="arrow-right" :size="15" />
          {{ cart.itemCount > 0 ? 'Return to bag' : 'Back to the shop' }}
        </BaseButton>
      </RouterLink>
    </div>
  </div>
</template>