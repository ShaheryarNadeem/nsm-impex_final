import type { Metadata } from 'next'
import { ProductCatalogClient } from '@/components/products/ProductCatalogClient'
import { Breadcrumbs } from '@/components/products/Breadcrumbs'
import { getAllProducts } from '@/lib/products/store'
import { getAllCategories } from '@/lib/categories/store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse the NSM Impex apparel catalog — tops, bottoms, sets, jackets and outerwear for B2B buyers.',
}

export default async function ProductsPage() {
  const products = await getAllProducts()
  const categories = await getAllCategories()

  return (
    <div className="container-x py-12 md:py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Catalog</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Products</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          A professional product catalog for international buyers, wholesalers, retailers and clothing brands.
        </p>
      </div>
      <ProductCatalogClient products={products} categories={categories} />
    </div>
  )
}
