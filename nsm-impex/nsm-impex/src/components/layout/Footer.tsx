'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { categories as defaultCategories } from '@/lib/products/categories'
import type { Category } from '@/lib/products/types'

export function Footer() {
  const pathname = usePathname()
  const [catList, setCatList] = useState<Category[]>(defaultCategories)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCatList(data)
      })
      .catch(() => {})
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">NSM IMPEX</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Treads & Garments Manufacturer & Exporter
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Navigation</h4>
          <ul className="space-y-2 text-sm text-white/75">
            {[
              ['/', 'Home'],
              ['/products', 'Products'],
              ['/about', 'About Us'],
              ['/contact', 'Contact'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Categories</h4>
          <ul className="space-y-2 text-sm text-white/75">
            {catList.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/products/${cat.slug}`} className="hover:text-white">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">B2B</h4>
          <p className="mb-5 text-sm leading-relaxed text-white/65">
            Share your requirements for bulk production, private label and export programs.
          </p>
          <Link href="/inquiry" className="cta-light inline-flex rounded-full px-5 py-2.5 text-sm font-semibold transition">
            Send Inquiry
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} NSM Impex. All Rights Reserved.</p>
          <p className="text-white/30">Wholesale Apparel & Garments Manufacturer</p>
        </div>
      </div>
    </footer>
  )
}
