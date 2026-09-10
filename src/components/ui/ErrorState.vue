<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  { title: 'Something went wrong', message: 'We could not load this content. Please try again.' },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-3xl border border-charcoal/10 bg-white px-6 py-14 text-center">
    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-clay/10">
      <AppIcon name="alert" :size="26" class="text-clay" />
    </div>
    <p class="mt-4 font-display text-lg text-charcoal">{{ title }}</p>
    <p class="mt-1 max-w-sm text-sm text-charcoal/55">{{ message }}</p>
    <BaseButton class="mt-5" variant="outline" @click="emit('retry')">
      <AppIcon name="refresh" :size="16" />
      Retry
    </BaseButton>
  </div>
</template>