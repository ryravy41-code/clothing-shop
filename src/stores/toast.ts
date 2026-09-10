import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Toast } from '@/types'
import { uid } from '@/utils/format'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function push(toast: Omit<Toast, 'id'>) {
    const id = Number(uid())
    toasts.value.push({ ...toast, id })
    window.setTimeout(() => remove(id), 4000)
  }

  const success = (title: string, message?: string) => push({ type: 'success', title, message })
  const error = (title: string, message?: string) => push({ type: 'error', title, message })
  const info = (title: string, message?: string) => push({ type: 'info', title, message })
  const coupon = (title: string, message?: string) => push({ type: 'coupon', title, message })

  return { toasts, remove, push, success, error, info, coupon }
})