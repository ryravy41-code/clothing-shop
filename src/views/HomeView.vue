<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductRowSkeleton from '@/components/product/ProductRowSkeleton.vue'
import { useProductStore } from '@/stores/product'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import { CATEGORIES } from '@/data/categories'
import { useCountdown, endOfNext } from '@/composables/useCountdown'

const productStore = useProductStore()
const recently = useRecentlyViewedStore()

const countdownTarget = () => endOfNext('week')
const { parts } = useCountdown(countdownTarget)

const showNew = computed(() => productStore.newArrivals.slice(0, 4))
const showBest = computed(() => productStore.bestSellers.slice(0, 4))
const showFeatured = computed(() => productStore.featured.slice(0, 4))

const featuredCategoryCards = computed(() =>
  ['women', 'men', 'shoes', 'accessories'].map((id) => CATEGORIES.find((c) => c.id === id)!),
)

const PERKS = [
  { icon: 'truck', title: 'Free Shipping', text: 'On all orders over $150' },
  { icon: 'refresh', title: 'Easy Returns', text: '30-day hassle-free returns' },
  { icon: 'shield', title: 'Secure Checkout', text: 'Encrypted, card-safe payments' },
  { icon: 'sparkles', title: 'Quality First', text: 'Premium materials, crafted to last' },
]
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="relative overflow-hidden bg-charcoal text-bone">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
          alt="VESTE seasonal editorial"
          class="h-full w-full object-cover opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
      </div>
      <div class="wrap relative flex min-h-[520px] flex-col justify-center py-20 sm:min-h-[600px]">
        <p class="animate-fade-in text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          The Autumn–Winter Edit
        </p>
        <h1
          class="mt-4 max-w-2xl font-display text-4xl leading-[1.08] sm:text-6xl animate-fade-in"
          style="animation-delay: 60ms"
        >
          Wear the <em class="text-gold not-italic underline decoration-gold/40 underline-offset-8">season</em>,
          not the trend.
        </h1>
        <p
          class="mt-5 max-w-md text-sm leading-relaxed text-bone/70 sm:text-base animate-fade-in"
          style="animation-delay: 120ms"
        >
          Timeless tailoring, considered knitwear and finish-everything accessories — crafted in premium
          materials and made to live in your wardrobe for years.
        </p>
        <div class="mt-8 flex flex-wrap gap-3 animate-fade-in" style="animation-delay: 180ms">
          <RouterLink to="/category/men">
            <BaseButton size="lg" class="bg-white text-charcoal hover:bg-bone">
              Shop Men
            </BaseButton>
          </RouterLink>
          <RouterLink to="/category/women">
            <BaseButton size="lg" variant="outline" class="border-bone/40 text-bone hover:bg-bone/10 hover:border-bone">
              Shop Women
            </BaseButton>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- PERKS -->
    <section class="border-b border-charcoal/8 bg-white">
      <div class="wrap grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        <div v-for="perk in PERKS" :key="perk.title" class="flex items-center gap-3">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-beige/60 text-gold">
            <AppIcon :name="perk.icon" :size="20" />
          </span>
          <div>
            <p class="text-sm font-semibold text-charcoal">{{ perk.title }}</p>
            <p class="text-xs text-charcoal/50">{{ perk.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="wrap py-16 sm:py-20">
      <SectionHeader
        eyebrow="Collections"
        title="Shop by category"
        description="Six considered categories, one uncompromising standard of quality."
      />
      <div class="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        <RouterLink
          v-for="category in featuredCategoryCards"
          :key="category.id"
          :to="`/category/${category.id}`"
          class="group relative overflow-hidden rounded-3xl"
        >
          <div class="aspect-[3/4] overflow-hidden bg-beige/40">
            <img
              :src="category.image"
              :alt="category.label"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/75 via-transparent to-transparent p-5">
            <p class="font-display text-xl text-bone">{{ category.label }}</p>
            <p class="mt-0.5 text-xs text-bone/70">{{ category.tagline }}</p>
            <span class="mt-3 inline-flex w-fit items-center gap-1 text-xs font-semibold text-gold">
              Shop now
              <AppIcon name="arrow-right" :size="13" class="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- NEW ARRIVALS -->
    <section class="bg-sand/70 py-16 sm:py-20">
      <div class="wrap">
        <SectionHeader
          eyebrow="Just in"
          title="New arrivals"
          description="Fresh from the atelier — the pieces our stylists can't stop reaching for."
          link-label="View all new arrivals"
          link-to="/category/new-arrivals"
        />
        <div v-if="productStore.loading" class="mt-8">
          <ProductRowSkeleton :count="4" />
        </div>
        <div v-else class="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <ProductCard v-for="p in showNew" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <!-- PROMO BANNER + COUNTDOWN -->
    <section class="wrap py-16 sm:py-20">
      <div class="relative overflow-hidden rounded-[2rem] bg-ink text-bone">
        <div class="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80"
            alt="Seasonal sale"
            loading="lazy"
            class="h-full w-full object-cover opacity-30"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-ink/95 to-ink/40" />
        </div>
        <div class="relative grid gap-8 p-8 sm:p-14 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              <AppIcon name="percent" :size="15" />
              Season Sale · Up to 40% off
            </p>
            <h2 class="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              The countdown is on.
            </h2>
            <p class="mt-3 max-w-md text-sm leading-relaxed text-bone/70">
              Selected styles from the current and previous seasons — while stocks last. Enter
              <span class="font-semibold text-gold">SPRING15</span> at checkout for an extra 15%.
            </p>
            <RouterLink to="/category/sale" class="mt-7 inline-block">
              <BaseButton size="lg">
                Shop the sale
                <AppIcon name="arrow-right" :size="17" />
              </BaseButton>
            </RouterLink>
          </div>
          <div class="flex gap-3 sm:gap-4" role="timer" aria-label="Sale ends in">
            <div
              v-for="part in parts"
              :key="part.label"
              class="flex-1 rounded-2xl border border-bone/15 bg-bone/5 p-4 text-center backdrop-blur"
            >
              <p class="font-display text-3xl text-gold sm:text-4xl">
                {{ String(part.value).padStart(2, '0') }}
              </p>
              <p class="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone/50">
                {{ part.label }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BEST SELLERS -->
    <section class="wrap pb-16 sm:pb-20">
      <SectionHeader
        eyebrow="Most loved"
        title="Best sellers"
        description="Proven favourites, tens of thousands of times over."
        link-label="Shop all"
        link-to="/shop?sort=popular"
      />
      <div v-if="productStore.loading" class="mt-8">
        <ProductRowSkeleton :count="4" />
      </div>
      <div v-else class="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <ProductCard v-for="p in showBest" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- FEATURED EDIT -->
    <section class="bg-sand/70 py-16 sm:py-20">
      <div class="wrap">
        <SectionHeader
          eyebrow="Editor's pick"
          title="The featured edit"
          description="A curated shortlist of the season's defining pieces."
          link-label="Browse everything"
          link-to="/shop"
        />
        <div v-if="productStore.loading" class="mt-8">
          <ProductRowSkeleton :count="4" />
        </div>
        <div v-else class="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <ProductCard v-for="p in showFeatured" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <!-- RECENTLY VIEWED -->
    <section v-if="recently.products.length" class="wrap py-16 sm:py-20">
      <SectionHeader
        eyebrow="Pick up where you left off"
        title="Recently viewed"
        link-label="Clear history"
        link-to="/shop"
      />
      <div class="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <ProductCard v-for="p in recently.products.slice(0, 4)" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- MARQUEE STRIP -->
    <section class="overflow-hidden border-y border-charcoal/8 bg-white py-4">
      <div class="flex w-max animate-marquee gap-10 whitespace-nowrap">
        <span
          v-for="n in 2"
          :key="n"
          class="flex items-center gap-10 text-sm font-medium uppercase tracking-[0.22em] text-charcoal/45"
        >
          <span>Free shipping over $150</span>
          <span class="text-gold">✦</span>
          <span>Ethically made</span>
          <span class="text-gold">✦</span>
          <span>30-day returns</span>
          <span class="text-gold">✦</span>
          <span>WELCOME10 for 10% off</span>
          <span class="text-gold">✦</span>
        </span>
      </div>
    </section>
  </div>
</template>