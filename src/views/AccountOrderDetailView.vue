<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore, ORDER_STATUS_LABEL } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'
import { formatDate, formatDateTime, formatCurrency } from '@/utils/format'
import type { Order as OrderType } from '@/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const orderStore = useOrderStore()
const cart = useCartStore()
const productStore = useProductStore()

const order = ref<OrderType | null>(null)
const cancelOpen = ref(false)

onMounted(() => {
  if (auth.currentUser) {
    orderStore.loadOrders(auth.currentUser.id)
    order.value = orderStore.getById(String(route.params.id)) ?? null
  }
})

const steps = computed(() => (order.value ? orderStore.trackSteps(order.value) : []))
const progress = computed(() => (order.value ? orderStore.progress(order.value) : 0))

const statusTone = (status: OrderType['status']) =>
  status === 'delivered' ? ('green' as const) : status === 'cancelled' ? ('clay' as const) : ('gold' as const)

function reorder() {
  if (!order.value) return
  order.value.items.forEach((item) => {
    const product = productStore.getProduct(item.productId)
    if (product) cart.addItem({ product, size: item.size, color: item.color, quantity: item.quantity, silent: true })
  })
  router.push('/cart')
}

function removeAndReturn(id: string) {
  const removed = orderStore.cancelOrder(id)
  if (removed) {
    order.value = orderStore.getById(id) ?? null
    cancelOpen.value = false
  }
}

const statusIcon = (status: OrderType['status']) =>
  status === 'delivered'
    ? 'check-circle'
    : status === 'shipped'
      ? 'package'
      : status === 'out-for-delivery'
        ? 'truck'
        : status === 'cancelled'
          ? 'close'
          : 'clock'
</script>

