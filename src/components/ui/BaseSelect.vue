<script setup lang="ts">
import AppIcon from './AppIcon.vue'

interface Option {
  label: string
  value: string
}

const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    label?: string
    options: Option[]
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: string
  }>(),
  { required: false, disabled: false },
)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-sm font-medium text-charcoal">
      {{ label }}<span v-if="required" class="text-clay"> *</span>
    </label>
    <div class="relative">
      <select
        v-model="model"
        :class="[
          'w-full appearance-none rounded-xl border bg-white py-3 pl-4 pr-10 text-sm text-charcoal transition-all duration-200 focus:outline-none',
          error
            ? 'border-clay focus:border-clay focus:ring-2 focus:ring-clay/20'
            : 'border-charcoal/15 hover:border-charcoal/30 focus:border-charcoal focus:ring-2 focus:ring-charcoal/10',
          disabled ? 'cursor-not-allowed opacity-60' : '',
        ]"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
          selected
          class="text-charcoal/50"
        >
          {{ placeholder }}
        </option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          class="text-charcoal"
        >
          {{ opt.label }}
        </option>
      </select>
      <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-charcoal/45">
        <AppIcon name="chev-down" :size="16" />
      </span>
    </div>
    <p v-if="error" class="text-xs font-medium text-clay">{{ error }}</p>
  </div>
</template>