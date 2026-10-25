'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  async function handleLogout() {
    if (!confirm('Are you sure you want to log out of the admin panel?')) return
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setLoggingOut(false)
    }
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/products/new', label: '+ Add Product' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/import', label: 'Import' },
    { href: '/admin/inquiries', label: 'Inquiries' },
  ]

  return (
    <header className="border-b border-[#e4e2dc] bg-white sticky top-0 z-30 shadow-xs">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-[family-name:var(--font-display)] text-lg font-bold text-[#0d0f12]"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-[#e4e2dc] bg-white p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpeg"
                alt="NSM Impex"
                className="h-full w-full object-contain"
              />
            </div>
            <span>NSM Admin</span>
          </Link>

          {!isLoginPage && (
            <nav className="hidden gap-1 text-sm font-medium text-[#6a7078] md:flex">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3 py-1.5 transition-colors ${
                      isActive
                        ? 'bg-[#f1f0ec] text-[#0d0f12] font-semibold'
                        : 'hover:bg-[#faf9f5] hover:text-[#0d0f12]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs font-semibold uppercase tracking-wider text-[#6a7078] hover:text-[#0d0f12] sm:block"
          >
            View Live Site ↗
          </Link>

          {!isLoginPage && (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-full border border-[#e4e2dc] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0d0f12] transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
