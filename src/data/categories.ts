import type { CategoryId } from '@/types'

export interface CategoryInfo {
  id: CategoryId
  label: string
  tagline: string
  image: string
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'men',
    label: 'Men',
    tagline: 'Tailored essentials & everyday staples',
    image: img('1490481651871-ab68de25d43d'),
  },
  {
    id: 'women',
    label: 'Women',
    tagline: 'Elegant silhouettes, effortless finish',
    image: img('1524504388940-b1c1722653e1'),
  },
  {
    id: 'kids',
    label: 'Kids',
    tagline: 'Playful pieces made to last',
    image: img('1485546246426-74dc88dec4d9'),
  },
  {
    id: 'shoes',
    label: 'Shoes',
    tagline: 'From boardroom to boulevard',
    image: img('1543163521-1bf539c55dd2'),
  },
  {
    id: 'accessories',
    label: 'Accessories',
    tagline: 'The finishing touches',
    image: img('1523275335684-37898b6baf30'),
  },
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    tagline: 'Fresh from the atelier',
    image: img('1441986300917-64674bd600d8'),
  },
  {
    id: 'sale',
    label: 'Sale',
    tagline: 'Up to 40% off seasonal pieces',
    image: img('1441984904996-e0b6ba687e04'),
  },
]

export const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export const DEFAULT_COLORS = [
  'Black',
  'White',
  'Beige',
  'Camel',
  'Navy',
  'Grey',
  'Olive',
  'Burgundy',
  'Cream',
  'Rust',
] as const

export const COLOR_SWATCH: Record<string, string> = {
  Black: '#191919',
  White: '#f5f1ea',
  Beige: '#d8c8ab',
  Camel: '#b08d57',
  Navy: '#1f3a5f',
  Grey: '#8a8a8a',
  Olive: '#5f6b4f',
  Burgundy: '#6f2232',
  Cream: '#f1e8da',
  Rust: '#a2522f',
}

export const BRANDS = [
  'Maison Noir',
  'Atelier Lumière',
  'VARDAN',
  'Ostrava Studio',
  'Finch & Co',
  'Elysian',
  'Mono Studio',
  'Argent Denim',
  'Velour Line',
  'Halcyon',
]

export const SHIPPING_FLAT_RATE = 9.95
export const FREE_SHIPPING_THRESHOLD = 150
export const EXPRESS_SHIPPING_FEE = 24.95