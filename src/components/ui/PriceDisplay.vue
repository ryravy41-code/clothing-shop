<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    price: number
    originalPrice?: number
    size?: 'sm' | 'md' | 'lg'
    showDiscount?: boolean
  }>(),
  { size: 'md', showDiscount: false },
)

const discount = computed(() => {
  if (!props.originalPrice || props.originalPrice <= props.price) return 0
  return Math.round(((props.originalPrice - props.price) / props.originalPrice) * 100)
})

const priceClass = computed(() =>
  props.size === 'lg' ? 'text-xl' : props.size === 'md' ? 'text-base' : 'text-sm',
)
</script>

<template>
  <div class="flex items-center gap-2">
    <span :class="['font-semibold tracking-tight text-charcoal', priceClass]">
      {{ formatCurrency(price) }}
    </span>
    <span
      v-if="originalPrice && originalPrice > price"
      :class="['font-normal text-charcoal/40 line-through', props.size === 'lg' ? 'text-base' : 'text-xs']"
    >
      {{ formatCurrency(originalPrice) }}
    </span>
    <span
      v-if="showDiscount && discount > 0"
      class="rounded-full bg-clay/10 px-2 py-0.5 text-[11px] font-semibold text-clay"
    >
      -{{ discount }}%
    </span>
  </div>
</template>