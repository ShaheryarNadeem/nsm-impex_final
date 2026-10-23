export type CategorySlug = 'tops' | 'bottoms' | 'sets' | 'jackets-outerwear' | (string & {})

export type ProductImage = {
  id: string
  url: string
  alt?: string
  kind?: 'main' | 'front' | 'back' | 'detail' | 'color' | 'additional'
}

export type ProductColor = {
  name: string
  hex: string
}

export type Product = {
  id: string
  name: string
  slug: string
  category: CategorySlug
  subcategory?: string
  productCode?: string
  description?: string
  shortDescription?: string
  images: ProductImage[]
  fabric?: string
  composition?: string
  gsm?: string
  fit?: string
  sizes?: string
  colors?: string
  sizeOptions?: string[]
  colorOptions?: ProductColor[]
  price?: number
  currency?: string
  priceNote?: string
  season?: string
  customization?: string
  packaging?: string
  moq?: string
  leadTime?: string
  featured?: boolean
  published?: boolean
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
}

export type Category = {
  id: string
  slug: string
  name: string
  description?: string
  image?: string
  subcategories: string[]
}

export type Inquiry = {
  id: string
  name: string
  company?: string
  email: string
  phone?: string
  country?: string
  product?: string
  productCode?: string
  quantity?: string
  size?: string
  color?: string
  message?: string
  attachmentUrl?: string
  createdAt: string
}

export const PLACEHOLDER = 'Available on request'

export const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export const DEFAULT_COLORS: ProductColor[] = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Charcoal', hex: '#3a3a3a' },
  { name: 'Grey', hex: '#8a8a8a' },
  { name: 'Navy', hex: '#1f2a44' },
  { name: 'Beige', hex: '#d6c6a8' },
  { name: 'Olive', hex: '#5c6b5a' },
]
