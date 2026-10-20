'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  if (isAdmin) return null

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-transparent bg-paper/75 backdrop-blur-xl transition-all',
        scrolled && 'border-line bg-paper/92 shadow-[0_10px_40px_rgba(13,15,18,0.06)]',
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[linear-gradient(145deg,#0d0f12_0%,#5c6b5a_140%)] text-sm font-semibold tracking-wide text-white shadow-[0_8px_20px_rgba(13,15,18,0.18)]">
            N
          </span>
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              NSM IMPEX
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Treads & Garments
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium text-[#6a7078] transition hover:text-[#0d0f12]',
                  active && 'text-[#0d0f12]',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/inquiry"
            className="cta-dark hidden rounded-full px-5 py-2.5 text-sm font-semibold sm:inline-flex"
          >
            Send Inquiry
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-md border border-line lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className={cn('block h-0.5 w-4 bg-ink transition', open && 'translate-y-2 rotate-45')} />
              <span className={cn('block h-0.5 w-4 bg-ink transition', open && 'opacity-0')} />
              <span className={cn('block h-0.5 w-4 bg-ink transition', open && '-translate-y-2 -rotate-45')} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-3 py-3 text-base font-medium hover:bg-soft">
                {link.label}
              </Link>
            ))}
            <Link href="/inquiry" className="cta-dark mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold">
              Send Inquiry
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
