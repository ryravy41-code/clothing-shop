<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'

const productStore = useProductStore()
const recentlyViewed = useRecentlyViewedStore()

onMounted(() => {
  void productStore.fetchProducts()
  recentlyViewed.init()
})
</script>

<template>
  <RouterView />
</template>