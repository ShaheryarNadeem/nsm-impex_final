'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@/lib/products/types'
import { categories } from '@/lib/products/categories'

export default function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    async function initProducts() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        if (!ignore) {
          setProducts(Array.isArray(data) ? data : [])
        }
      } catch {
        if (!ignore) {
          setProducts([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    initProducts()
    return () => {
      ignore = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.productCode || '').toLowerCase().includes(q) ||
        p.category.includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q),
    )
  }, [products, query])

  async function toggle(product: Product, patch: Partial<Product>) {
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, ...patch }),
    })
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this product from the website?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    await load()
  }

  async function duplicate(id: string) {
    await fetch(`/api/products/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'duplicate' }),
    })
    await load()
  }

  async function move(id: string, direction: -1 | 1) {
    const ids = products.map((p) => p.id)
    const index = ids.indexOf(id)
    const target = index + direction
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reorder', ids }),
    })
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0d0f12]">Products</h1>
          <p className="mt-1 text-sm text-[#6a7078]">
            {products.length} products · Edit images, colors, description — website updates live
          </p>
        </div>
        <Link href="/admin/products/new" className="cta-dark rounded-full px-5 py-2.5 text-sm font-semibold">
          Add Product
        </Link>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        className="w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none focus:border-[#0d0f12]"
      />

      <div className="overflow-hidden rounded-2xl border border-[#e4e2dc] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#e4e2dc] bg-[#f7f6f2] text-xs uppercase tracking-[0.12em] text-[#6a7078]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Images</th>
                <th className="px-4 py-3">Colors</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-[#6a7078]" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const main = product.images?.find((i) => i.kind === 'main') || product.images?.[0]
                  return (
                    <tr key={product.id} className="border-b border-[#e4e2dc]/70 align-middle">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#eceae4]">
                            {main?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={main.url} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0d0f12]">{product.name}</p>
                            <p className="text-xs text-[#6a7078]">{product.productCode || product.subcategory || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#0d0f12]">
                        {categories.find((c) => c.slug === product.category)?.name || product.category}
                      </td>
                      <td className="px-4 py-4 text-[#0d0f12]">{product.images?.length || 0}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(product.colorOptions || []).slice(0, 6).map((c) => (
                            <span
                              key={c.name}
                              title={c.name}
                              className="h-4 w-4 rounded-full border border-[#d8d5ce]"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-xs text-[#0d0f12]">
                          <p>{product.published !== false ? 'Published' : 'Unpublished'}</p>
                          <p className="text-[#6a7078]">{product.featured ? 'Featured' : 'Standard'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="rounded-md border border-[#e4e2dc] px-2 py-1 text-xs font-semibold text-[#0d0f12]"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggle(product, { published: product.published === false })}
                            className="rounded-md border border-[#e4e2dc] px-2 py-1 text-xs font-semibold text-[#0d0f12]"
                          >
                            {product.published === false ? 'Publish' : 'Unpublish'}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggle(product, { featured: !product.featured })}
                            className="rounded-md border border-[#e4e2dc] px-2 py-1 text-xs font-semibold text-[#0d0f12]"
                          >
                            {product.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicate(product.id)}
                            className="rounded-md border border-[#e4e2dc] px-2 py-1 text-xs font-semibold text-[#0d0f12]"
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => move(product.id, -1)}
                            className="rounded-md border border-[#e4e2dc] px-2 py-1 text-xs font-semibold text-[#0d0f12]"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => move(product.id, 1)}
                            className="rounded-md border border-[#e4e2dc] px-2 py-1 text-xs font-semibold text-[#0d0f12]"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(product.id)}
                            className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
