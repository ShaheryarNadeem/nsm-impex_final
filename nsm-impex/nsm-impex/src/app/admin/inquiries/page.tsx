'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Inquiry } from '@/lib/products/types'

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let ignore = false
    async function loadInquiries() {
      try {
        const res = await fetch('/api/inquiries', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load inquiries')
        const data = await res.json()
        if (!ignore) {
          setInquiries(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error(err)
        if (!ignore) {
          setStatusMsg({ type: 'error', text: 'Could not load inquiries. Ensure admin session is active.' })
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    loadInquiries()
    return () => {
      ignore = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return inquiries
    return inquiries.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.company || '').toLowerCase().includes(q) ||
        (item.product || '').toLowerCase().includes(q) ||
        (item.productCode || '').toLowerCase().includes(q) ||
        (item.country || '').toLowerCase().includes(q)
    )
  }, [inquiries, query])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this customer inquiry?')) return

    try {
      const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete inquiry')
      setInquiries((prev) => prev.filter((item) => item.id !== id))
      setStatusMsg({ type: 'success', text: 'Inquiry deleted successfully.' })
      setTimeout(() => setStatusMsg(null), 3000)
    } catch (err) {
      console.error(err)
      setStatusMsg({ type: 'error', text: 'Failed to delete inquiry.' })
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold tracking-tight text-[#0d0f12]">
            Customer Inquiries
          </h1>
          <p className="mt-1 text-sm text-[#6a7078]">
            Review, reply, and manage B2B inquiries and sample requests submitted from the website.
          </p>
        </div>
        <div className="rounded-2xl border border-[#e4e2dc] bg-white px-4 py-2 text-xs font-semibold text-[#0d0f12]">
          Total Leads: {inquiries.length}
        </div>
      </div>

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

      {/* Search Bar */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by buyer name, email, company, product, or country..."
        className="w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
      />

      {/* Inquiries Cards */}
      {loading ? (
        <div className="py-16 text-center text-sm text-[#6a7078]">Loading inquiries...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-[#e4e2dc] bg-white p-12 text-center text-sm text-[#6a7078]">
          {query ? 'No inquiries match your search filter.' : 'No customer inquiries received yet.'}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => {
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent'

            return (
              <article
                key={item.id}
                className="rounded-3xl border border-[#e4e2dc] bg-white p-6 shadow-xs transition hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-[#e4e2dc]/70 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-[#0d0f12]">{item.name}</h2>
                      {item.company ? (
                        <span className="rounded-md bg-[#f1f0ec] px-2.5 py-0.5 text-xs font-semibold text-[#0d0f12]">
                          {item.company}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-[#6a7078]">
                      <a href={`mailto:${item.email}`} className="text-[#0d0f12] font-medium hover:underline">
                        {item.email}
                      </a>
                      {item.phone ? (
                        <span>Phone/WA: {item.phone}</span>
                      ) : null}
                      {item.country ? (
                        <span>Country: {item.country}</span>
                      ) : null}
                      <span>Received: {dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${item.email}?subject=RE: NSM Impex Inquiry - ${encodeURIComponent(item.product || 'Apparel Production')}`}
                      className="rounded-full bg-[#0d0f12] px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      Reply via Email
                    </a>
                    {item.phone ? (
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                      >
                        WhatsApp
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Inquiry Product & Specs Details */}
                <div className="mt-4 grid gap-3 text-xs sm:grid-cols-4 bg-[#f7f6f2] rounded-2xl p-4">
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-[#6a7078]">Product</span>
                    <span className="mt-0.5 block text-sm font-semibold text-[#0d0f12]">
                      {item.product || 'Custom Production'}
                    </span>
                    {item.productCode ? (
                      <span className="text-[11px] text-[#6a7078]">Code: {item.productCode}</span>
                    ) : null}
                  </div>
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-[#6a7078]">Quantity</span>
                    <span className="mt-0.5 block text-sm font-semibold text-[#0d0f12]">
                      {item.quantity || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-[#6a7078]">Size Option</span>
                    <span className="mt-0.5 block text-sm font-semibold text-[#0d0f12]">
                      {item.size || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-[#6a7078]">Color Option</span>
                    <span className="mt-0.5 block text-sm font-semibold text-[#0d0f12]">
                      {item.color || 'Not specified'}
                    </span>
                  </div>
                </div>

                {/* Message */}
                {item.message ? (
                  <div className="mt-4">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
                      Buyer Message / Requirements:
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-[#3a3f45] whitespace-pre-wrap">
                      {item.message}
                    </p>
                  </div>
                ) : null}

                {/* Attached Reference File / Tech-Pack */}
                {item.attachmentUrl ? (
                  <div className="mt-3.5 flex items-center gap-2 border-t border-[#e4e2dc]/60 pt-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
                      Attached Reference File:
                    </span>
                    <a
                      href={item.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                    >
                      📎 View / Download Attachment
                    </a>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
