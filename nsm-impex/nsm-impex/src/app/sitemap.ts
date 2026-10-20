import type { MetadataRoute } from 'next'
import { getAllCategories } from '@/lib/categories/store'
import { getAllProducts } from '@/lib/products/store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const products = await getAllProducts()
  const categories = await getAllCategories()

  return [
    '',
    '/products',
    '/about',
    '/contact',
    '/inquiry',
    ...categories.map((c) => `/products/${c.slug}`),
    ...products.map((p) => `/products/${p.category}/${p.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }))
}
