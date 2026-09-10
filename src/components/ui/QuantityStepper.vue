<script setup lang="ts">
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    size?: 'sm' | 'md'
  }>(),
  { min: 1, size: 'md' },
)

const emit = defineEmits<{ 'update:modelValue': [value: number]; change: [value: number] }>()

function clamp(v: number) {
  return Math.min(props.max ?? Infinity, Math.max(props.min, v))
}

function dec() {
  const next = clamp(props.modelValue - 1)
  emit('update:modelValue', next)
  emit('change', next)
}

function inc() {
  const next = clamp(props.modelValue + 1)
  emit('update:modelValue', next)
  emit('change', next)
}

function input(e: Event) {
  const value = Number((e.target as HTMLInputElement).value)
  const next = Number.isNaN(value) ? props.min : clamp(value)
  emit('update:modelValue', next)
}
</script>

<template>
  <div
    :class="[
      'inline-flex items-center rounded-full border border-charcoal/20 bg-white',
      size === 'sm' ? 'h-8' : 'h-11',
    ]"
  >
    <button
      type="button"
      class="flex h-full items-center justify-center rounded-l-full transition active:bg-charcoal/5"
      :class="size === 'sm' ? 'w-8 text-charcoal/70' : 'w-9 text-charcoal/70'"
      :disabled="modelValue <= min"
      :aria-label="`Decrease quantity`"
      @click="dec"
    >
      <AppIcon name="minus" :size="size === 'sm' ? 12 : 14" />
    </button>
    <input
      :value="modelValue"
      type="number"
      :min="min"
      :max="max"
      :class="['w-10 text-center text-sm font-semibold focus:outline-none', size === 'sm' ? 'h-8' : 'h-11']"
      aria-label="Quantity"
      @change="input"
    />
    <button
      type="button"
      class="flex h-full items-center justify-center rounded-r-full transition active:bg-charcoal/5"
      :class="size === 'sm' ? 'w-8 text-charcoal/70' : 'w-9 text-charcoal/70'"
      :disabled="max !== undefined && modelValue >= max"
      :aria-label="`Increase quantity`"
      @click="inc"
    >
      <AppIcon name="plus" :size="size === 'sm' ? 12 : 14" />
    </button>
  </div>
</template>