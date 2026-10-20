import Link from 'next/link'
import type { Product } from '@/lib/products/types'
import { getCategory } from '@/lib/products/categories'
import { ProductImagePlaceholder } from './ProductImagePlaceholder'
import { cn } from '@/lib/utils'

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const category = getCategory(product.category)
  const main = product.images.find((i) => i.kind === 'main') || product.images[0]

  return (
    <article
      className={cn(
        'group flex flex-col overflow-visible rounded-[22px] border border-[#e4e2dc] bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(13,15,18,0.1)]',
        className,
      )}
    >
      <Link href={`/products/${product.category}/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[3/4] shrink-0 overflow-hidden rounded-t-[21px] bg-[#eceae4]">
          {main?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={main.url}
              alt={main.alt || product.name}
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <ProductImagePlaceholder label={product.name} />
          )}
          <span className="absolute left-3 top-3 z-[1] rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0d0f12] shadow-sm">
            {category?.name || product.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 px-4 pb-5 pt-4" style={{ color: '#0d0f12' }}>
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight" style={{ color: '#0d0f12' }}>
            {product.name}
          </h3>
          {product.subcategory ? (
            <p className="text-xs leading-normal" style={{ color: '#6a7078' }}>
              {product.subcategory}
            </p>
          ) : null}
          <p className="mt-auto pt-2 text-sm font-semibold leading-none" style={{ color: '#0d0f12' }}>
            View Product →
          </p>
        </div>
      </Link>
    </article>
  )
}
