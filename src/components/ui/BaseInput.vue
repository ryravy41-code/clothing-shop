<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'date'

const model = defineModel<string>({ required: true })

const props = withDefaults(
  defineProps<{
    label?: string
    type?: InputType
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: string
    hint?: string
    icon?: string
    autocomplete?: string
    maxlength?: number
    inputmode?: 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal'
    min?: number
    max?: number
  }>(),
  { type: 'text', required: false, disabled: false },
)

const inputClass = computed(() => [
  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 transition-all duration-200 focus:outline-none',
  props.icon ? 'pl-11' : '',
  props.error
    ? 'border-clay focus:border-clay focus:ring-2 focus:ring-clay/20'
    : 'border-charcoal/15 hover:border-charcoal/30 focus:border-charcoal focus:ring-2 focus:ring-charcoal/10',
  props.disabled ? 'cursor-not-allowed opacity-60' : '',
].join(' '))
</script>

<template>
  <div class="flex flex-col gap-1.5" :class="$attrs.class">
    <label v-if="label" class="text-sm font-medium text-charcoal">
      {{ label }}<span v-if="required" class="text-clay"> *</span>
    </label>
    <div class="relative">
      <span
        v-if="icon"
        class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-charcoal/45"
      >
        <AppIcon :name="icon" :size="18" />
      </span>
      <input
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :inputmode="inputmode"
        :min="min"
        :max="max"
        :class="inputClass"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${$attrs.id ?? 'field'}-error` : undefined"
      />
    </div>
    <p v-if="error" :id="`${$attrs.id ?? 'field'}-error`" class="text-xs font-medium text-clay">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-charcoal/50">{{ hint }}</p>
  </div>
</template>