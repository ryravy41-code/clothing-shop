<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const links = [
  { label: 'Shop all', icon: 'bag-plus', to: '/shop' },
  { label: 'New arrivals', icon: 'sparkles', to: '/category/new-in' },
  { label: 'Best sellers', icon: 'trophy', to: '/shop?sort=best-selling' },
  { label: 'Contact us', icon: 'headphones', to: '/contact' },
]
</script>

<template>
  <div class="flex min-h-[75vh] flex-col items-center justify-center px-4 py-20 text-center">
    <p class="font-display text-8xl tracking-tight text-charcoal/10 sm:text-9xl">404</p>
    <span class="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-beige/60 text-gold">
      <AppIcon name="search" :size="28" />
    </span>
    <h1 class="mt-5 font-display text-3xl text-charcoal">This page appears to be out of stock</h1>
    <p class="mx-auto mt-3 max-w-md text-charcoal/55">
      The page you're looking for doesn't exist or has been moved. Let's get you back to something good.
    </p>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <RouterLink to="/">
        <BaseButton>
          <AppIcon name="home" :size="16" />
          Back to homepage
        </BaseButton>
      </RouterLink>
      <RouterLink to="/shop">
        <BaseButton variant="outline">
          <AppIcon name="bag-plus" :size="16" />
          Continue shopping
        </BaseButton>
      </RouterLink>
    </div>
    <ul class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
      <li v-for="link in links" :key="link.to">
        <RouterLink :to="link.to" class="flex items-center gap-1.5 text-charcoal/50 transition hover:text-gold">
          <AppIcon :name="link.icon" :size="14" />
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>