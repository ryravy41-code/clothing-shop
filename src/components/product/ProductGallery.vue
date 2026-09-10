<script setup lang="ts">
import { ref, watch } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = withDefaults(
  defineProps<{
    images: string[]
    colorIndex?: number
    alt?: string
  }>(),
  { colorIndex: 0, alt: 'Product image' },
)

const activeIndex = ref(0)
const zoomOpen = ref(false)
const zoomPos = ref({ x: 50, y: 50 })

watch(
  () => props.colorIndex,
  (idx) => {
    if (props.images.length > 0) {
      activeIndex.value = idx % props.images.length
    }
  },
)

const current = () => props.images[Math.min(activeIndex.value, props.images.length - 1)]

function onMove(e: MouseEvent, el: HTMLDivElement) {
  const rect = el.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  zoomPos.value = { x, y }
}

function prev() {
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}
</script>

<template>
  <div class="flex flex-col-reverse gap-4 lg:flex-row">
    <div class="flex gap-3 lg:flex-col">
      <button
        v-for="(img, i) in images"
        :key="img + i"
        type="button"
        :class="[
          'relative aspect-square w-16 overflow-hidden rounded-xl border-2 transition-all sm:w-20',
          i === activeIndex ? 'border-charcoal' : 'border-transparent opacity-60 hover:opacity-100',
        ]"
        :aria-label="`View image ${i + 1}`"
        @click="activeIndex = i"
      >
        <img :src="img" :alt="`${alt} thumbnail ${i + 1}`" loading="lazy" class="h-full w-full object-cover" />
      </button>
    </div>

    <div class="group relative flex-1 overflow-hidden rounded-3xl bg-beige/30">
      <div
        class="aspect-[4/5] w-full cursor-zoom-in overflow-hidden"
        @mousemove="onMove($event, $event.currentTarget as HTMLDivElement)"
        @mouseenter="zoomOpen = true"
        @mouseleave="zoomOpen = false"
      >
        <Transition name="fade-img" mode="out-in">
          <img
            :key="activeIndex"
            :src="current()"
            :alt="alt"
            class="h-full w-full object-cover transition-transform duration-200 ease-out"
            :style="
              zoomOpen
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: 'scale(2.2)',
                  }
                : {}
            "
          />
        </Transition>
        <button
          type="button"
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-charcoal/70 opacity-0 shadow-md backdrop-blur transition group-hover:opacity-100"
          aria-label="Zoom preview"
          @click="zoomOpen = !zoomOpen"
        >
          <AppIcon name="zoom-in" :size="18" />
        </button>
      </div>

      <button
        type="button"
        class="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-charcoal opacity-0 shadow-md backdrop-blur transition hover:bg-white group-hover:opacity-100"
        aria-label="Previous image"
        @click="prev"
      >
        <AppIcon name="chev-left" :size="18" />
      </button>
      <button
        type="button"
        class="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-charcoal opacity-0 shadow-md backdrop-blur transition hover:bg-white group-hover:opacity-100"
        aria-label="Next image"
        @click="next"
      >
        <AppIcon name="chev-right" :size="18" />
      </button>

      <div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        <span
          v-for="(_, i) in images"
          :key="i"
          :class="[
            'h-1.5 rounded-full transition-all',
            i === activeIndex ? 'w-5 bg-charcoal' : 'w-1.5 bg-charcoal/30',
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-img-enter-active,
.fade-img-leave-active {
  transition: opacity 0.25s ease;
}
.fade-img-enter-from,
.fade-img-leave-to {
  opacity: 0;
}
</style>