import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/products/Breadcrumbs'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductDetailActions } from '@/components/products/ProductDetailActions'
import { ProductCard } from '@/components/products/ProductCard'
import { getCategoryBySlug } from '@/lib/categories/store'
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/lib/products/store'
import { formatLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  const products = await getAllProducts(true)
  return products.map((p) => ({ category: p.category, slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const product = await getProductBySlug(category, slug, true)
  if (!product) return { title: 'Product' }
  return {
    title: product.name,
    description: product.shortDescription || `${product.name} from NSM Impex apparel catalog.`,
    openGraph: {
      title: `${product.name} | NSM Impex`,
      description: product.shortDescription || undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params
  const product = await getProductBySlug(category, slug)
  if (!product) notFound()
  const cat = await getCategoryBySlug(product.category)
  const related = await getRelatedProducts(product, 8)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.productCode,
    category: cat?.name,
    description: product.description || product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'NSM Impex',
    },
  }

  return (
    <div className="container-x py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: cat?.name || category, href: `/products/${product.category}` },
          ...(product.subcategory
            ? [{ label: product.subcategory, href: `/products/${product.category}?sub=${encodeURIComponent(product.subcategory)}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a7078]">{cat?.name}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0d0f12] md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-sm text-[#6a7078]">Product Code: {formatLabel(product.productCode)}</p>
          <p className="mt-5 text-base leading-relaxed text-[#4a5058]">
            {formatLabel(product.description || product.shortDescription, 'Available on request')}
          </p>

          <div className="mt-8">
            <ProductDetailActions product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-[#e4e2dc] pt-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a7078]">You may also like</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0d0f12]">Related Products</h2>
              <p className="mt-2 max-w-xl text-sm text-[#6a7078]">
                More styles from {product.subcategory || cat?.name || 'this category'} — similar fits and fabrics for bulk programs.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
