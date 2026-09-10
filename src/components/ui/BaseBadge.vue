<script setup lang="ts">
import { computed } from 'vue'

type BadgeTone = 'dark' | 'gold' | 'clay' | 'green' | 'neutral'

const props = withDefaults(
  defineProps<{
    tone?: BadgeTone
    uppercase?: boolean
  }>(),
  { tone: 'neutral', uppercase: true },
)

const palette = computed(() => ({
  dark: 'bg-charcoal text-bone',
  gold: 'bg-gold text-white',
  clay: 'bg-clay text-white',
  green: 'bg-green-600 text-white',
  neutral: 'bg-charcoal/8 text-charcoal',
}[props.tone]))

const size = computed(() =>
  props.uppercase ? 'px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase' : 'px-2.5 py-1 text-[11px] font-semibold',
)
</script>

<template>
  <span :class="['inline-flex items-center gap-1 rounded-full', palette, size]">
    <slot />
  </span>
</template>