'use client'

import { FormEvent, useEffect, useState } from 'react'
import type { Category } from '@/lib/products/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // New Category State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [creating, setCreating] = useState(false)

  // Subcategory Input state per category (key: slug, value: string)
  const [subInputs, setSubInputs] = useState<Record<string, string>>({})
  const [subLoading, setSubLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let ignore = false
    async function initCategories() {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error('Failed to load categories')
        const data = await res.json()
        if (!ignore) {
          setCategories(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error(err)
        if (!ignore) {
          showStatus('error', 'Could not load categories from server')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    initCategories()
    return () => {
      ignore = true
    }
  }, [])

  function showStatus(type: 'success' | 'error', text: string) {
    setStatusMsg({ type, text })
    setTimeout(() => {
      setStatusMsg(null)
    }, 4000)
  }

  async function handleCreateCategory(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), image: image.trim(), subcategories: [] }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create category')

      setCategories((prev) => {
        const idx = prev.findIndex((c) => c.slug === data.slug)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = data
          return next
        }
        return [...prev, data]
      })

      setName('')
      setDescription('')
      setImage('')
      showStatus('success', `Category "${data.name}" created successfully!`)
    } catch (err: unknown) {
      showStatus('error', err instanceof Error ? err.message : 'Error creating category')
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteCategory(cat: Category) {
    if (!confirm(`Are you sure you want to delete category "${cat.name}" and all its subcategories?`)) {
      return
    }

    try {
      const res = await fetch(`/api/categories/${cat.slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete category')
      }

      setCategories((prev) => prev.filter((c) => c.slug !== cat.slug))
      showStatus('success', `Category "${cat.name}" deleted.`)
    } catch (err: unknown) {
      showStatus('error', err instanceof Error ? err.message : 'Error deleting category')
    }
  }

  async function handleAddSubcategory(categorySlug: string) {
    const val = (subInputs[categorySlug] || '').trim()
    if (!val) return

    setSubLoading((prev) => ({ ...prev, [categorySlug]: true }))

    try {
      const res = await fetch(`/api/categories/${categorySlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-sub', subcategory: val }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add subcategory')

      setCategories((prev) => prev.map((c) => (c.slug === categorySlug ? data : c)))
      setSubInputs((prev) => ({ ...prev, [categorySlug]: '' }))
      showStatus('success', `Added "${val}" to ${data.name}!`)
    } catch (err: unknown) {
      showStatus('error', err instanceof Error ? err.message : 'Error adding subcategory')
    } finally {
      setSubLoading((prev) => ({ ...prev, [categorySlug]: false }))
    }
  }

  async function handleRemoveSubcategory(categorySlug: string, subName: string) {
    if (!confirm(`Remove subcategory "${subName}"?`)) return

    try {
      const res = await fetch(`/api/categories/${categorySlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-sub', subcategory: subName }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to remove subcategory')

      setCategories((prev) => prev.map((c) => (c.slug === categorySlug ? data : c)))
      showStatus('success', `Removed "${subName}".`)
    } catch (err: unknown) {
      showStatus('error', err instanceof Error ? err.message : 'Error removing subcategory')
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold tracking-tight text-[#0d0f12]">
            Category & Subcategory Management
          </h1>
          <p className="mt-1 text-sm text-[#6a7078]">
            Create and organize product categories. Subcategories are automatically available in the Add Product form.
          </p>
        </div>
      </div>

      {/* Status Alert Toast */}
      {statusMsg && (
        <div
          className={`rounded-2xl p-4 text-sm font-medium transition-all ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Add New Category Box */}
      <section className="rounded-3xl border border-[#e4e2dc] bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-[#0d0f12]">Create New Category</h2>
        <p className="mt-1 text-xs text-[#6a7078]">
          Add a top-level product category (e.g., Activewear, Outerwear, Denim, Accessories).
        </p>

        <form onSubmit={handleCreateCategory} className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Activewear"
              className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-2.5 text-sm text-[#0d0f12] outline-none transition-all focus:border-[#0d0f12] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. High-performance workout gear"
              className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-2.5 text-sm text-[#0d0f12] outline-none transition-all focus:border-[#0d0f12] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
              Cover Image URL (Optional)
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/products/activewear-1.png"
              className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-2.5 text-sm text-[#0d0f12] outline-none transition-all focus:border-[#0d0f12] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="rounded-full bg-[#0d0f12] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {creating ? 'Creating...' : '+ Create Category'}
            </button>
          </div>
        </form>
      </section>

      {/* Categories & Subcategories List */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#0d0f12]">Active Categories ({categories.length})</h2>

        {loading ? (
          <div className="py-12 text-center text-sm text-[#6a7078]">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border border-[#e4e2dc] bg-white p-12 text-center text-sm text-[#6a7078]">
            No categories found. Create one above to get started.
          </div>
        ) : (
          <div className="grid gap-6">
            {categories.map((cat) => {
              const subCount = cat.subcategories?.length || 0
              const isSubAdding = !!subLoading[cat.slug]

              return (
                <article
                  key={cat.slug}
                  className="rounded-3xl border border-[#e4e2dc] bg-white p-6 sm:p-7 shadow-xs transition-shadow hover:shadow-sm"
                >
                  {/* Category Top Bar */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#e4e2dc] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f0ec] text-base font-bold text-[#0d0f12]">
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-[#0d0f12]">{cat.name}</h3>
                          <span className="rounded-md bg-[#f1f0ec] px-2 py-0.5 text-[11px] font-mono uppercase text-[#6a7078]">
                            /{cat.slug}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="mt-0.5 text-xs text-[#6a7078]">{cat.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 sm:pt-0">
                      <span className="text-xs font-semibold text-[#6a7078]">
                        {subCount} {subCount === 1 ? 'Subcategory' : 'Subcategories'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                      >
                        Delete Category
                      </button>
                    </div>
                  </div>

                  {/* Subcategories Section */}
                  <div className="mt-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
                      Subcategories:
                    </h4>

                    {/* Chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {subCount === 0 ? (
                        <p className="text-xs italic text-[#a2a7ad]">
                          No subcategories added yet. Add one below.
                        </p>
                      ) : (
                        cat.subcategories.map((sub) => (
                          <span
                            key={sub}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e2dc] bg-[#f7f6f2] px-3.5 py-1 text-xs font-medium text-[#0d0f12]"
                          >
                            <span>{sub}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubcategory(cat.slug, sub)}
                              title={`Remove ${sub}`}
                              className="flex h-4 w-4 items-center justify-center rounded-full text-[#a2a7ad] hover:bg-[#e4e2dc] hover:text-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Add Subcategory input */}
                    <div className="mt-4 flex max-w-md items-center gap-2">
                      <input
                        type="text"
                        value={subInputs[cat.slug] || ''}
                        onChange={(e) =>
                          setSubInputs((prev) => ({ ...prev, [cat.slug]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSubcategory(cat.slug)
                          }
                        }}
                        placeholder={`Add subcategory to ${cat.name}...`}
                        className="flex-1 rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-3.5 py-2 text-xs text-[#0d0f12] outline-none transition-all focus:border-[#0d0f12] focus:bg-white"
                      />
                      <button
                        type="button"
                        disabled={isSubAdding || !(subInputs[cat.slug] || '').trim()}
                        onClick={() => handleAddSubcategory(cat.slug)}
                        className="rounded-xl bg-[#0d0f12] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                      >
                        {isSubAdding ? 'Adding...' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
