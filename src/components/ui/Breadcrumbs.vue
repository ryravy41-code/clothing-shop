<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from './AppIcon.vue'

export interface Crumb {
  label: string
  to?: string
}

defineProps<{ crumbs: Crumb[] }>()
</script>

<template>
  <nav aria-label="Breadcrumb" :class="$attrs.class">
    <ol class="flex flex-wrap items-center gap-1.5 text-xs text-charcoal/50">
      <li>
        <RouterLink to="/" class="transition hover:text-gold">Home</RouterLink>
      </li>
      <template v-for="(crumb, i) in crumbs" :key="crumb.label">
        <li class="text-charcoal/25">
          <AppIcon name="chev-right" :size="11" />
        </li>
        <li>
          <RouterLink
            v-if="crumb.to && i < crumbs.length - 1"
            :to="crumb.to"
            class="transition hover:text-gold"
          >
            {{ crumb.label }}
          </RouterLink>
          <span v-else class="font-medium text-charcoal/80">{{ crumb.label }}</span>
        </li>
      </template>
    </ol>
  </nav>
</template>