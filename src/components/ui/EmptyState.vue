<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
    actionLabel?: string
    actionTo?: string
  }>(),
  { icon: 'bag' },
)

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-charcoal/15 bg-white/60 px-6 py-16 text-center">
    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-beige/60">
      <AppIcon :name="icon" :size="28" class="text-gold" />
    </div>
    <p class="mt-5 font-display text-xl text-charcoal">{{ title }}</p>
    <p v-if="description" class="mt-2 max-w-sm text-sm leading-relaxed text-charcoal/55">
      {{ description }}
    </p>
    <BaseButton
      v-if="actionLabel"
      class="mt-6"
      variant="outline"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </BaseButton>
  </div>
</template>