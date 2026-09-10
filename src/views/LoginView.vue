<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { validate, RULES } from '@/composables/useValidation'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toasts = useToastStore()

const form = ref({ email: 'demo@veste.com', password: 'password' })
const errors = ref<Record<string, string>>({})

async function submit() {
  const result = validate(form.value, {
    email: [RULES.required('Email is required.'), RULES.email()],
    password: [RULES.required('Password is required.')],
  })
  errors.value = result.errors
  if (!result.valid) return

  try {
    const user = await auth.login(form.value.email, form.value.password)
    toasts.success('Welcome back', `Signed in as ${user.name}.`)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    await router.push(redirect ?? '/account')
  } catch {
    toasts.error('Login failed', 'Check your email and password and try again.')
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-14">
    <div class="text-center">
      <p class="font-display text-3xl tracking-[0.2em] text-charcoal">VESTE</p>
      <h1 class="mt-4 font-display text-2xl text-charcoal">Welcome back</h1>
      <p class="mt-1.5 text-sm text-charcoal/55">Sign in to your account to shop faster.</p>
    </div>

    <form class="mt-8 space-y-4 rounded-3xl border border-charcoal/8 bg-white p-7 shadow-sm" @submit.prevent="submit">
      <BaseInput v-model="form.email" label="Email address" type="email" icon="mail" :required="true" :error="errors.email" autocomplete="email" />
      <BaseInput v-model="form.password" label="Password" type="password" icon="lock" :required="true" :error="errors.password" autocomplete="current-password" />
      <div class="flex items-center justify-between text-sm">
        <RouterLink to="/forgot-password" class="font-medium text-gold transition hover:text-gold-dark">
          Forgot password?
        </RouterLink>
      </div>
      <BaseButton type="submit" size="lg" block :loading="auth.loading">
        <AppIcon name="user" :size="17" />
        Sign in
      </BaseButton>
    </form>

    <div class="mt-4 rounded-2xl bg-beige/50 p-4 text-center text-sm text-charcoal/70">
      <p class="flex items-center justify-center gap-1.5 font-medium text-charcoal">
        <AppIcon name="sparkles" :size="15" class="text-gold" />
        Demo account
      </p>
      <p class="mt-1.5">Email <code class="font-semibold text-gold">demo@veste.com</code> · Password <code class="font-semibold text-gold">password</code></p>
    </div>

    <p class="mt-6 text-center text-sm text-charcoal/60">
      New to VESTE?
      <RouterLink to="/register" class="font-semibold text-gold transition hover:text-gold-dark">Create an account</RouterLink>
    </p>

    <div class="mt-8 flex items-center justify-center gap-5 text-xs text-charcoal/40">
      <RouterLink to="/" class="transition hover:text-charcoal">Back to store</RouterLink>
      <span>·</span>
      <RouterLink to="/faq" class="transition hover:text-charcoal">Need help?</RouterLink>
    </div>
  </div>
</template>