'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
import type { Product } from '@/lib/products/types'
import { ProductImagePlaceholder } from './ProductImagePlaceholder'
import { cn } from '@/lib/utils'

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => {
    if (product.images.length) return product.images
    return [{ id: 'placeholder', url: '', alt: product.name, kind: 'main' as const }]
  }, [product])

  const [active, setActive] = useState(0)
  const current = images[active] || images[0]

  const containerRef = useRef<HTMLDivElement>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setPosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false)
    setPosition({ x: 50, y: 50 })
  }, [])

  return (
    <div className="space-y-3">
      {/* Main Image with Zoom-on-Hover */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-soft select-none',
          current.url ? 'cursor-zoom-in' : '',
        )}
      >
        {current.url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.alt || product.name}
              className="h-full w-full object-cover object-center will-change-transform"
              style={{
                transformOrigin: `${position.x}% ${position.y}%`,
                transform: isZoomed ? 'scale(2.3)' : 'scale(1)',
                transition: isZoomed
                  ? 'transform 0.15s ease-out'
                  : 'transform 0.35s ease-out, transform-origin 0.35s ease-out',
              }}
            />

            {/* Subtle Zoom Hint Badge */}
            <div
              className={cn(
                'pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-[#0d0f12] shadow-sm backdrop-blur transition-opacity duration-300',
                isZoomed ? 'opacity-0' : 'opacity-90',
              )}
            >
              <svg className="h-3.5 w-3.5 text-[#6a7078]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              <span>Hover to zoom</span>
            </div>
          </>
        ) : (
          <ProductImagePlaceholder label={product.name} />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                setActive(index)
                setIsZoomed(false)
              }}
              className={cn(
                'relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border bg-soft transition-all',
                active === index ? 'border-ink ring-2 ring-ink/20' : 'border-line hover:border-[#8a9098]',
              )}
            >
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt="" className="h-full w-full object-cover object-top" />
              ) : (
                <div className="grid h-full place-items-center text-[9px] uppercase tracking-wider text-muted">N/A</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

