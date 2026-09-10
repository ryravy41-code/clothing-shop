<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import { useWishlistStore } from '@/stores/wishlist'
import { ORDER_STATUS_LABEL } from '@/stores/order'
import { formatDate, formatCurrency } from '@/utils/format'

const auth = useAuthStore()
const orderStore = useOrderStore()
const wishlist = useWishlistStore()

onMounted(() => {
  if (auth.currentUser) orderStore.loadOrders(auth.currentUser.id)
})

const stats = [
  { label: 'Orders', value: orderStore.orders.length, icon: 'package', to: '/account/orders' },
  { label: 'Wishlist', value: wishlist.count, icon: 'heart', to: '/account/wishlist' },
  { label: 'Addresses', value: auth.currentUser?.addresses.length ?? 0, icon: 'map-pin', to: '/account/addresses' },
  { label: 'Saved cards', value: auth.savedCards.length, icon: 'credit-card', to: '/account/profile' },
]
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Account</p>
        <h1 class="mt-1 font-display text-3xl text-charcoal">Welcome back, {{ auth.fullName.split(' ')[0] }}</h1>
        <p class="mt-1 text-sm text-charcoal/50">
          Member since {{ auth.currentUser ? formatDate(auth.currentUser.createdAt) : '—' }}
        </p>
      </div>
      <RouterLink to="/shop">
        <BaseButton variant="outline" size="sm">
          <AppIcon name="bag-plus" :size="15" />
          Start shopping
        </BaseButton>
      </RouterLink>
    </div>

    <div class="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <RouterLink
        v-for="s in stats"
        :key="s.label"
        :to="s.to"
        class="group rounded-3xl border border-charcoal/8 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-charcoal/5"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-beige/60 text-gold">
          <AppIcon :name="s.icon" :size="19" />
        </span>
        <p class="mt-3 font-display text-2xl text-charcoal">{{ s.value }}</p>
        <p class="text-sm text-charcoal/55">{{ s.label }}</p>
      </RouterLink>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg text-charcoal">Latest order</h2>
          <RouterLink to="/account/orders" class="text-sm font-semibold text-gold">View all</RouterLink>
        </div>
        <template v-if="orderStore.orders.length">
          <div class="mt-4 flex items-center justify-between rounded-2xl bg-bone p-4">
            <div>
              <p class="text-sm font-semibold text-charcoal">{{ orderStore.orders[0].id }}</p>
              <p class="text-xs text-charcoal/50">{{ formatDate(orderStore.orders[0].createdAt) }} · {{ orderStore.orders[0].items.length }} item(s)</p>
            </div>
            <div class="text-right">
              <BaseBadge :tone="orderStore.orders[0].status === 'delivered' ? 'green' : orderStore.orders[0].status === 'cancelled' ? 'clay' : 'gold'">
                {{ ORDER_STATUS_LABEL[orderStore.orders[0].status] }}
              </BaseBadge>
              <p class="mt-1.5 text-sm font-semibold text-charcoal">{{ formatCurrency(orderStore.orders[0].total) }}</p>
            </div>
          </div>
          <RouterLink :to="`/account/orders/${orderStore.orders[0].id}`" class="mt-3 inline-block text-sm font-medium text-charcoal/60 transition hover:text-charcoal">
            Track this order →
          </RouterLink>
        </template>
        <p v-else class="mt-4 text-sm text-charcoal/55">No orders yet — your next favourite is waiting.</p>
      </div>

      <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
        <h2 class="font-display text-lg text-charcoal">Quick actions</h2>
        <ul class="mt-4 divide-y divide-charcoal/8">
          <li v-for="action in [
            { label: 'Track an order', icon: 'truck', to: '/track-order' },
            { label: 'Browse wishlist', icon: 'heart', to: '/account/wishlist' },
            { label: 'Manage addresses', icon: 'map-pin', to: '/account/addresses' },
            { label: 'Edit profile', icon: 'user', to: '/account/profile' },
          ]" :key="action.to">
            <RouterLink :to="action.to" class="group flex items-center gap-3 py-3">
              <AppIcon :name="action.icon" :size="18" class="text-gold" />
              <span class="flex-1 text-sm font-medium text-charcoal/75 group-hover:text-charcoal">{{ action.label }}</span>
              <AppIcon name="chev-right" :size="15" class="text-charcoal/30 transition group-hover:translate-x-0.5" />
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>