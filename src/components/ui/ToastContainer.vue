<script setup lang="ts">
import { computed } from 'vue'
import type { Toast } from '@/types'
import AppIcon from './AppIcon.vue'
import { useToastStore } from '@/stores/toast'

const store = useToastStore()

const meta = computed(() =>
  store.toasts.map((t) => {
    const conf: Record<Toast['type'], { icon: string; ring: string; bg: string; text: string }> = {
      success: { icon: 'check-circle', ring: 'ring-green-500/20', bg: 'bg-white', text: 'text-green-600' },
      error: { icon: 'x-circle', ring: 'ring-clay/20', bg: 'bg-white', text: 'text-clay' },
      info: { icon: 'info', ring: 'ring-gold/20', bg: 'bg-white', text: 'text-gold' },
      coupon: { icon: 'tag', ring: 'ring-gold/20', bg: 'bg-white', text: 'text-gold' },
    }
    return { ...t, ...conf[t.type] }
  }),
)
</script>

<template>
  <div
    class="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5 sm:bottom-6 sm:right-6"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <div
        v-for="t in meta"
        :key="t.id"
        class="pointer-events-auto flex items-start gap-3 rounded-2xl border border-charcoal/8 bg-white p-4 shadow-xl shadow-charcoal/10 ring-4"
        :class="t.ring"
      >
        <span :class="['mt-0.5', t.text]">
          <AppIcon :name="t.icon" :size="22" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-charcoal">{{ t.title }}</p>
          <p v-if="t.message" class="mt-0.5 text-xs leading-relaxed text-charcoal/60">
            {{ t.message }}
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-full p-1 text-charcoal/40 transition hover:bg-charcoal/5 hover:text-charcoal"
          :aria-label="'Dismiss notification'"
          @click="store.remove(t.id)"
        >
          <AppIcon name="close" :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(80px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(80px) scale(0.95);
}
.toast-leave-active {
  position: absolute;
  width: 100%;
}
</style>