'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Metrics {
  totalProducts: number
  published: number
  featured: number
  categories: number
  inquiries: number
}

interface Props {
  initial: Metrics
}

export function AdminDashboardClient({ initial }: Props) {
  const [metrics, setMetrics] = useState<Metrics>(initial)
  const [syncing, setSyncing] = useState(false)

  async function refreshMetrics() {
    setSyncing(true)
    try {
      const [catsRes, prodsRes, inqRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/products?all=true', { cache: 'no-store' }),
        fetch('/api/inquiries', { cache: 'no-store' }),
      ])

      const [catsData, prodsData, inqData] = await Promise.all([
        catsRes.ok ? catsRes.json() : null,
        prodsRes.ok ? prodsRes.json() : null,
        inqRes.ok ? inqRes.json() : null,
      ])

      setMetrics((prev) => {
        const next: Metrics = { ...prev }

        if (Array.isArray(catsData)) {
          next.categories = catsData.length
        }

        if (Array.isArray(prodsData)) {
          next.totalProducts = prodsData.length
          next.published = prodsData.filter((p: { published?: boolean }) => p.published !== false).length
          next.featured = prodsData.filter((p: { featured?: boolean }) => Boolean(p.featured)).length
        }

        if (Array.isArray(inqData)) {
          next.inquiries = inqData.length
        }

        return next
      })
    } catch (err) {
      console.warn('Dashboard real-time sync failed:', err)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    // Refresh immediately on mount to ensure real-time accuracy across soft navigations
    refreshMetrics()

    // Also refresh when tab regains focus
    function onFocus() {
      refreshMetrics()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold tracking-tight text-[#0d0f12]">
            Catalog Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#6a7078]">
            Real-time control center for NSM Impex products, categories, and buyer leads.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshMetrics}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#e4e2dc] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0d0f12] shadow-2xs hover:bg-[#f7f6f2] transition disabled:opacity-50"
        >
          <span className={`inline-block h-2 w-2 rounded-full ${syncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
          {syncing ? 'Syncing...' : 'Live Synced'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Products', val: metrics.totalProducts, href: '/admin/products' },
          { label: 'Published', val: metrics.published, href: '/admin/products' },
          { label: 'Featured', val: metrics.featured, href: '/admin/products' },
          { label: 'Categories', val: metrics.categories, href: '/admin/categories' },
          { label: 'Customer Inquiries', val: metrics.inquiries, href: '/admin/inquiries' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group rounded-3xl border border-[#e4e2dc] bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a7078] group-hover:text-[#0d0f12] transition-colors">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-[#0d0f12] tracking-tight">
              {item.val}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/admin/products/new"
          className="cta-dark rounded-full bg-[#0d0f12] px-5 py-2.5 text-sm font-semibold !text-white transition hover:opacity-90"
          style={{ color: '#ffffff' }}
        >
          + Add Product
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-full border border-[#0d0f12] bg-white px-5 py-2.5 text-sm font-semibold text-[#0d0f12] transition hover:bg-[#f7f6f2]"
        >
          Manage Categories ({metrics.categories})
        </Link>
        <Link
          href="/admin/inquiries"
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-[#0d0f12] transition hover:bg-[#f7f6f2]"
        >
          Customer Inquiries ({metrics.inquiries})
        </Link>
        <Link
          href="/admin/import"
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-[#0d0f12] transition hover:bg-[#f7f6f2]"
        >
          CSV Importer
        </Link>
        <Link
          href="/admin/products"
          className="rounded-full border border-line bg-[#f7f6f2] px-5 py-2.5 text-sm font-semibold text-[#0d0f12] transition hover:bg-[#e4e2dc]"
        >
          View All Products
        </Link>
      </div>
    </div>
  )
}
