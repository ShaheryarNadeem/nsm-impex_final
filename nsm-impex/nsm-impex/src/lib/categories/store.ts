import { promises as fs } from 'fs'
import path from 'path'
import type { Category } from '@/lib/products/types'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { DEFAULT_CATEGORIES } from '@/lib/products/categories'

export { DEFAULT_CATEGORIES } from '@/lib/products/categories'

const DATA_DIR = path.join(process.cwd(), 'data')
const CATEGORIES_PATH = path.join(DATA_DIR, 'categories.json')

let memoryCategories: Category[] | null = null

function mapDbRowToCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id || ''),
    slug: String(row.slug || ''),
    name: String(row.name || ''),
    description: row.description ? String(row.description) : undefined,
    image: row.image ? String(row.image) : undefined,
    subcategories: Array.isArray(row.subcategories) ? (row.subcategories as string[]) : [],
  }
}

export async function getAllCategories(): Promise<Category[]> {
  // 1. Supabase Cloud fetch if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
      if (!error && Array.isArray(data) && data.length > 0) {
        memoryCategories = data.map(mapDbRowToCategory)
        return memoryCategories
      }
    } catch (err) {
      console.warn('Supabase categories fetch error:', err)
    }
  }

  // 2. Local memory cache
  if (memoryCategories && memoryCategories.length > 0) {
    return memoryCategories
  }

  // 3. Local file
  try {
    const raw = await fs.readFile(CATEGORIES_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Category[]
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryCategories = parsed
      return parsed
    }
  } catch {
    // File not found or read-only host
  }

  // 4. Default categories
  memoryCategories = [...DEFAULT_CATEGORIES]
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(CATEGORIES_PATH, JSON.stringify(DEFAULT_CATEGORIES, null, 2), 'utf8')
  } catch {
    // Read-only host
  }
  return memoryCategories
}

export async function saveAllCategories(list: Category[]): Promise<void> {
  memoryCategories = list
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(CATEGORIES_PATH, JSON.stringify(list, null, 2), 'utf8')
  } catch (err) {
    console.warn('Could not persist categories to disk (ephemeral/serverless env):', err)
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const all = await getAllCategories()
  return all.find((c) => c.slug === slug)
}

export async function upsertCategory(cat: {
  name: string
  slug?: string
  description?: string
  image?: string
  subcategories?: string[]
}): Promise<Category> {
  const all = await getAllCategories()
  const slug = (cat.slug || cat.name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const existingIndex = all.findIndex((c) => c.slug === slug)

  const updated: Category = {
    id: existingIndex >= 0 ? all[existingIndex].id : `cat-${slug}`,
    name: cat.name.trim(),
    slug,
    description: cat.description?.trim() || '',
    image: cat.image?.trim() || '',
    subcategories: cat.subcategories || (existingIndex >= 0 ? all[existingIndex].subcategories : []),
  }

  // 1. Save to Supabase Cloud if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').upsert(
        {
          id: updated.id,
          slug: updated.slug,
          name: updated.name,
          description: updated.description || null,
          image: updated.image || null,
          subcategories: updated.subcategories,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
    } catch (err) {
      console.error('Error upserting category to Supabase:', err)
    }
  }

  // 2. Save locally
  if (existingIndex >= 0) {
    all[existingIndex] = updated
  } else {
    all.push(updated)
  }

  await saveAllCategories(all)
  return updated
}

export async function deleteCategory(slug: string): Promise<boolean> {
  const all = await getAllCategories()
  const filtered = all.filter((c) => c.slug !== slug)
  if (filtered.length === all.length) return false

  // 1. Delete from Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').delete().eq('slug', slug)
    } catch (err) {
      console.error('Error deleting category from Supabase:', err)
    }
  }

  // 2. Delete locally
  await saveAllCategories(filtered)
  return true
}

export async function addSubcategory(categorySlug: string, subcategoryName: string): Promise<Category | null> {
  const trimmed = subcategoryName.trim()
  if (!trimmed) return null

  const all = await getAllCategories()
  const target = all.find((c) => c.slug === categorySlug)
  if (!target) return null

  if (!target.subcategories.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
    target.subcategories.push(trimmed)

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('categories')
          .update({ subcategories: target.subcategories, updated_at: new Date().toISOString() })
          .eq('slug', categorySlug)
      } catch (err) {
        console.error('Error updating subcategories in Supabase:', err)
      }
    }

    await saveAllCategories(all)
  }

  return target
}

export async function removeSubcategory(categorySlug: string, subcategoryName: string): Promise<Category | null> {
  const all = await getAllCategories()
  const target = all.find((c) => c.slug === categorySlug)
  if (!target) return null

  target.subcategories = target.subcategories.filter(
    (s) => s.toLowerCase() !== subcategoryName.toLowerCase()
  )

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('categories')
        .update({ subcategories: target.subcategories, updated_at: new Date().toISOString() })
        .eq('slug', categorySlug)
    } catch (err) {
      console.error('Error updating subcategories in Supabase:', err)
    }
  }

  await saveAllCategories(all)
  return target
}
