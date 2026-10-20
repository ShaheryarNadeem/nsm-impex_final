import Link from 'next/link'
import { getAllProducts } from '@/lib/products/store'
import { getAllCategories } from '@/lib/categories/store'

export default async function AdminDashboard() {
  const products = await getAllProducts(true)
  const categories = await getAllCategories()
  const published = products.filter((p) => p.published !== false).length
  const featured = products.filter((p) => p.featured).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Catalog Dashboard</h1>
        <p className="mt-2 text-sm text-muted">Manage the NSM Impex product catalog without editing code.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total Products', products.length],
          ['Published', published],
          ['Featured', featured],
          ['Categories', categories.length],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="cta-dark rounded-full px-5 py-2.5 text-sm font-semibold">
          Add Product
        </Link>
        <Link href="/admin/inquiries" className="rounded-full border border-[#0d0f12] bg-white px-5 py-2.5 text-sm font-semibold text-[#0d0f12]">
          View Inquiries
        </Link>
        <Link href="/admin/categories" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-[#0d0f12]">
          Categories
        </Link>
        <Link href="/admin/import" className="rounded-full border border-ink px-5 py-2.5 text-sm font-semibold" style={{ color: '#0d0f12' }}>
          Import Products
        </Link>
        <Link href="/admin/products" className="cta-light rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
          Manage Products
        </Link>
      </div>
    </div>
  )
}
