import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ShippingAddress, User } from '@/types'
import { storageGet, storageSet } from '@/utils/storage'
import { mockApi } from '@/services/api'
import { uid } from '@/utils/format'

const USERS_KEY = 'veste_users'
const SESSION_KEY = 'veste_session_user'
const CARDS_KEY_PREFIX = 'veste_cards_'

export interface SavedCard {
  id: string
  brand: string
  last4: string
  expiry: string
  name: string
}

interface StoredUser extends User {
  password: string
}

const DEMO_USER: StoredUser = {
  id: 'u-demo',
  name: 'Ava Mitchell',
  email: 'demo@veste.com',
  password: 'password',
  phone: '+1 (555) 010-2234',
  addresses: [
    {
      id: 'addr-1',
      fullName: 'Ava Mitchell',
      phone: '+1 (555) 010-2234',
      line1: '128 Laurel Avenue, Apt 4B',
      line2: 'Park Heights',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States',
      isDefault: true,
    },
  ],
  createdAt: '2024-03-12T10:00:00Z',
}

function loadUsers(): StoredUser[] {
  const users = storageGet<StoredUser[]>(USERS_KEY, [])
  if (!users.some((u) => u.id === DEMO_USER.id)) {
    users.push(DEMO_USER)
    storageSet(USERS_KEY, users)
  }
  return users
}

