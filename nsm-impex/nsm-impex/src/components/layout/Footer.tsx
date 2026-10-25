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
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-md transition group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpeg"
                alt="NSM Impex"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white">NSM IMPEX</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">Treads & Garments</p>
            </div>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
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
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">B2B Contact</h4>
          <p className="text-sm leading-relaxed text-white/65">
            Share requirements for bulk production, private label and custom apparel export.
          </p>
          <div className="mt-4 space-y-2 text-xs text-white/75">
            <div>
              <span className="text-white/45">Email: </span>
              <a href="mailto:nsmimpex.pk@gmail.com" className="text-white hover:underline">
                nsmimpex.pk@gmail.com
              </a>
            </div>
            <div>
              <span className="text-white/45">WhatsApp / Phone: </span>
              <a href="tel:+923243998808" className="text-white hover:underline">
                +92 324 3998808
              </a>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href="/inquiry" className="cta-light inline-flex rounded-full px-4 py-2 text-xs font-semibold transition">
              Send Inquiry
            </Link>
            <a
              href="https://wa.me/923243998808?text=Hello%20NSM%20Impex%2C%20I%20would%20like%20to%20inquire%20about%20custom%20apparel%20manufacturing."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
            >
              <svg className="h-3.5 w-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.06-1.579-.327-1.205-.494-2.186-1.583-2.73-2.316-.059-.081-.462-.614-.462-1.173 0-.558.291-.832.395-.945.103-.113.226-.142.302-.142.076 0 .152 0 .218.004.072.004.167-.027.26.196.096.23.327.798.356.856.029.058.049.127.011.202-.038.076-.057.123-.114.19-.057.067-.12.15-.172.202-.058.058-.118.12-.051.236.068.115.301.498.647.806.446.398.823.522.939.58.115.057.183.048.251-.03.069-.077.297-.346.376-.465.079-.118.158-.099.267-.058.109.04.69.326.809.385.118.059.197.089.227.139.03.049.03.287-.114.692z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.436 5.179L2 22l4.981-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.606 0-3.109-.462-4.38-1.26l-.314-.197-2.952.824.836-2.887-.206-.328A8.127 8.127 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/>
              </svg>
              <span>WhatsApp Chat</span>
            </a>
          </div>
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
