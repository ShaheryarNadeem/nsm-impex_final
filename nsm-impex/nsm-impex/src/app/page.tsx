import Link from 'next/link'
import { ProductCard } from '@/components/products/ProductCard'
import { getAllCategories } from '@/lib/categories/store'
import { categoryImages } from '@/lib/products/categories'
import { getFeaturedProducts } from '@/lib/products/store'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const featured = await getFeaturedProducts(8)
  const categories = await getAllCategories()

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/products/pullover-hoodie-custom-1.png"
          alt="Premium apparel visual"
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(13,15,18,0.88)_0%,rgba(13,15,18,0.62)_48%,rgba(13,15,18,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(92,107,90,0.28),transparent_40%)]" />

        <div className="container-x relative grid min-h-[88vh] items-end gap-10 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="fade-in max-w-2xl pb-4">
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur">
              THREADS & GARMENTS MANUFACTURER & EXPORTER
            </p>
            <h1 className="text-4xl leading-[1.02] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Premium Threads & Garments, Made for Global Markets
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
              Manufacturing and exporting quality apparel for brands, wholesalers and international buyers.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="cta-light rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              >
                Explore Products
              </Link>
              <Link
                href="/inquiry"
                className="cta-ghost rounded-full px-6 py-3 text-sm font-semibold backdrop-blur transition hover:-translate-y-0.5"
              >
                Send an Inquiry
              </Link>
            </div>
          </div>

          <div className="fade-in hidden lg:block" style={{ animationDelay: '0.12s' }}>
            <div className="relative ml-auto w-full max-w-md overflow-hidden rounded-[28px] border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/hero-featured-look.png" alt="Featured embroidered hoodie" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">Featured look</p>
                <p className="mt-1 text-lg font-semibold">Embroidered Hoodie</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white/70 backdrop-blur">
        <div className="container-x grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Quality', 'Consistent construction and finishing for wholesale programs.'],
            ['Manufacturing', 'End-to-end garment production from fabric to packaging.'],
            ['Customization', 'Private label, branding and measurement flexibility.'],
            ['Global Export', 'B2B-ready supply for international buyers and retailers.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-line bg-paper/80 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_var(--glow)]">
              <div className="mb-3 h-1 w-8 rounded-full bg-accent" />
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Catalog</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Product Categories</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-ink/80 hover:text-ink">
            View all products →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="group relative min-h-[280px] overflow-hidden rounded-[24px] text-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image || categoryImages[cat.slug] || '/products/pullover-hoodie-custom-1.png'}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
              <div className="relative flex h-full flex-col justify-end p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">0{i + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white drop-shadow-sm">{cat.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/90">{cat.description}</p>
                <span className="cta-light mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition group-hover:translate-x-1">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-soft/80 py-20">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Featured Collection</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Selected styles for buyers</h2>
            </div>
            <Link href="/products" className="cta-dark rounded-full px-5 py-2.5 text-sm font-semibold transition">
              View Full Collection
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="relative overflow-hidden rounded-[32px] border border-line bg-ink px-8 py-14 text-white md:px-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/products/jacket-3.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(13,15,18,0.92),rgba(13,15,18,0.72))]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Custom Manufacturing</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
              Looking for Something Custom?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              Share your requirements with our team and discuss custom apparel production, fabrics, colors, measurements,
              branding and packaging.
            </p>
            <Link
              href="/inquiry?type=custom"
              className="cta-light mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ backgroundColor: '#ffffff', color: '#0d0f12' }}
            >
              Request Custom Production
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
