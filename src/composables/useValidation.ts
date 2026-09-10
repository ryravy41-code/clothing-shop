export interface FieldRule {
  name: string
  message: string
  test: (value: string) => boolean
}

export const RULES = {
  required: (message = 'This field is required.'): FieldRule => ({
    name: 'required',
    message,
    test: (v) => v.trim().length > 0,
  }),
  email: (message = 'Please enter a valid email address.'): FieldRule => ({
    name: 'email',
    message,
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  }),
  minLength: (len: number, message?: string): FieldRule => ({
    name: 'minLength',
    message: message ?? `Must be at least ${len} characters.`,
    test: (v) => v.length >= len,
  }),
  match: (getExpected: () => string, message = 'Passwords do not match.'): FieldRule => ({
    name: 'match',
    message,
    test: (v) => v === getExpected(),
  }),
  phone: (message = 'Please enter a valid phone number.'): FieldRule => ({
    name: 'phone',
    message,
    test: (v) => /^[+()\-\d ]{7,20}$/.test(v.trim()),
  }),
  zip: (message = 'Please enter a valid postal code.'): FieldRule => ({
    name: 'zip',
    message,
    test: (v) => /^[\dA-Za-z\- ]{3,10}$/.test(v.trim()),
  }),
  cardNumber: (message = 'Card number must contain 16 digits.'): FieldRule => ({
    name: 'cardNumber',
    message,
    test: (v) => v.replace(/\s/g, '').length === 16 && /^\d+$/.test(v.replace(/\s/g, '')),
  }),
  cvc: (message = 'CVC must be 3 digits.'): FieldRule => ({
    name: 'cvc',
    message,
    test: (v) => /^\d{3}$/.test(v),
  }),
} as const

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validate(
  values: Record<string, string>,
  fields: Partial<Record<string, FieldRule[]>>,
): ValidationResult {
  const errors: Record<string, string> = {}
  for (const [field, rules] of Object.entries(fields)) {
    const rulesList = rules ?? []
    for (const rule of rulesList) {
      if (!rule.test(values[field] ?? '')) {
        errors[field] = rule.message
        break
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}