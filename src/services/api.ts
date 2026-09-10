/* Simulated REST-style mock API with realistic latency and error behaviour. */

export class ApiError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let sequence = 0

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function mockDelay(): Promise<void> {
  sequence += 1
  return delay(350 + ((sequence * 137) % 450))
}

interface MockOptions {
  failRate?: number
  failMessage?: string
  failStatus?: number
  min?: number
  max?: number
}

export function mockApi<T>(
  resolver: () => T | Promise<T>,
  options: MockOptions = {},
): Promise<T> {
  const { failRate = 0, failMessage = 'Something went wrong on our end.', failStatus = 500 } = options

  let result: Promise<void>

  if (options.min !== undefined && options.max !== undefined) {
    const min = Math.min(options.min, options.max)
    const max = Math.max(options.min, options.max)
    result = delay(min + Math.random() * (max - min))
  } else {
    result = mockDelay()
  }

  return result.then(async () => {
    if (failRate > 0 && Math.random() < failRate) {
      throw new ApiError(failMessage, failStatus)
    }
    return resolver()
  })
}

export const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize),
  }
}