<template>
  <div>
    <button
      type="button"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/55 transition hover:text-charcoal"
      @click="router.push('/account/orders')"
    >
      <AppIcon name="arrow-left" :size="15" />
      All orders
    </button>

    <EmptyState
      v-if="!order"
      class="mt-8"
      icon="package"
      title="Order not found"
      description="We couldn't find this order in your account."
      action-label="Back to orders"
      @action="router.push('/account/orders')"
    />

    <template v-else>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl text-charcoal">{{ order.id }}</h1>
          <p class="mt-1 text-sm text-charcoal/50">
            Placed {{ formatDateTime(order.createdAt) }} ·
            {{ order.paymentMethod }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <BaseBadge :tone="statusTone(order.status)">{{ ORDER_STATUS_LABEL[order.status] }}</BaseBadge>
          <button
            v-if="order.status === 'processing'"
            type="button"
            class="rounded-full border border-clay/30 px-4 py-2 text-sm font-medium text-clay transition hover:bg-clay hover:text-white"
            @click="cancelOpen = true"
          >
            Cancel order
          </button>
        </div>
      </div>

      <!-- Tracking timeline -->
      <div class="mt-7 rounded-3xl border border-charcoal/8 bg-white p-6 sm:p-7">
        <div
          v-if="order.status === 'cancelled'"
          class="flex items-center gap-3 rounded-2xl bg-clay/10 p-4"
        >
          <AppIcon name="close-circle" :size="22" class="shrink-0 text-clay" />
          <p class="text-sm text-charcoal/70">
            This order was cancelled on <span class="font-semibold text-charcoal">{{ formatDate(order.tracking.cancelled) }}</span>.
            Any payment taken has been refunded.
          </p>
        </div>
        <template v-else>
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg text-charcoal">Order progress</h2>
            <span class="text-sm font-semibold text-gold">{{ Math.round(progress) }}%</span>
          </div>
          <div class="relative mt-6">
            <div class="absolute left-0 right-0 top-5 h-0.5 bg-charcoal/10" />
            <div
              class="absolute left-0 top-5 h-0.5 bg-charcoal transition-all duration-700"
              :style="{ width: `${progress}%` }"
            />
            <ol class="relative grid grid-cols-2 gap-4 sm:grid-cols-5">
              <li
                v-for="step in steps"
                :key="step.status"
                class="flex flex-col items-center text-center"
              >
                <span
                  :class="[
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition',
                    step.isDone
                      ? 'border-charcoal bg-charcoal text-bone'
                      : step.isCurrent
                        ? 'border-gold bg-white text-gold'
                        : 'border-charcoal/15 bg-white text-charcoal/35',
                  ]"
                >
                  <AppIcon :name="statusIcon(step.status)" :size="16" />
                </span>
                <p class="mt-2 text-xs font-semibold text-charcoal sm:text-[13px]">{{ step.label }}</p>
                <p class="mt-0.5 text-[10px] text-charcoal/45 sm:text-xs">
                  {{ step.date ? formatDate(step.date) : 'Pending' }}
                </p>
              </li>
            </ol>
          </div>
        </template>
      </div>

      <div class="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <!-- Items -->
        <div class="overflow-hidden rounded-3xl border border-charcoal/8 bg-white">
          <div class="border-b border-charcoal/8 px-6 py-4">
            <h2 class="font-display text-lg text-charcoal">Items ({{ order.items.length }})</h2>
          </div>
          <ul class="divide-y divide-charcoal/8">
            <li v-for="item in order.items" :key="item.productId + item.size" class="flex gap-4 p-5">
              <RouterLink :to="`/product/${item.productId}`" class="shrink-0 overflow-hidden rounded-2xl bg-beige/30">
                <img :src="item.image" :alt="item.name" loading="lazy" class="h-20 w-16 object-cover" />
              </RouterLink>
              <div class="min-w-0 flex-1">
                <RouterLink :to="`/product/${item.productId}`" class="block truncate text-sm font-semibold text-charcoal transition hover:text-gold">
                  {{ item.name }}
                </RouterLink>
                <p class="mt-0.5 text-xs text-charcoal/55">{{ item.color }} · Size {{ item.size }}</p>
                <p class="mt-1 text-xs text-charcoal/50">Qty {{ item.quantity }}</p>
              </div>
              <p class="text-sm font-semibold text-charcoal">{{ formatCurrency(item.price * item.quantity) }}</p>
            </li>
          </ul>
        </div>

        <div class="space-y-6">
          <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
            <h2 class="font-display text-lg text-charcoal">Order summary</h2>
            <dl class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between text-charcoal/65">
                <dt>Subtotal</dt>
                <dd class="font-medium text-charcoal">{{ formatCurrency(order.subtotal) }}</dd>
              </div>
              <div v-if="order.discount > 0" class="flex justify-between text-green-700">
                <dt>Discount {{ order.couponCode ? `(${order.couponCode})` : '' }}</dt>
                <dd class="font-medium">−{{ formatCurrency(order.discount) }}</dd>
              </div>
              <div class="flex justify-between text-charcoal/65">
                <dt>Shipping</dt>
                <dd class="font-medium text-charcoal">{{ order.shipping === 0 ? 'Free' : formatCurrency(order.shipping) }}</dd>
              </div>
              <div class="flex justify-between border-t border-charcoal/10 pt-2 text-base font-semibold text-charcoal">
                <dt>Total</dt>
                <dd>{{ formatCurrency(order.total) }}</dd>
              </div>
            </dl>
            <BaseButton variant="outline" class="mt-5 w-full" @click="reorder">
              <AppIcon name="refresh" :size="16" />
              Buy again
            </BaseButton>
          </div>

          <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
            <h2 class="font-display text-lg text-charcoal">Shipping to</h2>
            <p class="mt-3 text-sm leading-relaxed text-charcoal/70">
              {{ order.shippingAddress.fullName }}<br />
              {{ order.shippingAddress.line1 }}
              {{ order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : '' }}<br />
              {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.postalCode }}<br />
              {{ order.shippingAddress.country }}
            </p>
            <p class="mt-3 flex items-center gap-1.5 text-xs text-charcoal/50">
              <AppIcon name="phone" :size="13" />
              {{ order.shippingAddress.phone }}
            </p>
            <p class="mt-2 flex items-center gap-1.5 text-xs capitalize text-charcoal/50">
              <AppIcon name="truck" :size="13" />
              {{ order.deliveryMethod }} delivery
            </p>
          </div>
        </div>
      </div>

      <BaseModal
        :open="cancelOpen"
        title="Cancel this order?"
        subtitle="This action cannot be undone."
        size="sm"
        @close="cancelOpen = false"
      >
        <p class="text-sm leading-relaxed text-charcoal/65">
          Are you sure you want to cancel order <span class="font-semibold text-charcoal">{{ order.id }}</span>?
          A refund will be issued to your original payment method within 3–5 business days.
        </p>
        <div class="mt-6 flex gap-3">
          <BaseButton variant="outline" class="flex-1" @click="cancelOpen = false">Keep order</BaseButton>
          <BaseButton variant="danger" class="flex-1" @click="removeAndReturn(order.id)">Yes, cancel</BaseButton>
        </div>
      </BaseModal>
    </template>
  </div>
</template>