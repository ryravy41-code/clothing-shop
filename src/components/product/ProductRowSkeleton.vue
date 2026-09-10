<script setup lang="ts">
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

withDefaults(defineProps<{ count?: number }>(), { count: 4 })
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
    <div v-for="i in count" :key="i" class="overflow-hidden rounded-3xl bg-white p-3 shadow-sm ring-1 ring-charcoal/5">
      <BaseSkeleton class="aspect-[3/4] w-full rounded-2xl" />
      <div class="space-y-2.5 px-1 pb-2 pt-4">
        <BaseSkeleton class="h-3 w-16" />
        <BaseSkeleton class="h-4 w-4/5" />
        <BaseSkeleton class="h-3 w-1/3" />
        <div class="flex justify-between">
          <BaseSkeleton class="h-4 w-16" />
          <BaseSkeleton class="h-4 w-12" />
        </div>
      </div>
    </div>
  </div>
</template>