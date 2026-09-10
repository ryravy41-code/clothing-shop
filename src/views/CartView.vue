<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import CartItemRow from '@/components/cart/CartItemRow.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const cart = useCartStore()
const auth = useAuthStore()

const couponInput = ref('')
const couponFeedback = ref<{ ok: boolean; message: string } | null>(null)
const applied = computed(() => cart.appliedCoupon)

function handleCoupon() {
  const result = cart.applyCoupon(couponInput.value)
  couponFeedback.value = result
  if (result.ok) couponInput.value = ''
  setTimeout(() => (couponFeedback.value = null), 4000)
}

function removeCoupon() {
  cart.removeCoupon()
  couponFeedback.value = null
}
</script>

<template>
  <div class="wrap py-8 sm:py-10">
    <Breadcrumbs class="mb-6" :crumbs="[{ label: 'Shopping bag' }]" />
    <h1 class="font-display text-3xl text-charcoal sm:text-4xl">Shopping bag</h1>

    <EmptyState
      v-if="cart.items.length === 0"
      class="mt-8"
      icon="bag"
      title="Your bag is empty"
      description="Looks like you haven't added anything yet. Discover pieces you'll wear on repeat."
      action-label="Start shopping"
      @action="(cart.isOpen = true)"
    />

    <div v-else class="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div class="space-y-5">
        <div class="overflow-hidden rounded-3xl border border-charcoal/8 bg-white">
          <ul class="divide-y divide-charcoal/8">
            <li v-for="item in cart.items" :key="item.key" class="p-5 sm:p-6">
              <CartItemRow :item="item" :compact="false" />
            </li>
          </ul>
        </div>

        <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
          <p class="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal/70">Coupon code</p>
          <div v-if="!applied" class="mt-3 flex gap-2">
            <BaseInput
              v-model="couponInput"
              placeholder="e.g. WELCOME10"
              icon="tag"
              class="flex-1"
              aria-label="Coupon code"
            />
            <BaseButton variant="outline" @click="handleCoupon">Apply</BaseButton>
          </div>
          <div v-else class="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-gold/10 p-4">
            <span class="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <AppIcon name="tag" :size="16" class="text-gold" />
              {{ applied.code }} applied
            </span>
            <button type="button" class="text-xs font-semibold text-charcoal/50 underline-offset-2 hover:underline" @click="removeCoupon">
              Remove
            </button>
          </div>
          <p
            v-if="couponFeedback"
            class="mt-2 text-sm font-medium"
            :class="couponFeedback.ok ? 'text-green-700' : 'text-clay'"
          >
            {{ couponFeedback.message }}
          </p>
          <p class="mt-3 text-xs text-charcoal/45">
            Try <span class="font-semibold text-gold">WELCOME10</span>, <span class="font-semibold text-gold">SAVE20</span>, <span class="font-semibold text-gold">SHIPFREE</span> or <span class="font-semibold text-gold">SPRING15</span>.
          </p>
        </div>
      </div>

      <div class="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary />
        <RouterLink
          v-if="auth.isAuthenticated"
          :to="{ name: 'checkout' }"
          class="mt-4 block"
        >
          <BaseButton size="lg" class="w-full">
            Proceed to checkout
            <AppIcon name="arrow-right" :size="17" />
          </BaseButton>
        </RouterLink>
        <RouterLink v-else :to="{ name: 'login', query: { redirect: '/checkout' } }" class="mt-4 block">
          <BaseButton size="lg" class="w-full">
            Sign in to checkout
            <AppIcon name="arrow-right" :size="17" />
          </BaseButton>
        </RouterLink>
        <RouterLink
          to="/shop"
          class="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-charcoal/55 transition hover:text-charcoal"
        >
          <AppIcon name="arrow-left" :size="15" />
          Continue shopping
        </RouterLink>
      </div>
    </div>
  </div>
</template>