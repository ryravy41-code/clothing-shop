<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useOrderStore } from '@/stores/order'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const query = ref('')
const submitted = ref(false)

watch(
  () => route.query.id,
  (id) => {
    if (typeof id === 'string' && id.trim()) {
      query.value = id
      orderStore.loadOrders('u-demo')
      submitted.value = true
    }
  },
  { immediate: true },
)

const order = computed(() => (submitted.value ? orderStore.getById(query.value.trim()) ?? null : null))
const steps = computed(() => (order.value ? orderStore.trackSteps(order.value) : []))

const statusIcon = (status: string) =>
  status === 'delivered'
    ? 'check-circle'
    : status === 'shipped'
      ? 'package'
      : status === 'out-for-delivery'
        ? 'truck'
        : status === 'cancelled'
          ? 'close'
          : 'clock'

function submit() {
  if (!query.value.trim()) return
  submitted.value = true
  orderStore.loadOrders('u-demo')
  router.replace({ query: { id: query.value.trim() } })
}
</script>

<template>
  <div class="mx-auto w-full max-w-2xl px-4 py-16">
    <div class="text-center">
      <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-beige/60 text-gold">
        <AppIcon name="truck" :size="30" />
      </span>
      <h1 class="mt-4 font-display text-3xl text-charcoal">Track your order</h1>
      <p class="mx-auto mt-2 max-w-md text-sm text-charcoal/55">
        Enter your order number (e.g. <span class="font-semibold text-charcoal">VST-48291</span>) to see live delivery updates.
      </p>
    </div>

    <form class="mt-7 flex flex-col gap-3 sm:flex-row" @submit.prevent="submit">
      <div class="flex-1">
        <BaseInput
          v-model="query"
          placeholder="Order number, e.g. VST-48291"
          icon="package"
          :required="true"
          autocomplete="off"
        />
      </div>
      <BaseButton type="submit" size="lg" class="sm:w-auto">
        <AppIcon name="search" :size="16" />
        Track order
      </BaseButton>
    </form>

    <EmptyState
      v-if="submitted && !order"
      class="mt-8"
      icon="package"
      title="Order not found"
      description="Double-check the order number and try again."
      action-label="Try another order"
      @action="submitted = false; router.replace({ query: {} })"
    />

    <div v-else-if="order" class="mt-8 overflow-hidden rounded-3xl border border-charcoal/8 bg-white">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/8 bg-bone/60 px-6 py-4">
        <div>
          <p class="font-mono text-sm font-bold text-charcoal">{{ order.id }}</p>
          <p class="text-xs text-charcoal/50">
            Placed {{ formatDate(order.createdAt) }} · {{ order.deliveryMethod }} delivery
          </p>
        </div>
        <span class="text-xs font-semibold uppercase tracking-wide text-gold">{{ order.status }}</span>
      </div>

      <div v-if="order.status === 'cancelled'" class="flex items-center gap-3 px-6 py-5">
        <AppIcon name="close-circle" :size="22" class="shrink-0 text-clay" />
        <p class="text-sm text-charcoal/70">This order was cancelled and any payment has been refunded.</p>
      </div>

      <ol v-else class="space-y-0 px-6 py-6">
        <li
          v-for="(step, i) in steps"
          :key="step.status"
          class="relative flex gap-4 pb-7 last:pb-0"
        >
          <template v-if="i < steps.length - 1">
            <span
              :class="[
                'absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5',
                step.isDone ? 'bg-charcoal' : 'bg-charcoal/10',
              ]"
            />
          </template>
          <span
            :class="[
              'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
              step.isDone
                ? 'border-charcoal bg-charcoal text-bone'
                : step.isCurrent
                  ? 'border-gold bg-white text-gold'
                  : 'border-charcoal/15 bg-white text-charcoal/35',
            ]"
          >
            <AppIcon :name="statusIcon(step.status)" :size="14" />
          </span>
          <div class="flex-1 pt-1">
            <p class="text-sm font-semibold text-charcoal">{{ step.label }}</p>
            <p class="mt-0.5 text-xs text-charcoal/50">
              {{ step.date ? formatDate(step.date) : 'Awaiting update' }}
            </p>
          </div>
          <AppIcon
            v-if="step.isCurrent"
            name="chev-right"
            :size="14"
            class="self-center text-gold"
          />
        </li>
      </ol>

      <div class="border-t border-charcoal/8 px-6 py-4 text-center">
        <span class="text-xs text-charcoal/45">Need help with this order?</span>
        <RouterLink to="/contact" class="ml-1.5 text-xs font-semibold text-gold hover:text-gold-dark">Contact us</RouterLink>
      </div>
    </div>

    <p v-else class="mt-8 text-center text-sm text-charcoal/45">
      Tip: any of the demo orders in your account (e.g. <span class="font-semibold">VST-51106</span>) can be tracked here.
    </p>
  </div>
</template>