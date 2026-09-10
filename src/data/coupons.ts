import type { Coupon } from '@/types'

export const COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    description: '10% off your first order',
    expiresAt: '2027-12-31',
  },
  {
    code: 'SAVE20',
    type: 'percent',
    value: 20,
    minOrder: 200,
    description: '20% off orders over $200',
    expiresAt: '2027-06-30',
  },
  {
    code: 'SHIPFREE',
    type: 'shipping',
    value: 0,
    description: 'Free standard shipping',
    expiresAt: '2027-12-31',
  },
  {
    code: 'SPRING15',
    type: 'percent',
    value: 15,
    minOrder: 120,
    description: '15% off orders over $120',
    expiresAt: '2026-09-30',
  },
  {
    code: 'FLAT25',
    type: 'fixed',
    value: 25,
    minOrder: 150,
    description: '$25 off orders over $150',
    expiresAt: '2027-03-31',
  },
]

export const findCoupon = (code: string): Coupon | undefined => {
  const normalized = code.trim().toUpperCase()
  return COUPONS.find((c) => c.code === normalized)
}