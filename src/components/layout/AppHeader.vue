<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import MegaMenu from './MegaMenu.vue'
import MobileMenu from './MobileMenu.vue'
import SearchOverlay from './SearchOverlay.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useAuthStore } from '@/stores/auth'

const cart = useCartStore()
const wishlist = useWishlistStore()
const auth = useAuthStore()

const scrolled = ref(false)
const mobileOpen = ref(false)
const searchOpen = ref(false)
const accountOpen = ref(false)
const logoutOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 14
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const ANNOUNCEMENTS = [
  'Complimentary shipping on orders over $150',
  'Extra 15% off with code SPRING15',
  'New season has arrived — shop New Arrivals',
]

const activeAnnouncement = computed(
  () => ANNOUNCEMENTS[Math.floor(Date.now() / 60000) % ANNOUNCEMENTS.length],
)

function openSearch() {
  searchOpen.value = true
  accountOpen.value = false
}

function toggleCart() {
  cart.isOpen = true
  accountOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50">
    <div class="bg-ink text-center text-bone">
      <p class="wrap flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium tracking-[0.16em] uppercase sm:text-xs">
        
        {{ activeAnnouncement }}
      </p>
    </div>

    <div
      :class="[
        'border-b border-charcoal/8 bg-bone/90 backdrop-blur transition-all duration-300',
        scrolled ? 'shadow-lg shadow-charcoal/5' : '',
      ]"
    >
      <div class="wrap flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="btn-icon lg:hidden"
            aria-label="Open menu"
            @click="mobileOpen = true"
          >
            <AppIcon name="menu" :size="22" />
          </button>
          <RouterLink to="/" class="flex items-center gap-2" aria-label="VESTE home">
            <img src="/logo.png" alt="VESTE" class="h-10 w-auto md:h-14" />
          </RouterLink>
        </div>

        <MegaMenu />

        <div class="flex items-center gap-0.5 sm:gap-1">
          <button type="button" class="btn-icon" aria-label="Search" @click="openSearch">
            <AppIcon name="search" :size="20" />
          </button>

          <div class="relative">
            <button
              type="button"
              class="btn-icon"
              :aria-label="auth.isAuthenticated ? 'Account' : 'Sign in'"
              @click="accountOpen = !accountOpen"
            >
              <AppIcon name="user" :size="20" />
            </button>
            <Transition name="pop">
              <div
                v-if="accountOpen"
                class="absolute right-0 top-[calc(100%+10px)] z-40 w-64 overflow-hidden rounded-2xl border border-charcoal/8 bg-white shadow-2xl shadow-charcoal/10"
              >
                <div v-if="auth.isAuthenticated" class="flex items-center gap-3 border-b border-charcoal/8 bg-bone p-4">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm text-bone">
                    {{ auth.initials }}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-charcoal">{{ auth.fullName }}</p>
                    <p class="truncate text-xs text-charcoal/50">{{ auth.currentUser?.email }}</p>
                  </div>
                </div>
                <ul v-if="auth.isAuthenticated" class="p-2">
                  <li
                    v-for="l in [
                      { label: 'My Account', to: '/account' },
                      { label: 'My Orders', to: '/account/orders' },
                      { label: 'Addresses', to: '/account/addresses' },
                      { label: 'Wishlist', to: '/account/wishlist' },
                    ]"
                    :key="l.to"
                  >
                    <RouterLink
                      :to="l.to"
                      class="block rounded-xl px-4 py-2.5 text-sm text-charcoal/80 transition hover:bg-bone hover:text-charcoal"
                      @click="accountOpen = false"
                    >
                      {{ l.label }}
                    </RouterLink>
                  </li>
                  <li class="mt-1 border-t border-charcoal/8 pt-1">
                    <button
                      type="button"
                      class="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-clay transition hover:bg-clay/5"
                      @click="accountOpen = false; logoutOpen = true"
                    >
                      <AppIcon name="logout" :size="15" />
                      Sign out
                    </button>
                  </li>
                </ul>
                <ul v-else class="p-2">
                  <li>
                    <RouterLink
                      to="/login"
                      class="block rounded-xl px-4 py-2.5 text-sm font-medium text-charcoal transition hover:bg-bone"
                      @click="accountOpen = false"
                    >
                      Sign in
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink
                      to="/register"
                      class="block rounded-xl px-4 py-2.5 text-sm text-charcoal/70 transition hover:bg-bone"
                      @click="accountOpen = false"
                    >
                      Create an account
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>

          <RouterLink to="/wishlist" class="btn-icon relative" aria-label="Wishlist">
            <AppIcon name="heart" :size="20" />
            <span
              v-if="wishlist.count > 0"
              class="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold text-white"
            >
              {{ wishlist.count }}
            </span>
          </RouterLink>

          <button type="button" class="btn-icon relative" aria-label="Shopping bag" @click="toggleCart">
            <AppIcon name="bag" :size="20" />
            <span
              v-if="cart.itemCount > 0"
              class="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-charcoal px-1 text-[10px] font-bold text-bone"
            >
              {{ cart.itemCount }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <MobileMenu :model-value="mobileOpen" @close="mobileOpen = false" />
    <SearchOverlay :open="searchOpen" @close="searchOpen = false" />
    <ConfirmDialog
      :open="logoutOpen"
      title="Sign out?"
      message="Are you sure you want to sign out of your account?"
      confirm-label="Sign out"
      danger
      @confirm="auth.logout(); logoutOpen = false"
      @cancel="logoutOpen = false"
    />
  </header>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.2s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
@media (max-width: 768px) {
  :deep(.flex.items-center.gap-2 img) {
    height: 2.5rem;
    width: auto;
    max-width: 100%;
  }
}
</style>