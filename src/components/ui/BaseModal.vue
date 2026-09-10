<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import AppIcon from './AppIcon.vue'

withDefaults(
  defineProps<{
    open?: boolean
    title?: string
    subtitle?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closeOnBackdrop?: boolean
  }>(),
  { open: false, size: 'md', closeOnBackdrop: true },
)

const emit = defineEmits<{ close: [] }>()

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function onBackdrop() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title ?? 'Dialog'"
      >
        <div
          class="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade"
          @click="closeOnBackdrop && onBackdrop()"
        />
        <div
          class="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-bone shadow-2xl sm:rounded-3xl animate-scale-in"
          :class="SIZE_CLASSES[size]"
        >
          <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-charcoal/10 bg-bone/90 px-6 py-4 backdrop-blur sm:px-8">
            <div>
              <h3 class="font-display text-lg text-charcoal">{{ title }}</h3>
              <p v-if="subtitle" class="text-sm text-charcoal/55">{{ subtitle }}</p>
            </div>
            <button
              type="button"
              class="btn-icon -mr-2 -mt-1"
              aria-label="Close dialog"
              @click="emit('close')"
            >
              <AppIcon name="close" :size="18" />
            </button>
          </div>
          <div class="px-6 py-6 sm:px-8">
            <slot />
          </div>
          <div v-if="$slots.footer" class="border-t border-charcoal/10 px-6 py-4 sm:px-8">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .animate-scale-in,
.modal-leave-active .animate-scale-in {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .animate-scale-in,
.modal-leave-to .animate-scale-in {
  transform: scale(0.96);
}
</style>