<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import { ORDER_STATUS_LABEL } from '@/stores/order'
import { formatDate, formatCurrency } from '@/utils/format'
import type { OrderStatus } from '@/types'

const router = useRouter()
const auth = useAuthStore()
const orderStore = useOrderStore()
const statusFilter = ref<'all' | OrderStatus>('all')

onMounted(() => {
  if (auth.currentUser) orderStore.loadOrders(auth.currentUser.id)
})

const filtered = () =>
  statusFilter.value === 'all'
    ? orderStore.orders
    : orderStore.orders.filter((o) => o.status === statusFilter.value)

const toneFor = (status: OrderStatus) =>
  status === 'delivered' ? ('green' as const) : status === 'cancelled' ? ('clay' as const) : ('gold' as const)
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Orders</p>
        <h1 class="mt-1 font-display text-3xl text-charcoal">My orders</h1>
      </div>
    </div>

    <div class="mt-5 flex flex-wrap gap-2">
      <button
        v-for="label in [
          { id: 'all', label: 'All' },
          { id: 'processing', label: 'Processing' },
          { id: 'shipped', label: 'Shipped' },
          { id: 'delivered', label: 'Delivered' },
          { id: 'cancelled', label: 'Cancelled' },
        ]"
        :key="label.id"
        type="button"
        :class="[
          'rounded-full border px-4 py-2 text-sm font-medium transition',
          statusFilter === label.id
            ? 'border-charcoal bg-charcoal text-bone'
            : 'border-charcoal/15 bg-white text-charcoal/65 hover:border-charcoal/40',
        ]"
        @click="statusFilter = label.id as 'all' | OrderStatus"
      >
        {{ label.label }}
      </button>
    </div>

    <EmptyState
      v-if="orderStore.orders.length === 0"
      class="mt-8"
      icon="package"
      title="No orders yet"
      description="When you place an order it will appear here with live tracking."
      action-label="Explore the shop"
      @action="router.push('/shop')"
    />

    <ul v-else class="mt-6 space-y-4">
      <li
        v-for="order in filtered()"
        :key="order.id"
        class="overflow-hidden rounded-3xl border border-charcoal/8 bg-white"
      >
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/8 bg-bone/60 px-6 py-4">
          <div>
            <p class="text-sm font-bold text-charcoal">{{ order.id }}</p>
            <p class="text-xs text-charcoal/50">
              Placed {{ formatDate(order.createdAt) }} · {{ order.items.length }} item(s)
            </p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-xs text-charcoal/50">Total</p>
              <p class="text-sm font-semibold text-charcoal">{{ formatCurrency(order.total) }}</p>
            </div>
            <BaseBadge :tone="toneFor(order.status)">{{ ORDER_STATUS_LABEL[order.status] }}</BaseBadge>
          </div>
        </div>

        <div class="flex items-center gap-4 px-6 py-4">
          <div class="flex -space-x-3">
            <img
              v-for="item in order.items.slice(0, 4)"
              :key="item.productId + item.size"
              :src="item.image"
              :alt="item.name"
              loading="lazy"
              class="h-14 w-12 rounded-xl border-2 border-white object-cover"
            />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm text-charcoal/70">
              {{ order.items[0].name }}
              <span v-if="order.items.length > 1">+ {{ order.items.length - 1 }} more</span>
            </p>
            <p class="text-xs text-charcoal/45">{{ order.paymentMethod }}</p>
          </div>
          <RouterLink
            :to="`/account/orders/${order.id}`"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal transition hover:border-charcoal hover:bg-charcoal hover:text-bone"
          >
            View order
            <AppIcon name="arrow-right" :size="14" />
          </RouterLink>
        </div>
      </li>
    </ul>
  </div>
</template>