<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { validate, RULES } from '@/composables/useValidation'
import type { ShippingAddress } from '@/types'

const auth = useAuthStore()
const toasts = useToastStore()

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

const blank = () => ({
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  isDefault: false,
})
const form = ref(blank())
const errors = ref<Record<string, string>>({})

function openNew() {
  editingId.value = null
  form.value = blank()
  errors.value = {}
  modalOpen.value = true
}

function openEdit(address: ShippingAddress) {
  editingId.value = address.id
  form.value = {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 ?? '',
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
  }
  errors.value = {}
  modalOpen.value = true
}

function save() {
  const result = validate(
    {
      fullName: form.value.fullName,
      phone: form.value.phone,
      line1: form.value.line1,
      city: form.value.city,
      state: form.value.state,
      postalCode: form.value.postalCode,
      country: form.value.country,
    },
    {
      fullName: [RULES.required('Full name is required.')],
      phone: [RULES.phone()],
      line1: [RULES.required('Street address is required.')],
      city: [RULES.required('City is required.')],
      state: [RULES.required('State is required.')],
      postalCode: [RULES.zip()],
      country: [RULES.required('Country is required.')],
    },
  )
  errors.value = result.errors
  if (!result.valid) return
  if (editingId.value) {
    auth.updateAddress(editingId.value, { ...form.value })
    toasts.success('Address updated', 'Your shipping address has been saved.')
  } else {
    auth.addAddress({ ...form.value })
    toasts.success('Address added', 'Your shipping address has been saved.')
  }
  modalOpen.value = false
}

function confirmDelete() {
  if (!deletingId.value) return
  auth.removeAddress(deletingId.value)
  toasts.success('Address removed', 'The address has been deleted.')
  deletingId.value = null
}

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Japan']
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Account</p>
        <h1 class="mt-1 font-display text-3xl text-charcoal">Addresses</h1>
      </div>
      <BaseButton size="sm" @click="openNew">
        <AppIcon name="plus" :size="15" />
        Add new address
      </BaseButton>
    </div>

    <EmptyState
      v-if="(auth.currentUser?.addresses.length ?? 0) === 0"
      class="mt-8"
      icon="map-pin"
      title="No saved addresses"
      description="Add an address to speed up checkout."
      action-label="Add your first address"
      @action="openNew"
    />

    <ul v-else class="mt-6 grid gap-4 sm:grid-cols-2">
      <li
        v-for="address in auth.currentUser?.addresses ?? []"
        :key="address.id"
        class="relative flex flex-col rounded-3xl border bg-white p-6 transition"
        :class="address.isDefault ? 'border-gold/40 shadow-lg shadow-gold/5' : 'border-charcoal/8 hover:shadow-md'"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="font-semibold text-charcoal">{{ address.fullName }}</p>
          <BaseCheckbox
            :model-value="address.isDefault"
            label="Default"
            @update:model-value="auth.updateAddress(address.id, { isDefault: $event })"
          />
        </div>
        <div class="mt-3 flex-1 text-sm leading-relaxed text-charcoal/65">
          <p>{{ address.line1 }}{{ address.line2 ? ', ' + address.line2 : '' }}</p>
          <p>{{ address.city }}, {{ address.state }} {{ address.postalCode }}</p>
          <p>{{ address.country }}</p>
          <p class="mt-2 flex items-center gap-1.5 text-xs text-charcoal/45">
            <AppIcon name="phone" :size="12" />
            {{ address.phone }}
          </p>
        </div>
        <div class="mt-4 flex gap-3 border-t border-charcoal/8 pt-4">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-charcoal/65 transition hover:bg-bone hover:text-charcoal"
            @click="openEdit(address)"
          >
            <AppIcon name="pen" :size="13" />
            Edit
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-clay/80 transition hover:bg-clay/10 hover:text-clay"
            @click="deletingId = address.id"
          >
            <AppIcon name="trash" :size="13" />
            Delete
          </button>
        </div>
      </li>
    </ul>

    <BaseModal
      :open="modalOpen"
      :title="editingId ? 'Edit address' : 'Add a new address'"
      subtitle="We only use this to deliver your order."
      size="md"
      @close="modalOpen = false"
    >
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="save">
        <div class="sm:col-span-2">
          <BaseInput v-model="form.fullName" label="Full name" :error="errors.fullName" :required="true" />
        </div>
        <BaseInput v-model="form.phone" label="Phone" type="tel" icon="phone" :error="errors.phone" :required="true" />
        <div class="sm:col-span-2">
          <BaseInput v-model="form.line1" label="Street address" :error="errors.line1" :required="true" />
        </div>
        <div class="sm:col-span-2">
          <BaseInput v-model="form.line2" label="Apartment, suite, etc. (optional)" />
        </div>
        <BaseInput v-model="form.city" label="City" :error="errors.city" :required="true" />
        <BaseInput v-model="form.state" label="State / Province" :error="errors.state" :required="true" />
        <BaseInput v-model="form.postalCode" label="Postal code" :error="errors.postalCode" :required="true" />
        <BaseSelect
          v-model="form.country"
          label="Country"
          :required="true"
          :options="countries.map((c) => ({ label: c, value: c }))"
        />
        <div class="sm:col-span-2">
          <BaseCheckbox
            v-model="form.isDefault"
            label="Set as default shipping address"
          />
        </div>
        <div class="sm:col-span-2 flex gap-3">
          <BaseButton variant="outline" class="flex-1" @click="modalOpen = false">Cancel</BaseButton>
          <BaseButton type="submit" class="flex-1">{{ editingId ? 'Save changes' : 'Add address' }}</BaseButton>
        </div>
      </form>
    </BaseModal>

    <BaseModal :open="deletingId !== null" title="Delete this address?" size="sm" @close="deletingId = null">
      <p class="text-sm leading-relaxed text-charcoal/65">This shipping address will be permanently removed from your account.</p>
      <div class="mt-6 flex gap-3">
        <BaseButton variant="outline" class="flex-1" @click="deletingId = null">Cancel</BaseButton>
        <BaseButton variant="danger" class="flex-1" @click="confirmDelete">Delete</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>