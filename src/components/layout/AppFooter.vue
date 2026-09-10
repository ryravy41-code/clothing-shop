<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useToastStore } from '@/stores/toast'

const toasts = useToastStore()
const email = ref('')
const submitting = ref(false)
const subscribed = ref(false)
const error = ref('')

const SHOP = [
  { label: 'Men', to: '/category/men' },
  { label: 'Women', to: '/category/women' },
  { label: 'Kids', to: '/category/kids' },
  { label: 'Shoes', to: '/category/shoes' },
  { label: 'Accessories', to: '/category/accessories' },
  { label: 'Sale', to: '/category/sale' },
]

const HELP = [
  { label: 'Track your order', to: '/track-order' },
  { label: 'Contact us', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'About VESTE', to: '/about' },
]

const ACCOUNT = [
  { label: 'My Account', to: '/account' },
  { label: 'My Orders', to: '/account/orders' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Cart', to: '/cart' },
]

function subscribe() {
  error.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    error.value = 'Please enter a valid email address.'
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    subscribed.value = true
    toasts.success('You are subscribed!', 'Welcome to the VESTE letters.')
  }, 900)
}
</script>

<template>
  <footer class="mt-20 bg-ink text-bone">
    <div class="border-b border-bone/10">
      <div class="wrap grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr]">
        <div>
          <p class="font-display text-2xl tracking-[0.22em]">VESTE</p>
          <p class="mt-1 text-xs uppercase tracking-[0.2em] text-beige">Premium Fashion Atelier</p>
          <p class="mt-5 max-w-xs text-sm leading-relaxed text-bone/55">
            Timeless essentials crafted from the finest materials. Designed in Paris, loved everywhere.
          </p>
          <div class="mt-6 flex gap-2">
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-bone/15 text-bone/70 transition hover:border-gold hover:bg-gold hover:text-white"
              aria-label="Instagram"
            >
              <AppIcon name="instagram" :size="17" />
            </a>
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-bone/15 text-bone/70 transition hover:border-gold hover:bg-gold hover:text-white"
              aria-label="Facebook"
            >
              <AppIcon name="facebook" :size="17" />
            </a>
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-bone/15 text-bone/70 transition hover:border-gold hover:bg-gold hover:text-white"
              aria-label="Twitter"
            >
              <AppIcon name="twitter" :size="17" />
            </a>
          </div>
        </div>

        <nav aria-label="Shop">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-beige">Shop</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="l in SHOP" :key="l.to">
              <RouterLink :to="l.to" class="text-sm text-bone/60 transition hover:text-gold">
                {{ l.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Help">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-beige">Help</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="l in HELP" :key="l.to">
              <RouterLink :to="l.to" class="text-sm text-bone/60 transition hover:text-gold">
                {{ l.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Account">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-beige">Account</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="l in ACCOUNT" :key="l.to">
              <RouterLink :to="l.to" class="text-sm text-bone/60 transition hover:text-gold">
                {{ l.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-beige">Newsletter</p>
          <p class="mt-4 text-sm leading-relaxed text-bone/55">
            Join the list for early access, private sales and styling notes.
          </p>
          <form v-if="!subscribed" class="mt-4" @submit.prevent="subscribe">
            <div class="flex overflow-hidden rounded-full border border-bone/15 bg-bone/5 focus-within:border-gold">
              <input
                v-model="email"
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                class="w-full bg-transparent px-5 py-3 text-sm text-bone placeholder:text-bone/35 focus:outline-none"
              />
              <button
                type="submit"
                :disabled="submitting"
                class="shrink-0 bg-gold px-5 text-sm font-semibold text-white transition hover:bg-gold-dark disabled:opacity-50"
              >
                {{ submitting ? 'Joining…' : 'Subscribe' }}
              </button>
            </div>
            <p v-if="error" class="mt-2 text-xs text-red-300">{{ error }}</p>
          </form>
          <div v-else class="mt-4 flex items-center gap-2 rounded-2xl bg-gold/15 p-4 text-sm text-beige">
            <AppIcon name="check-circle" :size="18" class="text-gold" />
            Welcome aboard! Check your inbox for a little hello.
          </div>

          <div class="mt-6 flex items-center gap-2 text-xs text-bone/60">
            <AppIcon name="credit-card" :size="16" class="text-gold" />
            <span>Secure payments · Visa, MC, Amex, PayPal</span>
          </div>
        </div>
      </div>
    </div>

    <div class="wrap flex flex-col items-center justify-between gap-3 py-6 text-xs text-bone/40 sm:flex-row">
      <p>© {{ new Date().getFullYear() }} VESTE Atelier. All rights reserved.</p>
      <div class="flex items-center gap-5">
        <RouterLink to="/about" class="transition hover:text-bone/80">Privacy</RouterLink>
        <RouterLink to="/faq" class="transition hover:text-bone/80">Terms</RouterLink>
        <RouterLink to="/contact" class="transition hover:text-bone/80">Cookies</RouterLink>
      </div>
    </div>
  </footer>
</template>