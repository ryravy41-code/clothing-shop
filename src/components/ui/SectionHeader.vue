<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from './AppIcon.vue'

withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    linkLabel?: string
    linkTo?: string
    align?: 'left' | 'center'
  }>(),
  { align: 'left' },
)
</script>

<template>
  <div
    :class="[
      'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
      align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
    ]"
  >
    <div :class="align === 'center' ? 'max-w-xl' : 'max-w-2xl'">
      <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
        {{ eyebrow }}
      </p>
      <h2 class="mt-2 font-display text-2xl text-charcoal sm:text-3xl">{{ title }}</h2>
      <p v-if="description" class="mt-2 text-sm leading-relaxed text-charcoal/55">
        {{ description }}
      </p>
    </div>
    <RouterLink
      v-if="linkLabel && linkTo"
      :to="linkTo"
      class="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-charcoal transition hover:text-gold"
    >
      {{ linkLabel }}
      <AppIcon
        name="arrow-right"
        :size="16"
        class="transition-transform duration-300 group-hover:translate-x-1"
      />
    </RouterLink>
  </div>
</template>