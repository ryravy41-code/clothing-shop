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
    image: 'https://i.pinimg.com/1200x/27/0d/b4/270db45adf17fe3be69ca93b6f62ef86.jpg'
  },
  {
    id: 'women',
    label: 'Women',
    tagline: 'Elegant silhouettes, effortless finish',
    image: 'https://i.pinimg.com/1200x/d0/65/5e/d0655e9e66c5f5e64431facff100fbf7.jpg',
  },
  {
    id: 'kids',
    label: 'Kids',
    tagline: 'Playful pieces made to last',
    image: 'https://i.pinimg.com/736x/df/0d/01/df0d018fcebe3ee099b8caf00e16dc8b.jpg',
  },
  {
    id: 'shoes',
    label: 'Shoes',
    tagline: 'From boardroom to boulevard',
    image: 'https://i.pinimg.com/1200x/85/de/fe/85defea5e2c60701b0879f0e25fae7f1.jpg',
  },
  {
    id: 'accessories',
    label: 'Accessories',
    tagline: 'The finishing touches',
    image: 'https://i.pinimg.com/736x/15/64/00/156400223b4ac2957fdb86ea8a91876c.jpg',
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