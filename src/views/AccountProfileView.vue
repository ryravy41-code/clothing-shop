<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { validate, RULES } from '@/composables/useValidation'

const router = useRouter()
const auth = useAuthStore()
const toasts = useToastStore()

const form = ref({
  name: auth.currentUser?.name ?? '',
  phone: auth.currentUser?.phone ?? '',
  birthDate: auth.currentUser?.birthDate ?? '',
  gender: auth.currentUser?.gender ?? '',
})
const errors = ref<Record<string, string>>({})

const pw = ref({ current: '', next: '', confirm: '' })
const pwErrors = ref<Record<string, string>>({})

const cardForm = ref({ name: '', number: '', expiry: '', cvv: '' })
const cardErrors = ref<Record<string, string>>({})
const cardOpen = ref(false)

const deleteOpen = ref(false)

function saveProfile() {
  const result = validate(form.value, { name: [RULES.required('Name is required.')] })
  errors.value = result.errors
  if (!result.valid) return
  auth.updateProfile({ ...form.value })
  toasts.success('Profile updated', 'Your details have been saved.')
}

function changePassword() {
  const result = validate(
    { current: pw.value.current, next: pw.value.next, confirm: pw.value.confirm },
    {
      current: [RULES.required('Enter your current password.')],
      next: [RULES.required('Enter a new password.'), RULES.minLength(8, 'Must be at least 8 characters.')],
      confirm: [RULES.required('Confirm your new password.'), RULES.match(() => pw.value.next)],
    },
  )
  pwErrors.value = result.errors
  if (!result.valid) return
  const out = auth.updatePassword(pw.value.current, pw.value.next)
  if (out.ok) {
    toasts.success('Password changed', out.message)
    pw.value = { current: '', next: '', confirm: '' }
  } else {
    pwErrors.value.current = out.message
  }
}

function removeCard() {
  if (!selectedCardId.value) return
  auth.removeCard(selectedCardId.value)
  selectedCardId.value = null
  toasts.success('Card removed', 'The card was removed from your wallet.')
}

const selectedCardId = ref<string | null>(null)

const cardBrand = () =>
  cardForm.value.number.startsWith('4') ? 'Visa' : cardForm.value.number.startsWith('5') ? 'Mastercard' : 'Card'

function saveCard() {
  const brand = cardBrand()
  const result = validate(
    { name: cardForm.value.name, number: cardForm.value.number, expiry: cardForm.value.expiry, cvv: cardForm.value.cvv },
    {
      name: [RULES.required('Name on card is required.')],
      number: [RULES.cardNumber('Card number must be 16 digits.')],
      expiry: [
        RULES.required('Expiry is required.'),
        {
          name: 'expiry',
          message: 'Use MM/YY format.',
          test: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim()),
        },
      ],
      cvv: [RULES.cvc()],
    },
  )
  cardErrors.value = result.errors
  if (!result.valid) return
  auth.addCard({ brand, last4: cardForm.value.number.slice(-4), expiry: cardForm.value.expiry, name: cardForm.value.name })
  cardOpen.value = false
  cardForm.value = { name: '', number: '', expiry: '', cvv: '' }
  cardErrors.value = {}
  toasts.success('Card saved', 'This card can now be used at checkout.')
}
</script>

