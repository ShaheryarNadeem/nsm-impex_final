import type { Category, CategorySlug } from './types'

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-tops',
    slug: 'tops',
    name: 'Tops',
    description:
      'Explore our collection of contemporary tops designed for comfort, quality and modern global apparel markets.',
    image: '/products/pullover-hoodie-custom-1.png',
    subcategories: ['Hoodies', 'Sweatshirts', 'T-Shirts', 'Shirts', 'Other Tops'],
  },
  {
    id: 'cat-bottoms',
    slug: 'bottoms',
    name: 'Bottoms',
    description:
      'Wholesale bottoms built for comfort, utility and consistent bulk production.',
    image: '/products/cargo-joggers-custom-1.png',
    subcategories: [
      'Cargo Joggers',
      'Basketball shorts',
      'Cargo Pants',
      'cargo shorts',
      'denim shorts',
      'Jogger Pants',
      'Lounge Pants',
      'Parachute Pants',
      'shorts',
      'straight leg pants',
      'Sweat pants',
      'sweat shorts',
      'wide legs pants',
    ],
  },
  {
    id: 'cat-jackets-outerwear',
    slug: 'jackets-outerwear',
    name: 'Jackets & Outerwear',
    description:
      'Wholesale jackets and outerwear for brands and exporters — from bombers to seasonal layers.',
    image: '/products/bomber-jackets-custom-1.png',
    subcategories: ['Bomber jackets', 'Coach jacket', 'denim jacket', 'Fleece jacket', 'Lightweight jacket', 'Sherpa jacket'],
  },
  {
    id: 'cat-sets',
    slug: 'sets',
    name: 'Sets',
    description:
      'Matched co-ords and utility sets designed for cohesive wholesale apparel collections.',
    image: '/products/cargo-set-custom-1.png',
    subcategories: ['Cargo Sets', 'Casual Sets', 'Lounge Sets', 'Tracksuits', 'Co-ord Sets'],
  },
  {
    id: 'cat-accessories',
    slug: 'accessories',
    name: 'Accessories',
    description:
      'Caps, beanies, socks, gloves, and knitted winter accessories for global wholesale programs.',
    image: '/products/accessories-custom-1.jpg',
    subcategories: ['Cap/Hat', 'Socks', 'Mufflers', 'Gloves', 'Neck Warmer & Caps'],
  },
]

/** Active storefront categories. Fallback seed if DB/cache not initialized */
export const categories: Category[] = DEFAULT_CATEGORIES

export const categoryImages: Record<string, string> = {
  tops: '/products/pullover-hoodie-custom-1.png',
  bottoms: '/products/cargo-joggers-custom-1.png',
  'jackets-outerwear': '/products/bomber-jackets-custom-1.png',
  sets: '/products/cargo-set-custom-1.png',
  accessories: '/products/accessories-custom-1.jpg',
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function categoryPath(slug: CategorySlug | string) {
  return `/products/${slug}`
}
