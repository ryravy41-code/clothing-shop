import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  DeliveryMethod,
  Order,
  OrderItem,
  OrderStatus,
  ShippingAddress,
} from '@/types'
import { storageGet, storageSet } from '@/utils/storage'
import { mockApi } from '@/services/api'

export const ORDER_STATUSES: OrderStatus[] = [
  'processing',
  'confirmed',
  'shipped',
  'out-for-delivery',
  'delivered',
]

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  processing: 'Order placed',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export interface PlaceOrderInput {
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  couponCode?: string
  deliveryMethod: DeliveryMethod
  paymentMethod: string
  shippingAddress: ShippingAddress
}

const orderKey = (userId: string) => `veste_orders_${userId}`

function seedOrders(): Order[] {
  const now = Date.now()
  const day = 86400000
  const address: ShippingAddress = {
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
  }
  const mk = (d: number): string => new Date(now - d).toISOString()

  const seed: Order[] = [
    {
      id: 'VST-48291',
      userId: 'placeholder',
      items: [
        {
          productId: 1,
          name: 'Essential Cotton Tee',
          image:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
          price: 45,
          quantity: 2,
          size: 'M',
          color: 'White',
        },
        {
          productId: 23,
          name: 'The Court Classic Sneaker',
          image:
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
          price: 120,
          quantity: 1,
          size: '42',
          color: 'White',
        },
      ],
      subtotal: 210,
      shipping: 0,
      discount: 21,
      total: 189,
      couponCode: 'WELCOME10',
      status: 'delivered',
      deliveryMethod: 'standard',
      paymentMethod: 'card •••• 4242',
      shippingAddress: address,
      createdAt: mk(28 * day),
      tracking: {
        processing: mk(28 * day),
        confirmed: mk(27 * day),
        shipped: mk(24 * day),
        'out-for-delivery': mk(22 * day),
        delivered: mk(21 * day),
        cancelled: '',
      },
    },
    {
      id: 'VST-49832',
      userId: 'placeholder',
      items: [
        {
          productId: 9,
          name: 'Floral Midi Dress',
          image:
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
          price: 140,
          quantity: 1,
          size: 'M',
          color: 'Cream',
        },
      ],
      subtotal: 140,
      shipping: 9.95,
      discount: 0,
      total: 149.95,
      status: 'shipped',
      deliveryMethod: 'standard',
      paymentMethod: 'wallet',
      shippingAddress: address,
      createdAt: mk(5 * day),
      tracking: {
        processing: mk(5 * day),
        confirmed: mk(4 * day),
        shipped: mk(2 * day),
        'out-for-delivery': '',
        delivered: '',
        cancelled: '',
      },
    },
    {
      id: 'VST-51106',
      userId: 'placeholder',
      items: [
        {
          productId: 27,
          name: 'Minimalist Leather Watch',
          image:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          price: 195,
          quantity: 1,
          size: 'One Size',
          color: 'Camel',
        },
      ],
      subtotal: 195,
      shipping: 0,
      discount: 0,
      total: 195,
      status: 'processing',
      deliveryMethod: 'express',
      paymentMethod: 'card •••• 9002',
      shippingAddress: address,
      createdAt: mk(1 * day),
      tracking: {
        processing: mk(1 * day),
        confirmed: '',
        shipped: '',
        'out-for-delivery': '',
        delivered: '',
        cancelled: '',
      },
    },
  ]

  return seed
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const currentUserId = ref<string | null>(null)
  const placing = ref(false)

  function loadOrders(userId: string) {
    currentUserId.value = userId
    const stored = storageGet<Order[]>(orderKey(userId), [])
    if (stored.length === 0) {
      const seeded = seedOrders().map((o) => ({ ...o, userId }))
      storageSet(orderKey(userId), seeded)
      orders.value = seeded
    } else {
      orders.value = stored
    }
  }

  function persist() {
    if (!currentUserId.value) return
    storageSet(orderKey(currentUserId.value), orders.value)
  }

  async function placeOrder(input: PlaceOrderInput): Promise<Order> {
    placing.value = true
    try {
      const order = await mockApi(
        () => {
          const id = `VST-${Math.floor(10000 + Math.random() * 89999)}`
          const now = new Date().toISOString()
          const created: Order = {
            id,
            userId: currentUserId.value ?? 'guest',
            ...input,
            total: input.subtotal + input.shipping - input.discount,
            status: 'processing',
            createdAt: now,
            tracking: {
              processing: now,
              confirmed: '',
              shipped: '',
              'out-for-delivery': '',
              delivered: '',
              cancelled: '',
            },
          }
          orders.value.unshift(created)
          persist()
          return created
        },
        { failRate: 0.04, failMessage: 'Payment could not be authorised. Please try again.' },
      )
      return order
    } finally {
      placing.value = false
    }
  }

  const getOrder = (id: string): Order | undefined => orders.value.find((o) => o.id === id)

  const orderById = computed(() => new Map(orders.value.map((o) => [o.id, o])))

  function getById(id: string): Order | undefined {
    return orderById.value.get(id)
  }

  const cancelOrder = (id: string) => {
    const order = getOrder(id)
    if (order && order.status === 'processing') {
      order.status = 'cancelled'
      order.tracking.cancelled = new Date().toISOString()
      persist()
      return true
    }
    return false
  }

  interface TrackStep {
    status: OrderStatus
    label: string
    date: string | null
    isCurrent: boolean
    isDone: boolean
  }

  function trackSteps(order: Order): TrackStep[] {
    const currentIdx = ORDER_STATUSES.indexOf(order.status)
    let cumulative = 0
    return ORDER_STATUSES.map((status) => {
      const statusIdx = ORDER_STATUSES.indexOf(status)
      const startedBefore = order.tracking[status]
      cumulative = statusIdx <= currentIdx && startedBefore ? 1 + cumulative : 0
      return {
        status,
        label: ORDER_STATUS_LABEL[status],
        date: order.tracking[status] || null,
        isCurrent: statusIdx === currentIdx,
        isDone: statusIdx < currentIdx || (statusIdx === currentIdx && Boolean(startedBefore)),
      }
    })
  }

  const progress = (order: Order): number => {
    const idx = ORDER_STATUSES.indexOf(order.status)
    return idx === -1 ? 0 : (idx / (ORDER_STATUSES.length - 1)) * 100
  }

  type PurchaseSummary = {
    anyone: Order[]
  }

  const purchaseSummary = computed<PurchaseSummary>(() => ({ anyone: orders.value }))

  return {
    orders,
    placing,
    loadOrders,
    placeOrder,
    getOrder,
    getById,
    cancelOrder,
    trackSteps,
    progress,
    purchaseSummary,
  }
})