export const useAuthStore = defineStore('auth', () => {
  const users = ref<StoredUser[]>(loadUsers())
  const currentUser = ref<User | null>(storageGet(SESSION_KEY, null))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const persistUsers = () => storageSet(USERS_KEY, users.value)
  const persistSession = () => storageSet(SESSION_KEY, currentUser.value)

  const isAuthenticated = computed(() => currentUser.value !== null)
  const fullName = computed(() => currentUser.value?.name ?? '')
  const initials = computed(() =>
    fullName.value
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  )

  async function login(email: string, password: string): Promise<User> {
    loading.value = true
    error.value = null
    try {
      const user = await mockApi<StoredUser>(
        () => {
          const found = users.value.find(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
          )
          if (!found) throw new Error('No account found with this email.')
          if (found.password !== password) throw new Error('Incorrect email or password.')
          return found
        },
        { failMessage: 'Incorrect email or password.' },
      )
      const { password: _pw, ...safe } = user
      currentUser.value = safe
      persistSession()
      return safe
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string): Promise<User> {
    loading.value = true
    error.value = null
    try {
      const user = await mockApi<StoredUser>(() => {
        if (users.value.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
          throw new Error('An account with this email already exists.')
        }
        if (password.length < 8) throw new Error('Password must be at least 8 characters.')
        const record: StoredUser = {
          id: 'u-' + uid(),
          name: name.trim(),
          email: email.trim(),
          password,
          addresses: [],
          createdAt: new Date().toISOString(),
        }
        users.value.push(record)
        persistUsers()
        return record
      })
      const { password: _pw, ...safe } = user
      currentUser.value = safe
      persistSession()
      return safe
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Registration failed.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email: string): Promise<{ ok: true }> {
    loading.value = true
    error.value = null
    try {
      await mockApi(() => {
        const found = users.value.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        )
        if (!found) throw new Error('No account found with this email.')
        found.password = 'reset1234'
        persistUsers()
      })
      return { ok: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Request failed.'
      throw e
    } finally {
      loading.value = false
    }
  }

  function logout() {
    currentUser.value = null
    persistSession()
  }

  function updateProfile(patch: Partial<Pick<User, 'name' | 'phone' | 'birthDate' | 'gender'>>) {
    if (!currentUser.value) return
    currentUser.value = { ...currentUser.value, ...patch }
    const stored = users.value.find((u) => u.id === currentUser.value!.id)
    if (stored) Object.assign(stored, currentUser.value)
    persistUsers()
    persistSession()
  }

  function addAddress(address: Omit<ShippingAddress, 'id'>): ShippingAddress {
    if (!currentUser.value) throw new Error('Not authenticated')
    const full: ShippingAddress = { ...address, id: 'addr-' + uid() }
    if (address.isDefault) {
      currentUser.value.addresses = currentUser.value.addresses.map((a) => ({
        ...a,
        isDefault: false,
      }))
    }
    currentUser.value.addresses.push(full)
    const stored = users.value.find((u) => u.id === currentUser.value!.id)
    if (stored) Object.assign(stored, currentUser.value)
    persistUsers()
    persistSession()
    return full
  }

  function updateAddress(id: string, patch: Partial<ShippingAddress>) {
    if (!currentUser.value) return
    const idx = currentUser.value.addresses.findIndex((a) => a.id === id)
    if (idx < 0) return
    if (patch.isDefault) {
      currentUser.value.addresses = currentUser.value.addresses.map((a) => ({
        ...a,
        isDefault: false,
      }))
    }
    currentUser.value.addresses[idx] = { ...currentUser.value.addresses[idx], ...patch }
    const stored = users.value.find((u) => u.id === currentUser.value!.id)
    if (stored) Object.assign(stored, currentUser.value)
    persistUsers()
    persistSession()
  }

  function removeAddress(id: string) {
    if (!currentUser.value) return
    const target = currentUser.value.addresses.find((a) => a.id === id)
    currentUser.value.addresses = currentUser.value.addresses.filter((a) => a.id !== id)
    if (target?.isDefault && currentUser.value.addresses.length > 0) {
      currentUser.value.addresses[0].isDefault = true
    }
    const stored = users.value.find((u) => u.id === currentUser.value!.id)
    if (stored) Object.assign(stored, currentUser.value)
    persistUsers()
    persistSession()
  }

  function confirmDeletion() {
    if (!currentUser.value) return false
    users.value = users.value.filter((u) => u.id !== currentUser.value!.id)
    storageSet(USERS_KEY, users.value)
    logout()
    return true
  }

  const address = computed(() =>
    currentUser.value?.addresses.find((a) => a.isDefault) ?? currentUser.value?.addresses[0] ?? null,
  )

  const cardsKey = () => (currentUser.value ? `${CARDS_KEY_PREFIX}${currentUser.value.id}` : '')
  const savedCards = ref<SavedCard[]>(storageGet(cardsKey(), []))

  function refreshCards() {
    if (!currentUser.value) {
      savedCards.value = []
      return
    }
    savedCards.value = storageGet(cardsKey(), [])
  }

  function addCard(card: { brand: string; last4: string; expiry: string; name: string }) {
    const record: SavedCard = { id: 'card-' + uid(), ...card }
    const updated = [...savedCards.value, record]
    savedCards.value = updated
    if (currentUser.value) storageSet(cardsKey(), updated)
    refreshCards()
    return record
  }

  function removeCard(id: string) {
    const updated = savedCards.value.filter((c) => c.id !== id)
    savedCards.value = updated
    if (currentUser.value) storageSet(cardsKey(), updated)
    refreshCards()
  }

  function updatePassword(current: string, next: string): { ok: boolean; message: string } {
    if (!currentUser.value) return { ok: false, message: 'Not authenticated.' }
    const stored = users.value.find((u) => u.id === currentUser.value!.id)
    if (!stored || stored.password !== current) return { ok: false, message: 'Current password is incorrect.' }
    stored.password = next
    persistUsers()
    return { ok: true, message: 'Password updated successfully.' }
  }

  return {
    users,
    currentUser,
    loading,
    error,
    isAuthenticated,
    fullName,
    initials,
    login,
    register,
    forgotPassword,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    confirmDeletion,
    address,
    savedCards,
    refreshCards,
    addCard,
    removeCard,
    updatePassword,
  }
})

export type AuthStore = ReturnType<typeof useAuthStore>