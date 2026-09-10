<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'
import { validate, RULES } from '@/composables/useValidation'

const auth = useAuthStore()
const email = ref('')
const errors = ref<Record<string, string>>({})
const sent = ref(false)

async function submit() {
  const result = validate({ email: email.value }, { email: [RULES.required('Email is required.'), RULES.email()] })
  errors.value = result.errors
  if (!result.valid) return
  try {
    await auth.forgotPassword(email.value)
    sent.value = true
  } catch {
    errors.value.email = 'No account found with this email.'
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-14">
    <div v-if="!sent">
      <div class="text-center">
        <p class="font-display text-3xl tracking-[0.2em] text-charcoal">VESTE</p>
        <h1 class="mt-4 font-display text-2xl text-charcoal">Reset your password</h1>
        <p class="mt-1.5 text-sm text-charcoal/55">
          Enter the email linked to your account and we'll send reset instructions (mock — demo resets to <span class="font-semibold text-gold">reset1234</span>).
        </p>
      </div>
      <form class="mt-8 space-y-4 rounded-3xl border border-charcoal/8 bg-white p-7 shadow-sm" @submit.prevent="submit">
        <BaseInput v-model="email" label="Email address" type="email" icon="mail" :required="true" :error="errors.email" autocomplete="email" />
        <BaseButton type="submit" size="lg" block :loading="auth.loading">
          <AppIcon name="send" :size="17" />
          Send reset link
        </BaseButton>
      </form>
    </div>

    <div v-else class="rounded-3xl border border-charcoal/8 bg-white p-8 text-center shadow-sm">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
        <AppIcon name="check-circle" :size="28" class="text-gold" />
      </div>
      <h2 class="mt-4 font-display text-xl text-charcoal">Check your inbox</h2>
      <p class="mt-2 text-sm leading-relaxed text-charcoal/60">
        We've sent password reset instructions to <span class="font-semibold text-charcoal">{{ email }}</span>.
      </p>
      <RouterLink to="/login" class="mt-5 inline-block">
        <BaseButton variant="outline">Back to sign in</BaseButton>
      </RouterLink>
    </div>

    <p class="mt-6 text-center text-sm text-charcoal/60">
      Remembered it?
      <RouterLink to="/login" class="font-semibold text-gold transition hover:text-gold-dark">Back to login</RouterLink>
    </p>
  </div>
</template>