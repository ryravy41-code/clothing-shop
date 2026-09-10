<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import CheckoutSteps from '@/components/checkout/CheckoutSteps.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import { useCartStore, shippingFor } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { validate, RULES } from '@/composables/useValidation'
import type { DeliveryMethod, OrderItem, PaymentMethodType, ShippingAddress } from '@/types'

const router = useRouter()
const cart = useCartStore()
const orderStore = useOrderStore()
const auth = useAuthStore()
const toasts = useToastStore()

const steps = [
  { id: 'info', label: 'Information', icon: 'user' },
  { id: 'delivery', label: 'Delivery', icon: 'truck' },
  { id: 'payment', label: 'Payment', icon: 'credit-card' },
  { id: 'review', label: 'Review', icon: 'check' },
]

const current = ref(0)
const processing = ref(false)
const addressModal = ref(false)

const contact = ref({
  email: auth.currentUser?.email ?? '',
  phone: auth.currentUser?.phone ?? '',
})

const errors = ref<Record<string, string>>({})

const selectedAddressId = ref<string>(auth.address?.id ?? '')

const newAddress = ref({
  fullName: auth.fullName,
  phone: auth.currentUser?.phone ?? '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
})

const deliveryMethod = ref<DeliveryMethod>('standard')
const paymentMethod = ref<PaymentMethodType>('card')

const card = ref({
  number: '',
  name: auth.fullName,
  expMonth: '',
  expYear: '',
  cvc: '',
})

const orderItems = computed<OrderItem[]>(() =>
  cart.items.map((i) => ({
    productId: i.productId,
    name: i.name,
    image: i.image,
    price: i.price,
    quantity: i.quantity,
    size: i.size,
    color: i.color,
  })),
)

const selectedAddress = computed<ShippingAddress | null>(() => {
  const found = auth.currentUser?.addresses.find((a) => a.id === selectedAddressId.value)
  return found ?? auth.currentUser?.addresses[0] ?? null
})

const shippingCost = computed(() =>
  cart.appliedCoupon?.type === 'shipping'
    ? 0
    : shippingFor(cart.subtotal, deliveryMethod.value),
)

const orderTotal = computed(() => cart.grandTotal + shippingCost.value)

watch(
  () => cart.items.length,
  (n) => {
    if (n === 0 && current.value > 3) {
      void router.replace({ name: 'cart' })
    }
  },
)

function canContinue() {
  if (current.value === 0) {
    const result = validate(
      { email: contact.value.email, phone: contact.value.phone },
      {
        email: [RULES.required('Email is required.'), RULES.email()],
        phone: [RULES.required('Phone is required.'), RULES.phone()],
      },
    )
    errors.value = result.errors
    if (!result.valid) return false
    if (!selectedAddress.value) {
      errors.value.line1 = 'Please add a shipping address.'
      return false
    }
    return true
  }
  if (current.value === 1) return true
  if (current.value === 2) {
    if (paymentMethod.value === 'card') {
      const result = validate(
        {
          number: card.value.number,
          name: card.value.name,
          expMonth: card.value.expMonth,
          expYear: card.value.expYear,
          cvc: card.value.cvc,
        },
        {
          number: [RULES.required('Card number is required.'), RULES.cardNumber()],
          name: [RULES.required('Name on card is required.')],
          expMonth: [RULES.required('Month is required.')],
          expYear: [RULES.required('Year is required.')],
          cvc: [RULES.required('CVC is required.'), RULES.cvc()],
        },
      )
      errors.value = result.errors
      return result.valid
    }
    return true
  }
  return true
}

function next() {
  if (!canContinue()) return
  current.value += 1
}

function addAddress() {
  const result = validate(
    { fullName: newAddress.value.fullName, phone: newAddress.value.phone, line1: newAddress.value.line1, city: newAddress.value.city, state: newAddress.value.state, postalCode: newAddress.value.postalCode },
    {
      fullName: [RULES.required('Full name is required.')],
      phone: [RULES.required('Phone is required.'), RULES.phone()],
      line1: [RULES.required('Address is required.')],
      city: [RULES.required('City is required.')],
      state: [RULES.required('State is required.')],
      postalCode: [RULES.required('Postal code is required.'), RULES.zip()],
    },
  )
  errors.value = result.errors
  if (!result.valid) return
  const created = auth.addAddress({
    fullName: newAddress.value.fullName,
    phone: newAddress.value.phone,
    line1: newAddress.value.line1,
    line2: newAddress.value.line2 || undefined,
    city: newAddress.value.city,
    state: newAddress.value.state,
    postalCode: newAddress.value.postalCode,
    country: newAddress.value.country,
    isDefault: auth.currentUser?.addresses.length === 0,
  })
  selectedAddressId.value = created.id
  addressModal.value = false
  newAddress.value.line1 = ''
  newAddress.value.line2 = ''
  newAddress.value.city = ''
  newAddress.value.state = ''
  newAddress.value.postalCode = ''
}

