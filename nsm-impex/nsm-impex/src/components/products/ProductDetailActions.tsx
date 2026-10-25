'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/products/types'
import { DEFAULT_COLORS, DEFAULT_SIZES } from '@/lib/products/types'
import { formatLabel } from '@/lib/utils'
import { InquiryForm } from '@/components/inquiry/InquiryForm'

export function ProductDetailActions({ product }: { product: Product }) {
  const sizes = product.sizeOptions?.length ? product.sizeOptions : DEFAULT_SIZES
  const colors = product.colorOptions?.length ? product.colorOptions : DEFAULT_COLORS
  const [size, setSize] = useState(sizes[2] || sizes[0] || 'M')
  const [color, setColor] = useState(colors[0]?.name || 'Black')
  const [qty, setQty] = useState(50)
  const [open, setOpen] = useState(false)

  const inquiryHref = `/inquiry?product=${encodeURIComponent(product.name)}&code=${encodeURIComponent(product.productCode || '')}&size=${encodeURIComponent(size)}&color=${encodeURIComponent(color)}&quantity=${encodeURIComponent(String(qty))}`

  function bump(delta: number) {
    setQty((q) => Math.max(1, q + delta))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e4e2dc] bg-white p-5 shadow-[0_12px_40px_rgba(13,15,18,0.04)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a7078]">Order Options</p>
          <p className="mt-1 text-sm leading-relaxed text-[#6a7078]">
            Select size, color and quantity, then send an inquiry. Final quote depends on quantity & customization.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-[#0d0f12]">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s) => {
              const active = size === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className="min-w-11 rounded-full border px-3 py-2 text-sm font-semibold transition"
                  style={{
                    backgroundColor: active ? '#0d0f12' : '#ffffff',
                    borderColor: active ? '#0d0f12' : '#cfcbc3',
                  }}
                >
                  <span style={{ color: active ? '#ffffff' : '#0d0f12' }}>{s}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-[#0d0f12]">
            Color <span className="font-normal text-[#6a7078]">— {color}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                className="relative h-9 w-9 rounded-full border-2 transition"
                style={{
                  backgroundColor: c.hex,
                  borderColor: color === c.name ? '#0d0f12' : '#d8d5ce',
                  boxShadow: color === c.name ? '0 0 0 2px #fff, 0 0 0 4px #0d0f12' : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-[#0d0f12]">Order Quantity</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center overflow-hidden rounded-full border border-[#e4e2dc] bg-[#f7f6f2]">
              <button
                type="button"
                onClick={() => bump(-10)}
                className="px-4 py-2.5 text-lg font-semibold"
                style={{ backgroundColor: 'transparent', color: '#0d0f12' }}
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 border-x border-[#e4e2dc] bg-white px-2 py-2.5 text-center text-sm font-semibold text-[#0d0f12] outline-none"
              />
              <button
                type="button"
                onClick={() => bump(10)}
                className="px-4 py-2.5 text-lg font-semibold"
                style={{ backgroundColor: 'transparent', color: '#0d0f12' }}
              >
                +
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-[#6a7078]">MOQ: {formatLabel(product.moq, '50 pcs')} · Adjust for bulk orders</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="cta-dark rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
          >
            Place Order Inquiry
          </button>
          <a
            href={`https://wa.me/923079952363?text=${encodeURIComponent(
              `Hello NSM Impex, I am interested in placing an inquiry for ${product.name} (Code: ${product.productCode || 'N/A'}). Options: Size ${size}, Color ${color}, Quantity ${qty} pcs.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          >
            <span>WhatsApp Quote</span>
          </a>
          <Link
            href={inquiryHref}
            className="cta-light rounded-full border px-6 py-3 text-sm font-semibold transition"
            style={{ borderColor: '#0d0f12' }}
          >
            Full Inquiry Form
          </Link>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#6a7078]">
          How to order: select size & color, set quantity, then submit an inquiry. Our team confirms lead time, packaging and pricing for your market.
        </p>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a7078]">Order Inquiry</p>
                <h3 className="mt-1 text-xl font-semibold text-[#0d0f12]">{product.name}</h3>
                <p className="mt-1 text-sm text-[#6a7078]">
                  {size} · {color} · Qty {qty}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-[#e4e2dc] px-3 py-1 text-sm"
                style={{ backgroundColor: '#ffffff', color: '#0d0f12' }}
              >
                Close
              </button>
            </div>
            <InquiryForm
              defaultProduct={product.name}
              defaultProductCode={product.productCode}
              defaultSize={size}
              defaultColor={color}
              defaultQuantity={String(qty)}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      <dl className="grid gap-3 rounded-2xl border border-[#e4e2dc] bg-white p-5 text-sm sm:grid-cols-2">
        {[
          ['Fabric', product.fabric],
          ['Fabric Composition', product.composition],
          ['GSM', product.gsm],
          ['Fit', product.fit],
          ['Available Sizes', product.sizeOptions?.join(', ') || product.sizes],
          ['Available Colors', product.colorOptions?.map((c) => c.name).join(', ') || product.colors],
          ['Season', product.season],
          ['Customization', product.customization],
          ['Packaging', product.packaging],
          ['MOQ', product.moq],
          ['Lead Time', product.leadTime],
        ].map(([label, value]) => (
          <div key={label} className="border-b border-[#e4e2dc]/70 pb-3 last:border-0">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6a7078]">{label}</dt>
            <dd className="mt-1 text-[#0d0f12]">{formatLabel(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
