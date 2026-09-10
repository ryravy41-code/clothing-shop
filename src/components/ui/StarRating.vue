<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    value: number
    readonly?: boolean
    size?: 'sm' | 'md'
    showValue?: boolean
  }>(),
  { readonly: true, size: 'md', showValue: false },
)

const emit = defineEmits<{ 'update:value': [value: number] }>()

const stars = computed(() => Array.from({ length: 5 }, (_, i) => i + 1))

function set(rating: number, e: MouseEvent) {
  if (props.readonly) return
  e.preventDefault()
  emit('update:value', rating)
}

const rounded = computed(() => Math.round(props.value))
</script>

<template>
  <div class="flex items-center gap-1" :aria-label="`Rated ${value} out of 5`">
    <button
      v-for="star in stars"
      :key="star"
      type="button"
      :disabled="readonly"
      :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
      class="transition-transform duration-150 disabled:cursor-default"
      :class="!readonly ? 'cursor-pointer hover:scale-110 focus-visible:scale-110' : ''"
      @click.prevent="set(star, $event)"
    >
      <AppIcon
        :name="star <= rounded ? 'star' : 'star-outline'"
        :class="`transition-colors ${star <= rounded ? 'text-gold' : 'text-charcoal/25'} ${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'}`"
        :size="size === 'sm' ? 14 : 18"
      />
    </button>
    <span v-if="showValue" class="ml-1 text-xs font-medium text-charcoal/60">
      {{ value.toFixed(1) }}
    </span>
  </div>
</template>