const cardBrand = computed(() => {
  const cleaned = card.value.number.replace(/\s/g, '')
  if (cleaned.startsWith('4')) return 'Visa'
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard'
  if (/^3[47]/.test(cleaned)) return 'Amex'
  if (cleaned.length >= 4) return 'Card'
  return 'Card'
})

function formatCardNumber(v: string) {
  const cleaned = v.replace(/\D/g, '').slice(0, 19)
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
}

async function placeOrder() {
  if (!selectedAddress.value) {
    toasts.error('Missing address', 'Please add a shipping address.')
    return
  }
  processing.value = true
  try {
    const order = await orderStore.placeOrder({
      items: orderItems.value,
      subtotal: cart.subtotal,
      shipping: shippingCost.value,
      discount: cart.discountAmount,
      couponCode: cart.appliedCoupon?.code,
      deliveryMethod: deliveryMethod.value,
      paymentMethod:
        paymentMethod.value === 'card'
          ? `${cardBrand.value} •••• ${card.value.number.replace(/\s/g, '').slice(-4)}`
          : paymentMethod.value === 'cod'
            ? 'Cash on delivery'
            : 'Digital wallet',
      shippingAddress: selectedAddress.value,
    })
    cart.clear()
    toasts.success('Order placed', `${order.id} is being prepared.`)
    await router.push({ name: 'order-success', query: { id: order.id } })
  } catch (e) {
    toasts.error('Payment failed', e instanceof Error ? e.message : 'Please try again.')
  } finally {
    processing.value = false
  }
}

function formatMoney(v: number) {
  return `$${v.toFixed(v % 1 ? 2 : 0)}`
}
</script>