<template>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Account</p>
    <h1 class="mt-1 font-display text-3xl text-charcoal">Profile</h1>

    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <!-- Personal details -->
      <div class="rounded-3xl border border-charcoal/8 bg-white p-6 lg:col-span-2">
        <h2 class="font-display text-lg text-charcoal">Personal details</h2>
        <form class="mt-5 grid gap-4 sm:grid-cols-2" @submit.prevent="saveProfile">
          <div class="sm:col-span-2">
            <BaseInput v-model="form.name" label="Full name" :required="true" :error="errors.name" />
          </div>
          <BaseInput v-model="form.phone" label="Phone" type="tel" icon="phone" />
          <BaseInput v-model="form.birthDate" label="Date of birth" type="date" />
          <BaseSelect
            v-model="form.gender"
            label="Gender"
            placeholder="Select gender"
            :options="[
              { label: 'Female', value: 'Female' },
              { label: 'Male', value: 'Male' },
              { label: 'Non-binary', value: 'Non-binary' },
              { label: 'Prefer not to say', value: 'Prefer not to say' },
            ]"
          />
          <div class="flex items-end justify-end">
            <BaseButton type="submit" size="sm">
              <AppIcon name="check" :size="15" />
              Save changes
            </BaseButton>
          </div>
        </form>
      </div>

      <!-- Password -->
      <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
        <h2 class="font-display text-lg text-charcoal">Password</h2>
        <form class="mt-5 space-y-4" @submit.prevent="changePassword">
          <BaseInput v-model="pw.current" label="Current password" type="password" icon="lock" :error="pwErrors.current" autocomplete="current-password" />
          <BaseInput v-model="pw.next" label="New password" type="password" icon="lock" hint="At least 8 characters." :error="pwErrors.next" autocomplete="new-password" />
          <BaseInput v-model="pw.confirm" label="Confirm new password" type="password" icon="lock" :error="pwErrors.confirm" autocomplete="new-password" />
          <BaseButton type="submit" variant="outline" size="sm" class="w-full">Update password</BaseButton>
        </form>
      </div>

      <!-- Saved cards -->
      <div class="rounded-3xl border border-charcoal/8 bg-white p-6 lg:col-span-2">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg text-charcoal">Saved cards</h2>
          <BaseButton variant="outline" size="sm" @click="cardOpen = true">
            <AppIcon name="plus" :size="15" />
            Add card
          </BaseButton>
        </div>

        <EmptyState
          v-if="auth.savedCards.length === 0"
          class="mt-4"
          icon="credit-card"
          title="No saved cards"
          description="Add a card for one-tap checkout."
        />

        <ul v-else class="mt-5 grid gap-4 sm:grid-cols-2">
          <li
            v-for="card in auth.savedCards"
            :key="card.id"
            class="relative overflow-hidden rounded-2xl border border-charcoal/10 bg-bone p-5"
          >
            <div class="flex items-start justify-between">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-bone">
                <AppIcon name="credit-card" :size="17" />
              </span>
              <button
                type="button"
                class="rounded-full p-1.5 text-charcoal/40 transition hover:bg-clay/10 hover:text-clay"
                :aria-label="`Remove ${card.brand} card`"
                @click="selectedCardId = card.id; deleteOpen = true"
              >
                <AppIcon name="trash" :size="16" />
              </button>
            </div>
            <p class="mt-4 font-mono text-sm tracking-wide text-charcoal">•••• •••• •••• {{ card.last4 }}</p>
            <div class="mt-3 flex items-center justify-between text-xs">
              <span class="font-medium text-charcoal/70">{{ card.brand }}</span>
              <span class="text-charcoal/45">Expires {{ card.expiry }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Danger zone -->
      <div class="rounded-3xl border border-clay/20 bg-clay/5 p-6">
        <h2 class="font-display text-lg text-clay">Danger zone</h2>
        <p class="mt-2 text-sm leading-relaxed text-charcoal/60">
          Permanently delete your account and all saved data. This cannot be undone.
        </p>
        <BaseButton variant="danger" size="sm" class="mt-4 w-full" @click="deleteOpen = true">
          <AppIcon name="trash" :size="15" />
          Delete account
        </BaseButton>
      </div>
    </div>

    <BaseModal :open="cardOpen" title="Add a card" subtitle="Your details are encrypted (demo only — nothing is stored on a server)." size="sm" @close="cardOpen = false">
      <form class="space-y-4" @submit.prevent="saveCard">
        <BaseInput v-model="cardForm.name" label="Name on card" :error="cardErrors.name" :required="true" />
        <BaseInput v-model="cardForm.number" label="Card number" inputmode="numeric" placeholder="4242 4242 4242 4242" :maxlength="16" :error="cardErrors.number" :required="true" />
        <div class="grid grid-cols-2 gap-4">
          <BaseInput v-model="cardForm.expiry" label="Expiry (MM/YY)" placeholder="08/29" :maxlength="5" :error="cardErrors.expiry" :required="true" />
          <BaseInput v-model="cardForm.cvv" label="CVV" type="password" inputmode="numeric" placeholder="123" :maxlength="3" :error="cardErrors.cvv" :required="true" />
        </div>
        <BaseButton type="submit" block>Save card</BaseButton>
      </form>
    </BaseModal>

    <BaseModal
      :open="selectedCardId !== null"
      title="Remove this card?"
      size="sm"
      @close="selectedCardId = null"
    >
      <p class="text-sm leading-relaxed text-charcoal/65">This card will be removed from your wallet. You can add it again later.</p>
      <div class="mt-6 flex gap-3">
        <BaseButton variant="outline" class="flex-1" @click="selectedCardId = null">Keep it</BaseButton>
        <BaseButton variant="danger" class="flex-1" @click="removeCard">Remove</BaseButton>
      </div>
    </BaseModal>

    <BaseModal
      :open="deleteOpen"
      title="Delete your account?"
      subtitle="This cannot be undone."
      size="sm"
      @close="deleteOpen = false"
    >
      <p class="text-sm leading-relaxed text-charcoal/65">
        All your details, orders and saved payment methods will be permanently removed.
      </p>
      <div class="mt-6 flex gap-3">
        <BaseButton variant="outline" class="flex-1" @click="deleteOpen = false">Cancel</BaseButton>
        <BaseButton
          variant="danger"
          class="flex-1"
          @click="auth.confirmDeletion(); deleteOpen = false; toasts.success('Account deleted', 'Sorry to see you go.'); router.push('/')"
        >
          Delete forever
        </BaseButton>
      </div>
    </BaseModal>
  </div>
</template>