<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useAuthStore } from '@/stores/auth'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuthStore()
const logoutOpen = ref(false)

const shopLinks = [
  { label: 'Men', to: '/category/men' },
  { label: 'Women', to: '/category/women' },
  { label: 'Kids', to: '/category/kids' },
  { label: 'Shoes', to: '/category/shoes' },
  { label: 'Accessories', to: '/category/accessories' },
  { label: 'New Arrivals', to: '/category/new-arrivals' },
  { label: 'Sale', to: '/category/sale' },
]

const accountLinks = auth.isAuthenticated
  ? [
      { label: 'My Account', to: '/account' },
      { label: 'Orders', to: '/account/orders' },
      { label: 'Wishlist', to: '/account/wishlist' },
    ]
  : [
      { label: 'Login', to: '/login' },
      { label: 'Create Account', to: '/register' },
    ]

const helpLinks = [
  { label: 'Track Order', to: '/track-order' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
]
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[80] lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade" @click="emit('close')" />
        <div class="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-bone shadow-2xl animate-slide-in-left">
          <div class="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
            <RouterLink to="/" @click="emit('close')">
              <img src="/logo.png" alt="VESTE" class="h-11 w-auto" />
            </RouterLink>
            <button
              type="button"
              class="btn-icon"
              aria-label="Close menu"
              @click="emit('close')"
            >
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <nav class="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile">
            <div class="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
              <div
                v-if="auth.isAuthenticated"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal font-display text-xs text-bone"
              >
                {{ auth.initials }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-charcoal">
                  {{ auth.isAuthenticated ? auth.fullName : 'Welcome to VESTE' }}
                </p>
                <RouterLink
                  :to="auth.isAuthenticated ? '/account' : '/login'"
                  class="text-xs text-gold"
                  @click="emit('close')"
                >
                  {{ auth.isAuthenticated ? 'View account' : 'Sign in' }}
                </RouterLink>
              </div>
            </div>

            <p class="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
              Shop
            </p>
            <ul class="mt-2 space-y-0.5">
              <li v-for="link in shopLinks" :key="link.to">
                <RouterLink
                  :to="link.to"
                  class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal/85 transition hover:bg-white hover:text-charcoal"
                  @click="emit('close')"
                >
                  {{ link.label }}
                  <AppIcon name="chev-right" :size="15" class="text-charcoal/35" />
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/shop"
                  class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal/85 transition hover:bg-white hover:text-charcoal"
                  @click="emit('close')"
                >
                  All Products
                  <AppIcon name="chev-right" :size="15" class="text-charcoal/35" />
                </RouterLink>
              </li>
            </ul>

            <p class="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
              Account
            </p>
            <ul class="mt-2 space-y-0.5">
              <li v-for="link in accountLinks" :key="link.to">
                <RouterLink
                  :to="link.to"
                  class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal/85 transition hover:bg-white hover:text-charcoal"
                  @click="emit('close')"
                >
                  {{ link.label }}
                  <AppIcon name="chev-right" :size="15" class="text-charcoal/35" />
                </RouterLink>
              </li>
              <li v-if="auth.isAuthenticated">
                <button
                  type="button"
                  class="flex w-full items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-medium text-clay transition hover:bg-clay/5"
                  @click="logoutOpen = true"
                >
                  <AppIcon name="logout" :size="15" />
                  Sign out
                </button>
              </li>
            </ul>

            <p class="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
              Support
            </p>
            <ul class="mt-2 space-y-0.5">
              <li v-for="link in helpLinks" :key="link.to">
                <RouterLink
                  :to="link.to"
                  class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal/85 transition hover:bg-white hover:text-charcoal"
                  @click="emit('close')"
                >
                  {{ link.label }}
                  <AppIcon name="chev-right" :size="15" class="text-charcoal/35" />
                </RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </Transition>
    <ConfirmDialog
      :open="logoutOpen"
      title="Sign out?"
      message="Are you sure you want to sign out of your account?"
      confirm-label="Sign out"
      danger
      @confirm="auth.logout(); logoutOpen = false; emit('close')"
      @cancel="logoutOpen = false"
    />
  </Teleport>
</template>

<style scoped>
.animate-slide-in-left {
  animation: slide-in-left 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
</style>