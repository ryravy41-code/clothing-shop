<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useToastStore } from '@/stores/toast'

const toasts = useToastStore()

type Q = { q: string; a: string }

const shipping: Q[] = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days and is free on orders over $150. Express delivery arrives in 1–2 business days for a flat $24.95.' },
  { q: 'Do you ship internationally?', a: 'Yes — we ship to 40+ countries including Canada, the UK, Australia and across Europe and Asia. Duties are calculated at checkout.' },
  { q: 'How do I track my order?', a: 'Use the Track your order page with your order number (like VST-48291), or open the order from your account dashboard for a live timeline.' },
]

const returns: Q[] = [
  { q: 'What is your return policy?', a: 'You have 30 days from delivery to return any unworn items in original condition. Returns are always free.' },
  { q: 'How do I start a return?', a: 'Log in, open the order in your account, and choose Return items. You will get a prepaid label within minutes.' },
  { q: 'When will I get my refund?', a: 'As soon as your return is scanned by the courier, we issue the refund. It lands in 3–5 business days depending on your bank.' },
]

const product: Q[] = [
  { q: 'How does sizing run?', a: 'Our garments are true to size and designed to sit on standard US sizing. Each product page includes a size guide; when in doubt, size up for a relaxed fit.' },
  { q: 'Can I exchange the size instead of returning?', a: 'Yes — exchanges ship free. Choose Exchange during the return flow and we will send the new size once the original is scanned.' },
  { q: 'Are your materials sustainable?', a: '80% of our collection uses organic or recycled fibres, and every factory is audited at least twice a year for fair-labour standards.' },
]

const account: Q[] = [
  { q: 'How do I reset my password?', a: 'Use the Forgot password link on the sign-in page. We will email a reset link (in this demo the password resets to reset1234).' },
  { q: 'Which payment methods do you accept?', a: 'All major cards, Apple Pay, Google Pay, PayPal, Klarna and our VESTE wallet. Card details are encrypted end to end.' },
  { q: 'Can I shop without an account?', a: 'Absolutely — checkout as a guest. Creating an account simply saves your details for faster future checkouts.' },
]

const grouped = [
  { icon: 'truck', title: 'Shipping & delivery', items: shipping },
  { icon: 'refresh', title: 'Returns & exchanges', items: returns },
  { icon: 'ruler', title: 'Product & sizing', items: product },
  { icon: 'user', title: 'Account & payments', items: account },
] as const

const active = ref<Record<string, number>>({})
function itemKey(group: string, idx: number) {
  return `${group}-${idx}`
}
function toggle(group: string, idx: number) {
  const key = itemKey(group, idx)
  active.value[key] = active.value[key] ? 0 : 1
}

const newsletter = ref('')
function subscribe() {
  if (!newsletter.value.trim()) return
  toasts.success('Subscribed', 'You are on the list.')
  newsletter.value = ''
}
</script>

<template>
  <div>
    <section class="bg-charcoal px-4 py-20 text-center text-bone">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Help center</p>
      <h1 class="mx-auto mt-4 font-display text-4xl">Frequently asked questions</h1>
      <p class="mx-auto mt-3 max-w-md text-bone/70">
        Answers to the things we get asked most. Still stuck? We're one message away.
      </p>
    </section>

    <section class="px-4 py-14">
      <div class="wrap grid gap-8 lg:grid-cols-2">
        <div
          v-for="group in grouped"
          :key="group.title"
          class="rounded-3xl border border-charcoal/8 bg-white p-6"
        >
          <h2 class="flex items-center gap-3 font-display text-xl text-charcoal">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-beige/60 text-gold">
              <AppIcon :name="group.icon" :size="17" />
            </span>
            {{ group.title }}
          </h2>
          <ul class="mt-4 divide-y divide-charcoal/8">
            <li v-for="(item, i) in group.items" :key="item.q">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 py-3 text-left"
                @click="toggle(group.title, i)"
              >
                <span class="text-sm font-semibold text-charcoal">{{ item.q }}</span>
                <AppIcon
                  name="chev-down"
                  :size="16"
                  class="shrink-0 text-charcoal/40 transition-transform duration-300"
                  :class="active[itemKey(group.title, i)] ? 'rotate-180' : ''"
                />
              </button>
              <p
                v-if="active[itemKey(group.title, i)]"
                class="pb-4 text-sm leading-relaxed text-charcoal/60"
              >
                {{ item.a }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="bg-bone/50 px-4 py-16">
      <div class="wrap flex flex-col items-center justify-between gap-6 rounded-3xl bg-charcoal p-8 text-bone sm:flex-row">
        <div>
          <h2 class="font-display text-2xl">Still have questions?</h2>
          <p class="mt-1 text-sm text-bone/65">Our team replies within 24 hours, 7 days a week.</p>
        </div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="w-64">
            <BaseInput
              v-model="newsletter"
              type="email"
              icon="mail"
              placeholder="your@email.com"
              :required="true"
            />
          </div>
          <button
            type="button"
            class="rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-light"
            @click="subscribe"
          >
            Subscribe to updates
          </button>
        </div>
      </div>
    </section>
  </div>
</template>