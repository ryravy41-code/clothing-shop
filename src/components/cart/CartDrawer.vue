<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CartItemRow from './CartItemRow.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/utils/format'

const cart = useCartStore()
const router = useRouter()

const freeShippingProgress = computed(() => {
  if (cart.subtotal >= 150) return 100
  return Math.min(100, (cart.subtotal / 150) * 100)
})

const remainingForFree = computed(() => Math.max(0, 150 - cart.subtotal))

function goCheckout() {
  cart.isOpen = false
  void router.push('/checkout')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="cart.isOpen"
        class="fixed inset-0 z-[85]"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade" @click="cart.isOpen = false" />
        <aside
          class="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bone shadow-2xl animate-slide-in-right"
        >
          <div class="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
            <h2 class="flex items-center gap-2 font-display text-lg text-charcoal">
              Your bag
              <span v-if="cart.itemCount > 0" class="rounded-full bg-charcoal/8 px-2 py-0.5 text-xs font-semibold">
                {{ cart.itemCount }}
              </span>
            </h2>
            <button type="button" class="btn-icon" aria-label="Close bag" @click="cart.isOpen = false">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div v-if="cart.items.length === 0" class="flex-1 overflow-y-auto px-6 py-8">
            <EmptyState
              icon="bag"
              title="Your bag is empty"
              description="Discover premium pieces crafted to last — from tailored essentials to statement silhouettes."
              action-label="Start shopping"
              @action="
                cart.isOpen = false;
                $router.push('/shop')
              "
            />
          </div>

          <div v-else class="flex-1 overflow-y-auto px-6 py-5">
            <div class="rounded-2xl border border-charcoal/8 bg-white p-4">
              <p v-if="remainingForFree > 0" class="flex items-center gap-2 text-sm text-charcoal/70">
                <AppIcon name="truck" :size="18" class="text-gold" />
                Add <strong class="text-charcoal">{{ formatCurrency(remainingForFree) }}</strong> for free shipping
              </p>
              <p v-else class="flex items-center gap-2 text-sm font-medium text-green-700">
                <AppIcon name="check-circle" :size="18" />
                You unlocked free shipping!
              </p>
              <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-charcoal/8">
                <div
                  class="h-full rounded-full bg-gold transition-all duration-500"
                  :style="{ width: `${freeShippingProgress}%` }"
                />
              </div>
            </div>

            <RouterLink
              v-if="cart.recentlyAdded"
              :to="`/product/${cart.recentlyAdded.productId}`"
              class="mt-4 flex items-center gap-3 rounded-2xl bg-gold/10 p-3 transition hover:bg-gold/20"
            >
              <AppIcon name="plus" :size="16" class="shrink-0 text-gold" />
              <span class="text-xs text-charcoal/70">
                Just added: <strong class="text-charcoal">{{ cart.recentlyAdded.name }}</strong>
              </span>
            </RouterLink>

            <ul class="mt-4 divide-y divide-charcoal/8">
              <li v-for="item in cart.items" :key="item.key" class="py-4 first:pt-0">
                <CartItemRow :item="item" />
              </li>
            </ul>
          </div>

          <div v-if="cart.items.length > 0" class="border-t border-charcoal/10 bg-white px-6 py-5">
            <dl class="space-y-1.5 text-sm">
              <div class="flex justify-between text-charcoal/60">
                <dt>Subtotal</dt>
                <dd class="font-medium text-charcoal">{{ formatCurrency(cart.subtotal) }}</dd>
              </div>
              <div v-if="cart.discountAmount > 0" class="flex justify-between text-green-700">
                <dt>Discount {{ cart.appliedCoupon ? `(${cart.appliedCoupon.code})` : '' }}</dt>
                <dd class="font-medium">−{{ formatCurrency(cart.discountAmount) }}</dd>
              </div>
              <div class="flex justify-between text-charcoal/60">
                <dt>Shipping</dt>
                <dd class="font-medium text-charcoal">
                  {{ cart.shipping === 0 ? 'Free' : formatCurrency(cart.shipping) }}
                </dd>
              </div>
              <div class="flex justify-between border-t border-charcoal/10 pt-2 text-base font-semibold text-charcoal">
                <dt>Total</dt>
                <dd>{{ formatCurrency(cart.total) }}</dd>
              </div>
            </dl>
            <BaseButton class="mt-4 w-full" size="lg" @click="goCheckout">
              Checkout
              <AppIcon name="arrow-right" :size="17" />
            </BaseButton>
            <button
              type="button"
              class="mt-3 w-full text-center text-sm font-medium text-charcoal/60 transition hover:text-charcoal"
              @click="cart.isOpen = false"
            >
              Continue shopping
            </button>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.animate-slide-in-right {
  animation: slide-in-right 0.36s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>