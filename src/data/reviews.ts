import type { Review } from '@/types'
import { PRODUCTS } from './products'

const AUTHORS = [
  'Sophia M.',
  'James T.',
  'Amara O.',
  'Daniel R.',
  'Elena K.',
  'Marcus L.',
  'Priya S.',
  'Oliver W.',
  'Nadia B.',
  'Sam H.',
  'Charlotte D.',
  'Liam F.',
  'Yuki T.',
  'Grace A.',
]

const TITLES = {
  5: ['Exceeded expectations', 'Perfect from day one', 'Absolutely love it', 'Worth every penny'],
  4: ['Really great quality', 'Very happy with this', 'Solid purchase'],
  3: ['Good but not perfect', 'Decent for the price', 'Mixed feelings'],
  2: ['Not quite right for me', 'Expected better quality'],
}

const REVIEWS_5 = [
  'The craftsmanship is stunning — you can feel the quality in every stitch. Fits perfectly and photographs even better.',
  'I get compliments every single time I wear it. The fabric is luxuriously soft and the cut is exactly as pictured.',
  'Beautifully made and shipped fast. The fit runs true to size and the colour is richer in person.',
  'This has quickly become my favourite piece. Premium feel, beautiful drape, and it held up great after washing.',
]
const REVIEWS_4 = [
  'Great quality overall. Slightly roomier than expected but nothing a tailor cannot sort. Would buy again.',
  'Very well made and the colour looks great. Took a star off only because delivery took a couple of days longer.',
  'Solid buy. Material feels premium and the details are clean. Solid match to the photos.',
]
const REVIEWS_3 = [
  'Looks nice and the quality is decent, though a bit pricier than similar pieces I own.',
  'Fine for the price. The fit is a little off for me personally, but the material is good.',
]
const REVIEWS_2 = [
  'The design is lovely but the sizing chart was misleading for me. Ended up exchanging.',
]

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]
}

const daysAgo = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

let reviewId = 1000

export function buildReviews(): Review[] {
  const all: Review[] = []
  PRODUCTS.forEach((product, pIndex) => {
    const count = Math.min(product.reviewCount, 3 + (pIndex % 4))
    for (let i = 0; i < count; i++) {
      const seed = pIndex * 7 + i * 3
      let rating = 5
      if (seed % 7 === 0) rating = 4
      if (seed % 11 === 0) rating = 3
      if (seed % 17 === 0) rating = 2
      all.push({
        id: reviewId++,
        productId: product.id,
        author: pick(AUTHORS, seed),
        rating,
        title: pick(TITLES[rating as keyof typeof TITLES], seed),
        text: pick(
          rating === 5
            ? REVIEWS_5
            : rating === 4
              ? REVIEWS_4
              : rating === 3
                ? REVIEWS_3
                : REVIEWS_2,
          seed,
        ),
        date: daysAgo(seed + 5),
        verifiedPurchase: seed % 5 !== 0,
      })
    }
  })
  return all
}

export const REVIEWS = buildReviews()

export const reviewsForProduct = (productId: number): Review[] =>
  REVIEWS.filter((r) => r.productId === productId).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

export const ratingSummary = (productId: number) => {
  const reviews = reviewsForProduct(productId)
  const buckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => {
    buckets[r.rating as keyof typeof buckets]++
  })
  return { total: reviews.length, buckets }
}