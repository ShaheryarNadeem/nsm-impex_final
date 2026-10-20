import Link from 'next/link'
import { cn } from '@/lib/utils'

type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(last && 'text-ink')}>{item.label}</span>
              )}
              {!last && <span className="text-line">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
