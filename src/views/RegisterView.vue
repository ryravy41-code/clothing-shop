<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { validate, RULES } from '@/composables/useValidation'

const router = useRouter()
const auth = useAuthStore()
const toasts = useToastStore()

const form = ref({ name: '', email: '', password: '', confirm: '' })
const errors = ref<Record<string, string>>({})

async function submit() {
  const result = validate(form.value, {
    name: [RULES.required('Name is required.')],
    email: [RULES.required('Email is required.'), RULES.email()],
    password: [RULES.required('Password is required.'), RULES.minLength(8, 'Password must be at least 8 characters.')],
    confirm: [RULES.required('Please confirm your password.'), RULES.match(() => form.value.password)],
  })
  errors.value = result.errors
  if (!result.valid) return

  try {
    const user = await auth.register(form.value.name, form.value.email, form.value.password)
    toasts.success('Account created', `Welcome to VESTE, ${user.name.split(' ')[0]}!`)
    await router.push('/account')
  } catch {
    toasts.error('Registration failed', 'That email may already be in use.')
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-14">
    <div class="text-center">
      <p class="font-display text-3xl tracking-[0.2em] text-charcoal">VESTE</p>
      <h1 class="mt-4 font-display text-2xl text-charcoal">Join the atelier</h1>
      <p class="mt-1.5 text-sm text-charcoal/55">Create an account for faster checkout and exclusive offers.</p>
    </div>

    <form class="mt-8 space-y-4 rounded-3xl border border-charcoal/8 bg-white p-7 shadow-sm" @submit.prevent="submit">
      <BaseInput v-model="form.name" label="Full name" :required="true" :error="errors.name" autocomplete="name" />
      <BaseInput v-model="form.email" label="Email address" type="email" icon="mail" :required="true" :error="errors.email" autocomplete="email" />
      <BaseInput v-model="form.password" label="Password" type="password" icon="lock" :required="true" :error="errors.password" hint="At least 8 characters." autocomplete="new-password" />
      <BaseInput v-model="form.confirm" label="Confirm password" type="password" icon="lock" :required="true" :error="errors.confirm" autocomplete="new-password" />
      <BaseButton type="submit" size="lg" block :loading="auth.loading">
        <AppIcon name="check" :size="17" />
        Create account
      </BaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-charcoal/60">
      Already have an account?
      <RouterLink to="/login" class="font-semibold text-gold transition hover:text-gold-dark">Sign in</RouterLink>
    </p>
  </div>
</template>