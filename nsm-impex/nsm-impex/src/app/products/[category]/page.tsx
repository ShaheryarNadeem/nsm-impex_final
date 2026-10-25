import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/products/Breadcrumbs'
import { ProductCard } from '@/components/products/ProductCard'
import { getAllCategories, getCategoryBySlug } from '@/lib/categories/store'
import { categoryImages } from '@/lib/products/categories'
import { getProductsByCategory } from '@/lib/products/store'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ sub?: string }>
}

export async function generateStaticParams() {
  const all = await getAllCategories()
  return all.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) return { title: 'Products' }
  const pageUrl = `https://www.nsm-impex.com/products/${category}`
  const catImage = cat.image || categoryImages[category] || '/logo.jpg'

  return {
    title: `${cat.name} Collection`,
    description: cat.description || `Browse wholesale ${cat.name} collection by NSM Impex.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${cat.name} Collection | NSM Impex`,
      description: cat.description,
      url: pageUrl,
      images: [
        {
          url: catImage,
          alt: cat.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.name} Collection | NSM Impex`,
      description: cat.description,
      images: [catImage],
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { sub } = await searchParams
  const cat = await getCategoryBySlug(category)
  if (!cat) notFound()

  const products = await getProductsByCategory(category)
  const activeSub = sub || 'All'
  const filtered = activeSub === 'All' ? products : products.filter((p) => p.subcategory === activeSub)
  const heroImage = cat.image || categoryImages[cat.slug] || '/products/pullover-hoodie-custom-1.png'

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.92),rgba(247,246,242,0.97))]" />
        <div className="container-x relative py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: cat.name },
            ]}
          />
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Category</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{cat.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted">{cat.description}</p>
          </div>
        </div>
      </section>

      <div className="container-x py-10 md:py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {['All', ...cat.subcategories].map((item) => {
            const href =
              item === 'All'
                ? `/products/${cat.slug}`
                : `/products/${cat.slug}?sub=${encodeURIComponent(item)}`
            const active = activeSub === item
            return (
              <Link
                key={item}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-[#0d0f12] text-white shadow-[0_10px_24px_rgba(13,15,18,0.18)]'
                    : 'border border-[#e4e2dc] bg-white text-[#6a7078] hover:text-[#0d0f12]'
                }`}
              >
                {item}
              </Link>
            )
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
