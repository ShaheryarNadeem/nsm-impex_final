'use client'

import { useMemo, useState } from 'react'
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

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-soft">
        {current.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.alt || product.name}
            className="h-full w-full object-cover object-center transition duration-500 hover:scale-[1.02]"
          />
        ) : (
          <ProductImagePlaceholder label={product.name} />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                'relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border bg-soft',
                active === index ? 'border-ink' : 'border-line',
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
