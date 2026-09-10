<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps<{
  steps: { id: string; label: string; icon: string }[]
  current: number
}>()
</script>

<template>
  <ol class="flex items-center gap-2 sm:gap-0">
    <li
      v-for="(step, i) in props.steps"
      :key="step.id"
      class="flex items-center"
      :class="i < props.steps.length - 1 ? 'flex-1' : ''"
    >
      <div class="flex flex-col items-center gap-1.5">
        <div
          :class="[
            'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-10 sm:w-10',
            i < props.current
              ? 'border-charcoal bg-charcoal text-bone'
              : i === props.current
                ? 'border-gold bg-gold text-white'
                : 'border-charcoal/20 bg-white text-charcoal/35',
          ]"
        >
          <AppIcon v-if="i < props.current" name="check" :size="16" />
          <AppIcon v-else :name="step.icon" :size="16" />
        </div>
        <span
          :class="[
            'text-[11px] font-medium sm:text-xs',
            i <= props.current ? 'text-charcoal' : 'text-charcoal/40',
          ]"
        >
          {{ step.label }}
        </span>
      </div>
      <div
        v-if="i < props.steps.length - 1"
        :class="[
          'mx-1.5 h-0.5 flex-1 rounded-full sm:mx-3',
          i < props.current ? 'bg-charcoal' : 'bg-charcoal/15',
        ]"
      />
    </li>
  </ol>
</template>