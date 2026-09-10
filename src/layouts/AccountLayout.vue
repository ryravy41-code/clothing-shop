<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()

const links = [
  { label: 'Dashboard', to: '/account', icon: 'home' },
  { label: 'My Orders', to: '/account/orders', icon: 'package' },
  { label: 'Wishlist', to: '/account/wishlist', icon: 'heart' },
  { label: 'Profile', to: '/account/profile', icon: 'user' },
  { label: 'Addresses', to: '/account/addresses', icon: 'map-pin' },
]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <section class="wrap py-8 sm:py-10">
        <div class="flex flex-col gap-8 lg:flex-row">
          <aside class="shrink-0 lg:w-60">
            <div class="flex items-center gap-3 rounded-3xl bg-charcoal p-5 text-bone">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-bone/10 font-display text-lg text-gold">
                {{ auth.initials }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">{{ auth.fullName }}</p>
                <p class="truncate text-xs text-bone/50">{{ auth.currentUser?.email }}</p>
              </div>
            </div>
            <nav class="mt-4 flex gap-1 overflow-x-auto lg:flex-col" aria-label="Account navigation">
              <RouterLink
                v-for="l in links"
                :key="l.to"
                :to="l.to"
                class="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition"
                :class="
                  route.path === l.to
                    ? 'bg-charcoal text-bone'
                    : 'text-charcoal/65 hover:bg-charcoal/5 hover:text-charcoal'
                "
              >
                <AppIcon :name="l.icon" :size="16" />
                {{ l.label }}
              </RouterLink>
              <button
                type="button"
                class="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-clay transition hover:bg-clay/5"
                @click="auth.logout()"
              >
                <AppIcon name="logout" :size="16" />
                Sign out
              </button>
            </nav>
          </aside>

          <div class="min-w-0 flex-1">
            <RouterView v-slot="{ Component }">
              <Transition name="page" mode="out-in">
                <component :is="Component" :key="route.path" />
              </Transition>
            </RouterView>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
    <ToastContainer />
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>