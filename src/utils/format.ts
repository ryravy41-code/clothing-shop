export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function discountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function uid(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}