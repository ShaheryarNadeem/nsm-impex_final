import type { MetadataRoute } from 'next'
import { getAllCategories } from '@/lib/categories/store'
import { getAllProducts } from '@/lib/products/store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nsm-impex.com').replace(/\/+$/, '')
  const now = new Date()

  const [products, categories] = await Promise.all([
    getAllProducts(false),
    getAllCategories(),
  ])

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/inquiry`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/products/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Product detail routes
  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${base}/products/${prod.category}/${prod.slug}`,
    lastModified: prod.updatedAt ? new Date(prod.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
