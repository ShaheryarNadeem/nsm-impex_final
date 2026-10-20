'use client'

import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import type { Category, CategorySlug } from '@/lib/products/types'
import { categories as defaultCategories } from '@/lib/products/categories'

type Row = { name: string; category: CategorySlug; subcategory?: string }

export default function ImportPage() {
  const [categoryList, setCategoryList] = useState<Category[]>(defaultCategories)
  const [text, setText] = useState('Product Name,Category,Subcategory\nPullover Hoodie,tops,Hoodies')
  const [defaultCategory, setDefaultCategory] = useState<CategorySlug>('tops')
  const [defaultSubcategory, setDefaultSubcategory] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoryList(data)
        }
      })
      .catch(() => {})
  }, [])

  const preview = useMemo(
    () => parseRows(text, defaultCategory, defaultSubcategory, categoryList),
    [text, defaultCategory, defaultSubcategory, categoryList]
  )

  async function onImport() {
    setLoading(true)
    setResult('')
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'import', items: preview }),
    })
    const data = await res.json()
    setLoading(false)
    setResult(`Imported ${data.added || 0} new products. Existing names were skipped.`)
  }

  function onFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => setText(String(reader.result || ''))
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Import Products</h1>
        <p className="mt-2 text-sm text-muted">
          Import via CSV, Excel-exported CSV, or copy/paste. Product names are preserved exactly.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-line bg-white p-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Default Category</span>
          <select
            value={defaultCategory}
            onChange={(e) => setDefaultCategory(e.target.value as CategorySlug)}
            className="rounded-xl border border-line bg-paper px-4 py-3"
          >
            {categoryList.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Default Subcategory</span>
          <input
            value={defaultSubcategory}
            onChange={(e) => setDefaultSubcategory(e.target.value)}
            className="rounded-xl border border-line bg-paper px-4 py-3"
            placeholder="Optional"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Upload CSV / Excel CSV</span>
          <input type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>
        <label className="mt-4 grid gap-2 text-sm">
          <span className="font-medium">Copy / Paste</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="rounded-xl border border-line bg-paper px-4 py-3 font-mono text-xs outline-none"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-semibold">Preview ({preview.length})</h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
          {preview.slice(0, 50).map((row, i) => (
            <li key={`${row.name}-${i}`} className="rounded-lg bg-soft px-3 py-2">
              <strong>{row.name}</strong> → {row.category}
              {row.subcategory ? ` / ${row.subcategory}` : ''}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        disabled={loading || preview.length === 0}
        onClick={onImport}
        className="cta-dark rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {loading ? 'Importing…' : 'Import Products'}
      </button>
      {result ? <p className="text-sm text-muted">{result}</p> : null}
    </div>
  )
}

function parseRows(
  text: string,
  defaultCategory: CategorySlug,
  defaultSubcategory: string,
  availableCategories: Category[]
): Row[] {
  const parsed = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
  })

  if (parsed.data.length && parsed.meta.fields?.length) {
    return parsed.data
      .map((row) => {
        const name = row['Product Name'] || row['Name'] || row['product name'] || row['name'] || ''
        const categoryRaw = (row['Category'] || row['category'] || defaultCategory).toLowerCase()
        const category = normalizeCategory(categoryRaw, defaultCategory, availableCategories)
        const subcategory = row['Subcategory'] || row['subcategory'] || defaultSubcategory
        return { name: name.trim(), category, subcategory }
      })
      .filter((r) => r.name)
  }

  // Plain list fallback: one product name per line
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^product name/i.test(line))
    .map((name) => ({ name, category: defaultCategory, subcategory: defaultSubcategory }))
}

function normalizeCategory(
  value: string,
  fallback: CategorySlug,
  availableCategories: Category[]
): CategorySlug {
  const clean = value.trim().toLowerCase()
  const matched = availableCategories.find(
    (c) => c.slug.toLowerCase() === clean || c.name.toLowerCase() === clean
  )
  if (matched) return matched.slug as CategorySlug
  if (clean.includes('top')) return 'tops'
  if (clean.includes('bottom')) return 'bottoms'
  if (clean.includes('set')) return 'sets'
  if (clean.includes('jacket') || clean.includes('outer')) return 'jackets-outerwear'
  return fallback
}
