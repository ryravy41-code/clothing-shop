<script setup lang="ts">
withDefaults(
  defineProps<{
    class?: string
    circle?: boolean
  }>(),
  { circle: false },
)
</script>

<template>
  <div :class="['skeleton', circle ? 'rounded-full' : 'rounded-lg', $attrs.class]">
    <slot />
  </div>
</template>