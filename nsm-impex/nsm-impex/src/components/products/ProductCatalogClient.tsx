'use client'

import { useMemo, useState } from 'react'
import type { Category, Product } from '@/lib/products/types'
import { ProductCard } from './ProductCard'
import { DEFAULT_CATEGORIES } from '@/lib/products/categories'

type Props = {
  products: Product[]
  categories?: Category[]
  initialCategory?: string
  initialSubcategory?: string
}

const fieldClass =
  'w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none focus:border-[#0d0f12]'

export function ProductCatalogClient({
  products,
  categories = DEFAULT_CATEGORIES,
  initialCategory = 'all',
  initialSubcategory = 'all',
}: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [subcategory, setSubcategory] = useState(initialSubcategory)
  const [sort, setSort] = useState<'featured' | 'az' | 'recent'>('featured')

  const subcategories = useMemo(() => {
    const cat = categories.find((c) => c.slug === category)
    return cat?.subcategories || []
  }, [categories, category])

  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (subcategory !== 'all') list = list.filter((p) => p.subcategory === subcategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.productCode || '').toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'recent') list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    if (sort === 'featured') {
      list.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || (a.sortOrder || 0) - (b.sortOrder || 0),
      )
    }
    return list
  }, [products, category, subcategory, query, sort])

  return (
    <div className="space-y-8">
      <div className="grid gap-3 rounded-2xl border border-[#e4e2dc] bg-white p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, code or category"
          className={fieldClass}
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setSubcategory('all')
          }}
          className={fieldClass}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className={fieldClass}
        >
          <option value="all">All Subcategories</option>
          {subcategories.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className={fieldClass}
        >
          <option value="featured">Featured</option>
          <option value="az">A–Z</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>

      <p className="text-sm text-[#6a7078]">{filtered.length} products</p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#e4e2dc] bg-white p-12 text-center text-[#6a7078]">
          No products match your filters.
        </div>
      )}
    </div>
  )
}
