<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const values = [
  { icon: 'leaf', title: 'Sustainable materials', body: 'Organic cottons, recycled polyamide and responsibly sourced leather across every collection.' },
  { icon: 'truck', title: 'Free returns, always', body: 'Changed your mind? Every order ships free and returns within 30 days are on us.' },
  { icon: 'headphones', title: 'Expert styling advice', body: 'Real humans, 7 days a week, ready to help you build looks you will love.' },
  { icon: 'shield', title: 'Secure checkout', body: 'Encrypted payments, verified sellers and purchase protection on every single order.' },
]

const story = [
  {
    year: '2018',
    title: 'A small atelier',
    body: 'VESTE started as a two-person studio in San Francisco, obsessing over the fit of a single t-shirt. That shirt still sells out every season.',
  },
  {
    year: '2021',
    title: 'Going direct',
    body: 'We moved fully direct-to-consumer, cutting out the middlemen so we could invest in better fabrics and fair wages.',
  },
  {
    year: '2024',
    title: 'A global wardrobe',
    body: 'Today VESTE ships to 40+ countries with a team of 120 across design and logistics — but every piece is still hand-checked before it leaves.',
  },
  {
    year: '2026',
    title: 'The next chapter',
    body: 'We are building a circular wardrobe: resale, repairs and carbon-neutral delivery for every single order.',
  },
]

const leaders = [
  { name: 'Maya Chen', role: 'Founder & Creative Director', initials: 'MC' },
  { name: 'Noah Williams', role: 'Head of Design', initials: 'NW' },
  { name: 'Sofia Rossi', role: 'Sourcing & Sustainability', initials: 'SR' },
  { name: 'Elias Brooks', role: 'Customer Experience', initials: 'EB' },
]
</script>

<template>
  <div>
    <section class="bg-charcoal px-4 py-24 text-center text-bone">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our story</p>
      <h1 class="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        Clothes should fit the way you live
      </h1>
      <p class="mx-auto mt-5 max-w-xl text-bone/70">
        VESTE is a women's and men's wardrobe built on honest materials, considered design and an
        unhealthy attention to how things feel on the body.
      </p>
    </section>

    <section class="px-4 py-16">
      <div class="wrap grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="v in values"
          :key="v.title"
          class="rounded-3xl border border-charcoal/8 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-charcoal/5"
        >
          <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-beige/60 text-gold">
            <AppIcon :name="v.icon" :size="22" />
          </span>
          <h3 class="mt-4 font-display text-lg text-charcoal">{{ v.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-charcoal/60">{{ v.body }}</p>
        </div>
      </div>
    </section>

    <section class="bg-bone/50 px-4 py-16">
      <div class="wrap">
        <div class="max-w-xl">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Timeline</p>
          <h2 class="mt-2 font-display text-3xl text-charcoal">How we got here</h2>
        </div>
        <div class="mt-10 grid gap-10 lg:grid-cols-2">
          <div
            v-for="(s, i) in story"
            :key="s.year"
            class="relative flex gap-5"
          >
            <div class="flex flex-col items-center">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-charcoal/15 bg-white font-display text-sm text-charcoal">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span v-if="i < story.length - 1" class="w-0.5 flex-1 bg-charcoal/10" />
            </div>
            <div class="pb-2">
              <p class="font-mono text-sm text-gold">{{ s.year }}</p>
              <h3 class="font-display text-xl text-charcoal">{{ s.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-charcoal/60">{{ s.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 py-16">
      <div class="wrap">
        <div class="max-w-xl">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold">The team</p>
          <h2 class="mt-2 font-display text-3xl text-charcoal">The people behind the pieces</h2>
        </div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="p in leaders"
            :key="p.name"
            class="rounded-3xl border border-charcoal/8 bg-white p-6 text-center"
          >
            <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-charcoal font-display text-lg text-bone">
              {{ p.initials }}
            </span>
            <h3 class="mt-4 font-semibold text-charcoal">{{ p.name }}</h3>
            <p class="mt-1 text-xs text-charcoal/50">{{ p.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-charcoal px-4 py-20 text-center text-bone">
      <h2 class="mx-auto max-w-xl font-display text-3xl">Design that lasts, prices that don't scare you</h2>
      <p class="mx-auto mt-4 max-w-md text-bone/70">Join 250,000+ people building a smarter wardrobe.</p>
      <RouterLink to="/shop" class="mt-7 inline-block">
        <BaseButton size="lg">
          <AppIcon name="bag-plus" :size="17" />
          Shop the collection
        </BaseButton>
      </RouterLink>
    </section>
  </div>
</template>