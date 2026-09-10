<script setup lang="ts">
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    disabled?: boolean
    name?: string
  }>(),
  { disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label
    :class="[
      'relative flex cursor-pointer select-none items-start gap-3',
      disabled ? 'cursor-not-allowed opacity-50' : '',
    ]"
  >
    <input
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      class="peer sr-only"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span
      class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-charcoal/25 bg-white transition-all duration-200 peer-checked:border-charcoal peer-checked:bg-charcoal peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-1"
    >
      <AppIcon name="check" :size="12" class="text-bone opacity-0 transition peer-checked:opacity-100" />
    </span>
    <span v-if="label" class="text-sm leading-snug text-charcoal/80">{{ label }}</span>
  </label>
</template>