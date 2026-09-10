type StorageType = 'local' | 'session'

function getType(type: StorageType): Storage {
  return type === 'session' ? window.sessionStorage : window.localStorage
}

export function storageGet<T>(key: string, fallback: T, type: StorageType = 'local'): T {
  try {
    const raw = getType(type).getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function storageSet<T>(key: string, value: T, type: StorageType = 'local'): void {
  try {
    getType(type).setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — fail silently */
  }
}

export function storageRemove(key: string, type: StorageType = 'local'): void {
  getType(type).removeItem(key)
}