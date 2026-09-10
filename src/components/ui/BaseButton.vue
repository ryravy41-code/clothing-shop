<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonSize, ButtonVariant } from './buttonClasses'
import { buttonClasses } from './buttonClasses'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    block?: boolean
    rounded?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', loading: false, disabled: false, block: false, rounded: true },
)

const buttonClass = computed(() =>
  buttonClasses(
    props.variant,
    props.size,
    [props.block ? 'w-full' : '', props.rounded ? '' : 'rounded-lg'].filter(Boolean).join(' '),
  ),
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    :type="props.type"
    :class="buttonClass"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading"
    @click="emit('click', $event)"
  >
    <span
      v-if="props.loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot v-else />
  </button>
</template>