<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
  }>(),
  { title: 'Are you sure?', message: '', confirmLabel: 'Confirm', cancelLabel: 'Cancel', danger: false },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <BaseModal :open="open" size="sm" :title="title" :close-on-backdrop="false" @close="emit('cancel')">
    <p class="text-sm leading-relaxed text-charcoal/60">{{ message }}</p>
    <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
      <BaseButton variant="outline" size="md" @click="emit('cancel')">{{ cancelLabel }}</BaseButton>
      <BaseButton :variant="danger ? 'danger' : 'primary'" size="md" @click="emit('confirm')">
        {{ confirmLabel }}
      </BaseButton>
    </div>
  </BaseModal>
</template>