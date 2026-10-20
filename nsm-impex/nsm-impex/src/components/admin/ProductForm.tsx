'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, CategorySlug, Product, ProductColor, ProductImage } from '@/lib/products/types'
import { DEFAULT_COLORS, DEFAULT_SIZES } from '@/lib/products/types'
import { categories } from '@/lib/products/categories'
import { slugify } from '@/lib/utils'

const emptyProduct: Product = {
  id: '',
  name: '',
  slug: '',
  category: 'tops',
  subcategory: '',
  productCode: '',
  description: '',
  shortDescription: '',
  images: [],
  fabric: '',
  composition: '',
  gsm: '',
  fit: '',
  sizes: DEFAULT_SIZES.join(', '),
  colors: DEFAULT_COLORS.map((c) => c.name).join(', '),
  sizeOptions: [...DEFAULT_SIZES],
  colorOptions: [...DEFAULT_COLORS],
  season: '',
  customization: '',
  packaging: '',
  moq: '50 pcs',
  leadTime: '',
  featured: false,
  published: true,
}

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [categoryList, setCategoryList] = useState<Category[]>(categories)
  const [product, setProduct] = useState<Product>(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [colorName, setColorName] = useState('')
  const [colorHex, setColorHex] = useState('#111111')
  const [sizeDraft, setSizeDraft] = useState('')
  const [message, setMessage] = useState('')

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

  useEffect(() => {
    if (!productId) return
    let ignore = false
    fetch(`/api/products/${encodeURIComponent(productId)}`)
      .then((r) => {
        if (!r.ok) throw new Error('Product not found')
        return r.json()
      })
      .then((data: Product) => {
        if (!ignore && data && data.name) {
          setProduct({
            ...emptyProduct,
            ...data,
            sizeOptions: data.sizeOptions?.length ? data.sizeOptions : [...DEFAULT_SIZES],
            colorOptions: data.colorOptions?.length ? data.colorOptions : [...DEFAULT_COLORS],
            images: data.images || [],
          })
        }
      })
      .catch((err) => {
        if (!ignore) {
          setMessage(err instanceof Error ? err.message : 'Failed to load product')
        }
      })
    return () => {
      ignore = true
    }
  }, [productId])

  const selectedCategory = categoryList.find((c) => c.slug === product.category) || categoryList[0]

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((prev) => ({ ...prev, [key]: value }))
  }

  function setImages(images: ProductImage[]) {
    update('images', images)
  }

  function addImageByUrl() {
    if (!imageUrl.trim()) return
    const next: ProductImage = {
      id: `img-${Date.now()}`,
      url: imageUrl.trim(),
      kind: product.images.length ? 'additional' : 'main',
      alt: product.name || 'Product image',
    }
    setImages([...product.images, next])
    setImageUrl('')
  }

  async function onUploadFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    setMessage('')
    try {
      const form = new FormData()
      Array.from(files).forEach((f) => form.append('files', f))
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      const urls = (data.urls || []) as string[]
      const added: ProductImage[] = urls.map((url, i) => ({
        id: `img-${Date.now()}-${i}`,
        url,
        kind: product.images.length + i === 0 ? 'main' : 'additional',
        alt: product.name || 'Product image',
      }))
      const merged = [...product.images, ...added]
      if (!merged.some((img) => img.kind === 'main') && merged[0]) {
        merged[0] = { ...merged[0], kind: 'main' }
      }
      setImages(merged)
      setMessage(`${added.length} image(s) uploaded`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function removeImage(id: string) {
    const next = product.images.filter((i) => i.id !== id)
    if (next.length && !next.some((i) => i.kind === 'main')) {
      next[0] = { ...next[0], kind: 'main' }
    }
    setImages(next)
  }

  function setMain(id: string) {
    setImages(
      product.images.map((img) => ({
        ...img,
        kind: img.id === id ? 'main' : img.kind === 'main' ? 'additional' : img.kind,
      })),
    )
  }

  function moveImage(id: string, dir: -1 | 1) {
    const idx = product.images.findIndex((i) => i.id === id)
    const target = idx + dir
    if (idx < 0 || target < 0 || target >= product.images.length) return
    const next = [...product.images]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setImages(next)
  }

  function addColor() {
    const name = colorName.trim()
    if (!name) return
    const colors = product.colorOptions || []
    if (colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) return
    const next: ProductColor[] = [...colors, { name, hex: colorHex || '#111111' }]
    update('colorOptions', next)
    update('colors', next.map((c) => c.name).join(', '))
    setColorName('')
  }

  function removeColor(name: string) {
    const next = (product.colorOptions || []).filter((c) => c.name !== name)
    update('colorOptions', next)
    update('colors', next.map((c) => c.name).join(', '))
  }

  function addSize() {
    const s = sizeDraft.trim().toUpperCase()
    if (!s) return
    const sizes = product.sizeOptions || []
    if (sizes.includes(s)) return
    const next = [...sizes, s]
    update('sizeOptions', next)
    update('sizes', next.join(', '))
    setSizeDraft('')
  }

  function removeSize(s: string) {
    const next = (product.sizeOptions || []).filter((x) => x !== s)
    update('sizeOptions', next)
    update('sizes', next.join(', '))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const payload: Product = {
      ...product,
      id: product.id || `prod-${slugify(product.name)}-${Date.now()}`,
      slug: product.slug || slugify(product.name),
      sizes: (product.sizeOptions || []).join(', ') || product.sizes,
      colors: (product.colorOptions || []).map((c) => c.name).join(', ') || product.colors,
      price: undefined,
      currency: undefined,
      priceNote: undefined,
    }
    const res = await fetch(productId ? `/api/products/${productId}` : '/api/products', {
      method: productId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (res.ok) {
      router.push('/admin/products')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error || 'Save failed')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-2xl border border-[#e4e2dc] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0d0f12]">Basic Information</h2>
        <p className="mt-1 text-sm text-[#6a7078]">Changes save to the live catalog and show on the website immediately.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Product Name" value={product.name} onChange={(v) => update('name', v)} required />
          <Field label="Product Code" value={product.productCode || ''} onChange={(v) => update('productCode', v)} />
          <Field label="URL Slug" value={product.slug} onChange={(v) => update('slug', v)} />
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-[#0d0f12]">Category</span>
            <select
              value={product.category}
              onChange={(e) => {
                const newCat = e.target.value as CategorySlug
                const found = categoryList.find((c) => c.slug === newCat)
                setProduct((prev) => ({
                  ...prev,
                  category: newCat,
                  subcategory: found?.subcategories[0] || '',
                }))
              }}
              className="rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-[#0d0f12] outline-none"
            >
              {categoryList.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-[#0d0f12]">Subcategory</span>
            <select
              value={product.subcategory || ''}
              onChange={(e) => update('subcategory', e.target.value)}
              className="rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-[#0d0f12] outline-none"
            >
              <option value="">-- Select Subcategory --</option>
              {(selectedCategory?.subcategories || []).map((s: string) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-medium text-[#0d0f12]">Short Description</span>
            <textarea
              value={product.shortDescription || ''}
              onChange={(e) => update('shortDescription', e.target.value)}
              rows={2}
              className="rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-[#0d0f12] outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-medium text-[#0d0f12]">Full Description</span>
            <textarea
              value={product.description || ''}
              onChange={(e) => update('description', e.target.value)}
              rows={5}
              className="rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-[#0d0f12] outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e4e2dc] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0d0f12]">Product Pictures</h2>
        <p className="mt-1 text-sm text-[#6a7078]">Upload multiple images or paste image URLs. Set one as Main for the catalog card.</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer rounded-full px-5 py-3 text-sm font-semibold" style={{ backgroundColor: '#0d0f12', color: '#ffffff' }}>
            {uploading ? 'Uploading…' : 'Upload Images'}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => onUploadFiles(e.target.files)}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or paste image URL /products/… or https://…"
            className="flex-1 rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-sm text-[#0d0f12] outline-none"
          />
          <button
            type="button"
            onClick={addImageByUrl}
            className="rounded-full border border-[#0d0f12] px-5 py-3 text-sm font-semibold text-[#0d0f12]"
            style={{ backgroundColor: '#ffffff', color: '#0d0f12' }}
          >
            Add URL
          </button>
        </div>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {product.images.map((img) => (
            <li key={img.id} className="overflow-hidden rounded-xl border border-[#e4e2dc] bg-[#f7f6f2]">
              <div className="relative aspect-[4/5] bg-[#eceae4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt || ''} className="h-full w-full object-cover" />
                {img.kind === 'main' ? (
                  <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0d0f12]">
                    Main
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1.5 p-2">
                <button type="button" onClick={() => setMain(img.id)} className="rounded-md border border-[#e4e2dc] bg-white px-2 py-1 text-[11px] font-semibold text-[#0d0f12]">
                  Set Main
                </button>
                <button type="button" onClick={() => moveImage(img.id, -1)} className="rounded-md border border-[#e4e2dc] bg-white px-2 py-1 text-[11px] font-semibold text-[#0d0f12]">
                  ←
                </button>
                <button type="button" onClick={() => moveImage(img.id, 1)} className="rounded-md border border-[#e4e2dc] bg-white px-2 py-1 text-[11px] font-semibold text-[#0d0f12]">
                  →
                </button>
                <button type="button" onClick={() => removeImage(img.id)} className="rounded-md border border-red-200 bg-white px-2 py-1 text-[11px] font-semibold text-red-700">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        {!product.images.length ? <p className="mt-3 text-sm text-[#6a7078]">No images yet.</p> : null}
      </section>

      <section className="rounded-2xl border border-[#e4e2dc] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0d0f12]">Color Options</h2>
        <p className="mt-1 text-sm text-[#6a7078]">These colors appear as swatches on the product page.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(product.colorOptions || []).map((c) => (
            <div key={c.name} className="inline-flex items-center gap-2 rounded-full border border-[#e4e2dc] bg-[#f7f6f2] px-3 py-1.5 text-sm text-[#0d0f12]">
              <span className="h-4 w-4 rounded-full border border-[#d8d5ce]" style={{ backgroundColor: c.hex }} />
              {c.name}
              <button type="button" onClick={() => removeColor(c.name)} className="text-xs font-semibold text-red-700">
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="grid flex-1 gap-2 text-sm">
            <span className="font-medium text-[#0d0f12]">Color name</span>
            <input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="e.g. Maroon"
              className="rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-[#0d0f12] outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-[#0d0f12]">Hex</span>
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="h-12 w-16 cursor-pointer rounded-lg border border-[#e4e2dc] bg-white p-1"
            />
          </label>
          <button
            type="button"
            onClick={addColor}
            className="rounded-full px-5 py-3 text-sm font-semibold"
            style={{ backgroundColor: '#0d0f12', color: '#ffffff' }}
          >
            Add Color
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e4e2dc] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0d0f12]">Size Options</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {(product.sizeOptions || []).map((s) => (
            <div key={s} className="inline-flex items-center gap-2 rounded-full border border-[#e4e2dc] bg-[#f7f6f2] px-3 py-1.5 text-sm font-semibold text-[#0d0f12]">
              {s}
              <button type="button" onClick={() => removeSize(s)} className="text-xs font-semibold text-red-700">
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={sizeDraft}
            onChange={(e) => setSizeDraft(e.target.value)}
            placeholder="e.g. 4XL"
            className="flex-1 rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-sm text-[#0d0f12] outline-none"
          />
          <button
            type="button"
            onClick={addSize}
            className="rounded-full border border-[#0d0f12] px-5 py-3 text-sm font-semibold"
            style={{ backgroundColor: '#ffffff', color: '#0d0f12' }}
          >
            Add Size
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e4e2dc] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0d0f12]">Specifications</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Fabric" value={product.fabric || ''} onChange={(v) => update('fabric', v)} />
          <Field label="Composition" value={product.composition || ''} onChange={(v) => update('composition', v)} />
          <Field label="GSM" value={product.gsm || ''} onChange={(v) => update('gsm', v)} />
          <Field label="Fit" value={product.fit || ''} onChange={(v) => update('fit', v)} />
          <Field label="Season" value={product.season || ''} onChange={(v) => update('season', v)} />
        </div>
      </section>

      <section className="rounded-2xl border border-[#e4e2dc] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0d0f12]">B2B Information</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="MOQ" value={product.moq || ''} onChange={(v) => update('moq', v)} />
          <Field label="Lead Time" value={product.leadTime || ''} onChange={(v) => update('leadTime', v)} />
          <Field label="Packaging" value={product.packaging || ''} onChange={(v) => update('packaging', v)} />
          <Field label="Customization" value={product.customization || ''} onChange={(v) => update('customization', v)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-[#0d0f12]">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(product.featured)} onChange={(e) => update('featured', e.target.checked)} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={product.published !== false}
              onChange={(e) => update('published', e.target.checked)}
            />
            Published on website
          </label>
        </div>
      </section>

      {message ? <p className="text-sm text-[#6a7078]">{message}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: '#0d0f12', color: '#ffffff' }}
        >
          {saving ? 'Saving…' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="rounded-full border border-[#e4e2dc] px-6 py-3 text-sm font-semibold text-[#0d0f12]"
          style={{ backgroundColor: '#ffffff', color: '#0d0f12' }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[#0d0f12]">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-[#0d0f12] outline-none focus:border-[#0d0f12]"
      />
    </label>
  )
}
