import { promises as fs } from 'fs'
import path from 'path'
import { getAllProducts } from '@/lib/products/store'
import { getAllCategories } from '@/lib/categories/store'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getInquiriesCount(): Promise<number> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { count, error } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
      if (!error && typeof count === 'number') {
        return count
      }
    } catch {
      // Fall through to local file
    }
  }

  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'inquiries.json'), 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

export default async function AdminDashboard() {
  const [products, categories, inquiriesCount] = await Promise.all([
    getAllProducts(true),
    getAllCategories(),
    getInquiriesCount(),
  ])

  const published = products.filter((p) => p.published !== false).length
  const featured = products.filter((p) => p.featured).length

  const initialMetrics = {
    totalProducts: products.length,
    published,
    featured,
    categories: categories.length,
    inquiries: inquiriesCount,
  }

  return <AdminDashboardClient initial={initialMetrics} />
}