<template>
  <div class="wrap py-8 sm:py-10">
    <RouterLink to="/cart" class="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/55 transition hover:text-charcoal">
      <AppIcon name="arrow-left" :size="15" />
      Back to bag
    </RouterLink>
    <h1 class="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Checkout</h1>

    <div class="mt-8">
      <CheckoutSteps :steps="steps" :current="current" />
    </div>

    <div class="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <!-- STEP 0 : INFORMATION -->
        <section v-if="current === 0">
          <h2 class="font-display text-xl text-charcoal">Contact & shipping</h2>
          <div class="mt-5 space-y-4 rounded-3xl border border-charcoal/8 bg-white p-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <BaseInput v-model="contact.email" label="Email" type="email" icon="mail" :required="true" :error="errors.email" autocomplete="email" />
              <BaseInput v-model="contact.phone" label="Phone" type="tel" icon="phone" :required="true" :error="errors.phone" autocomplete="tel" />
            </div>

            <div class="border-t border-charcoal/8 pt-5">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal/60">Shipping address</p>
                <button type="button" class="text-sm font-semibold text-gold transition hover:text-gold-dark" @click="addressModal = true">
                  + Add address
                </button>
              </div>

              <div v-if="auth.currentUser?.addresses.length" class="mt-4 grid gap-3 sm:grid-cols-2">
                <label
                  v-for="address in auth.currentUser.addresses"
                  :key="address.id"
                  class="relative cursor-pointer rounded-2xl border-2 p-4 transition"
                  :class="selectedAddressId === address.id ? 'border-charcoal bg-bone/60' : 'border-charcoal/10 hover:border-charcoal/30'"
                >
                  <input type="radio" :checked="selectedAddressId === address.id" name="address" class="sr-only" @change="selectedAddressId = address.id" />
                  <span class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-charcoal">{{ address.fullName }}</span>
                    <span v-if="address.isDefault" class="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">Default</span>
                  </span>
                  <span class="mt-1.5 block text-xs leading-relaxed text-charcoal/60">
                    {{ address.line1 }}{{ address.line2 ? ', ' + address.line2 : '' }}<br />
                    {{ address.city }}, {{ address.state }} {{ address.postalCode }}<br />
                    {{ address.country }}
                  </span>
                </label>
              </div>
              <p v-else class="mt-4 rounded-2xl border border-dashed border-charcoal/15 p-4 text-sm text-charcoal/55">
                No saved addresses yet — add one to continue.
              </p>
              <p v-if="errors.line1" class="mt-2 text-xs font-medium text-clay">{{ errors.line1 }}</p>
            </div>
          </div>
        </section>

        <!-- STEP 1 : DELIVERY -->
        <section v-if="current === 1">
          <h2 class="font-display text-xl text-charcoal">Delivery method</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              class="rounded-3xl border-2 p-6 text-left transition"
              :class="deliveryMethod === 'standard' ? 'border-charcoal bg-bone/60 shadow-lg shadow-charcoal/5' : 'border-charcoal/10 hover:border-charcoal/30'"
              @click="deliveryMethod = 'standard'"
            >
              <AppIcon name="truck" :size="24" class="text-gold" />
              <p class="mt-3 font-display text-lg text-charcoal">Standard</p>
              <p class="mt-1 text-sm text-charcoal/55">3–5 business days</p>
              <p class="mt-2 text-sm font-semibold text-charcoal">
                {{ cart.subtotal >= 150 ? 'Free' : formatMoney(shippingFor(cart.subtotal, 'standard')) }}
              </p>
            </button>
            <button
              type="button"
              class="rounded-3xl border-2 p-6 text-left transition"
              :class="deliveryMethod === 'express' ? 'border-charcoal bg-bone/60 shadow-lg shadow-charcoal/5' : 'border-charcoal/10 hover:border-charcoal/30'"
              @click="deliveryMethod = 'express'"
            >
              <AppIcon name="clock" :size="24" class="text-gold" />
              <p class="mt-3 font-display text-lg text-charcoal">Express</p>
              <p class="mt-1 text-sm text-charcoal/55">1–2 business days</p>
              <p class="mt-2 text-sm font-semibold text-charcoal">{{ formatMoney(shippingFor(cart.subtotal, 'express')) }}</p>
            </button>
          </div>
          <p class="mt-4 flex items-center gap-2 text-sm text-charcoal/55">
            <AppIcon name="info" :size="16" class="text-gold" />
            Standard shipping is free on orders over $150. Express is flat rate.
          </p>
        </section>

        <!-- STEP 2 : PAYMENT -->
        <section v-if="current === 2">
          <h2 class="font-display text-xl text-charcoal">Payment</h2>

          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <button
              v-for="method in [
                { id: 'card', label: 'Card', icon: 'credit-card' },
                { id: 'wallet', label: 'Digital wallet', icon: 'wallet' },
                { id: 'cod', label: 'Cash on delivery', icon: 'package' },
              ] as const"
              :key="method.id"
              type="button"
              class="rounded-2xl border-2 p-4 text-center transition"
              :class="paymentMethod === method.id ? 'border-charcoal bg-bone/60' : 'border-charcoal/10 hover:border-charcoal/30'"
              @click="paymentMethod = method.id"
            >
              <AppIcon :name="method.icon" :size="22" class="mx-auto text-gold" />
              <p class="mt-2 text-sm font-semibold text-charcoal">{{ method.label }}</p>
            </button>
          </div>

          <form v-if="paymentMethod === 'card'" class="mt-5 space-y-1 rounded-3xl border border-charcoal/8 bg-white p-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-charcoal">Card details</p>
              <span class="flex items-center gap-1 text-xs text-charcoal/50">
                <AppIcon name="shield" :size="14" class="text-gold" />
                Encrypted · stored locally only
              </span>
            </div>
            <div class="mt-4 grid gap-4">
              <BaseInput
                v-model="card.number"
                label="Card number"
                placeholder="4242 4242 4242 4242"
                :error="errors.number"
                @update:model-value="(v: string) => (card.number = formatCardNumber(v))"
              />
              <BaseInput v-model="card.name" label="Name on card" placeholder="Full name" :error="errors.name" />
              <div class="grid grid-cols-3 gap-4">
                <BaseInput v-model="card.expMonth" label="Month" placeholder="MM" :maxlength="2" :error="errors.expMonth" />
                <BaseInput v-model="card.expYear" label="Year" placeholder="YY" :maxlength="2" :error="errors.expYear" />
                <BaseInput v-model="card.cvc" label="CVC" placeholder="123" :maxlength="3" inputmode="numeric" :error="errors.cvc" />
              </div>
            </div>
          </form>

          <div v-else class="mt-5 rounded-3xl border border-charcoal/8 bg-white p-6 text-sm text-charcoal/60">
            <p v-if="paymentMethod === 'wallet'" class="flex items-center gap-2">
              <AppIcon name="wallet" :size="18" class="text-gold" />
              You'll be redirected to your digital wallet to approve the payment (mock, no charge).
            </p>
            <p v-else class="flex items-center gap-2">
              <AppIcon name="package" :size="18" class="text-gold" />
              Pay in cash when your order arrives.
            </p>
          </div>
        </section>

        <!-- STEP 3 : REVIEW -->
        <section v-if="current === 3">
          <h2 class="font-display text-xl text-charcoal">Review your order</h2>
          <div class="mt-5 space-y-5 rounded-3xl border border-charcoal/8 bg-white p-6">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/50">Contact</p>
              <div class="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-charcoal">
                <span>{{ contact.email }}</span>
                <span class="text-charcoal/40">·</span>
                <span>{{ contact.phone }}</span>
              </div>
            </div>
            <div class="border-t border-charcoal/8 pt-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/50">Ship to</p>
              <p v-if="selectedAddress" class="mt-2 text-sm leading-relaxed text-charcoal">
                {{ selectedAddress.fullName }}, {{ selectedAddress.line1 }}
                {{ selectedAddress.line2 ? ', ' + selectedAddress.line2 : '' }},
                {{ selectedAddress.city }}, {{ selectedAddress.state }} {{ selectedAddress.postalCode }},
                {{ selectedAddress.country }}
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-charcoal/8 pt-4 text-sm text-charcoal">
              <span class="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/50">Delivery</span>
              <span class="capitalize">{{ deliveryMethod }}</span>
              <span class="text-charcoal/40">·</span>
              <span>To {{ selectedAddress?.city ?? 'your address' }}</span>
              <span class="text-charcoal/40">·</span>
              <span>{{ shippingCost === 0 ? 'Free' : formatMoney(shippingCost) }}</span>
            </div>
            <div class="border-t border-charcoal/8 pt-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/50">Payment</p>
              <p class="mt-2 flex items-center gap-2 text-sm text-charcoal">
                <AppIcon
                  :name="paymentMethod === 'card' ? 'credit-card' : paymentMethod === 'wallet' ? 'wallet' : 'package'"
                  :size="17"
                  class="text-gold"
                />
                {{ paymentMethod === 'card' ? `${cardBrand} •••• ${card.number.replace(/\s/g, '').slice(-4)}` : null }}
                <template v-if="paymentMethod === 'card'">exp {{ card.expMonth }}/{{ card.expYear }}</template>
                <template v-else-if="paymentMethod === 'wallet'">Digital wallet</template>
                <template v-else>Cash on delivery</template>
              </p>
            </div>
            <div class="border-t border-charcoal/8 pt-4 text-sm text-charcoal/60">
              <p class="flex items-center gap-2">
                <AppIcon name="check-circle" :size="16" class="text-green-600" />
                By placing this order you agree to VESTE's terms & shipping policy. No real payment is processed.
              </p>
            </div>
          </div>
        </section>

        <div class="mt-8 flex items-center justify-between gap-4">
          <button
            v-if="current > 0"
            type="button"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal/60 transition hover:text-charcoal"
            @click="current--"
          >
            <AppIcon name="arrow-left" :size="16" />
            Back
          </button>
          <span v-else />
          <div v-if="current < 3" class="flex gap-3">
            <BaseButton variant="outline" @click="current = 0">Start over</BaseButton>
            <BaseButton size="lg" @click="next">
              Continue
              <AppIcon name="arrow-right" :size="17" />
            </BaseButton>
          </div>
          <BaseButton
            v-else
            size="lg"
            variant="gold"
            :loading="processing"
            @click="placeOrder"
          >
            <AppIcon name="lock" :size="17" />
            Place order · {{ formatMoney(orderTotal) }}
          </BaseButton>
        </div>
      </div>

      <div class="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary :shipping="shippingCost" />
      </div>
    </div>

    <BaseModal :open="addressModal" title="Add a shipping address" subtitle="We'll save it to your account." size="md" @close="addressModal = false">
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="addAddress">
        <BaseInput v-model="newAddress.fullName" label="Full name" :required="true" :error="errors.fullName" />
        <BaseInput v-model="newAddress.phone" label="Phone" type="tel" :required="true" :error="errors.phone" />
        <div class="sm:col-span-2">
          <BaseInput v-model="newAddress.line1" label="Street address" :required="true" :error="errors.line1" />
        </div>
        <div class="sm:col-span-2">
          <BaseInput v-model="newAddress.line2" label="Apartment, suite (optional)" />
        </div>
        <BaseInput v-model="newAddress.city" label="City" :required="true" :error="errors.city" />
        <BaseInput v-model="newAddress.state" label="State / Province" :required="true" :error="errors.state" />
        <BaseInput v-model="newAddress.postalCode" label="Postal code" :required="true" :error="errors.postalCode" />
        <BaseInput v-model="newAddress.country" label="Country" />
        <BaseButton type="submit" class="sm:col-span-2" block>Save address</BaseButton>
      </form>
    </BaseModal>

    <!-- Processing overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="processing" class="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-ink/70 backdrop-blur-sm">
          <div class="h-14 w-14 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p class="mt-5 font-display text-lg text-bone">Processing payment…</p>
          <p class="mt-1 text-sm text-bone/60">Please don't close this window — we're confirming your order.</p>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>