import { promises as fs } from 'fs'
import path from 'path'
import type { Product } from './types'
import { createSeedProducts } from './seed'
import { getServiceSupabase, isSupabaseConfigured, supabase } from '@/lib/supabase'

const DATA_DIR = path.join(process.cwd(), 'data')
const CATALOG_PATH = path.join(DATA_DIR, 'catalog.json')

let memoryProducts: Product[] | null = null

// Helper to map DB row to Product type
function mapDbRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id || ''),
    name: String(row.name || ''),
    slug: String(row.slug || ''),
    category: String(row.category || 'tops'),
    subcategory: row.subcategory ? String(row.subcategory) : undefined,
    productCode: row.product_code ? String(row.product_code) : undefined,
    description: row.description ? String(row.description) : undefined,
    shortDescription: row.short_description ? String(row.short_description) : undefined,
    images: Array.isArray(row.images) ? (row.images as Product['images']) : [],
    fabric: row.fabric ? String(row.fabric) : undefined,
    composition: row.composition ? String(row.composition) : undefined,
    gsm: row.gsm ? String(row.gsm) : undefined,
    fit: row.fit ? String(row.fit) : undefined,
    sizes: row.sizes ? String(row.sizes) : undefined,
    colors: row.colors ? String(row.colors) : undefined,
    sizeOptions: Array.isArray(row.size_options) ? (row.size_options as string[]) : undefined,
    colorOptions: Array.isArray(row.color_options) ? (row.color_options as Product['colorOptions']) : undefined,
    season: row.season ? String(row.season) : undefined,
    customization: row.customization ? String(row.customization) : undefined,
    packaging: row.packaging ? String(row.packaging) : undefined,
    moq: row.moq ? String(row.moq) : undefined,
    leadTime: row.lead_time ? String(row.lead_time) : undefined,
    featured: Boolean(row.featured),
    published: row.published !== false,
    sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0,
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  }
}

// Helper to map Product to DB row
function mapProductToDbRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    subcategory: p.subcategory || null,
    product_code: p.productCode || null,
    description: p.description || null,
    short_description: p.shortDescription || null,
    images: p.images || [],
    fabric: p.fabric || null,
    composition: p.composition || null,
    gsm: p.gsm || null,
    fit: p.fit || null,
    sizes: p.sizes || null,
    colors: p.colors || null,
    size_options: p.sizeOptions || [],
    color_options: p.colorOptions || [],
    season: p.season || null,
    customization: p.customization || null,
    packaging: p.packaging || null,
    moq: p.moq || null,
    lead_time: p.leadTime || null,
    featured: Boolean(p.featured),
    published: p.published !== false,
    sort_order: p.sortOrder ?? 0,
    updated_at: new Date().toISOString(),
  }
}

async function ensureCatalog(): Promise<Product[]> {
  // 1. If Supabase is configured, fetch from cloud DB
  const client = getServiceSupabase() || supabase
  if (isSupabaseConfigured && client) {
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!error && Array.isArray(data) && data.length > 0) {
        memoryProducts = data.map(mapDbRowToProduct)
        return memoryProducts
      }
    } catch (dbErr) {
      console.warn('Supabase products fetch failed, falling back to local file/seed:', dbErr)
    }
  }

  // 2. Local memory or file check
  if (memoryProducts && memoryProducts.length > 0) {
    return memoryProducts
  }

  try {
    const raw = await fs.readFile(CATALOG_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Product[]
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryProducts = parsed
      return parsed
    }
  } catch {
    // missing or unreadable — fall through to seed
  }

  // 3. Fallback to seed products
  const seed = createSeedProducts()
  memoryProducts = seed
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(CATALOG_PATH, JSON.stringify(seed, null, 2), 'utf8')
  } catch {
    // read-only host (e.g. Vercel)
  }
  return seed
}

export async function getAllProducts(includeUnpublished = false): Promise<Product[]> {
  const products = await ensureCatalog()
  const list = includeUnpublished ? products : products.filter((p) => p.published !== false)
  return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getAllProducts()
  return products.filter((p) => p.featured).slice(0, limit)
}

export async function getRelatedProducts(product: Product, limit = 8): Promise<Product[]> {
  const products = await getAllProducts()
  const sameSub = products.filter(
    (p) => p.id !== product.id && p.subcategory && p.subcategory === product.subcategory
  )
  const sameCat = products.filter(
    (p) => p.id !== product.id && p.category === product.category && !sameSub.some((s) => s.id === p.id)
  )
  return [...sameSub, ...sameCat].slice(0, limit)
}

export async function getProductsByCategory(
  category: string,
  includeUnpublished = false
): Promise<Product[]> {
  const products = await getAllProducts(includeUnpublished)
  return products.filter((p) => p.category === category)
}

export async function getProductBySlug(
  category: string,
  slug: string,
  includeUnpublished = false
): Promise<Product | undefined> {
  const products = await getAllProducts(includeUnpublished)
  return products.find((p) => p.category === category && p.slug === slug)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getAllProducts(true)
  return products.find((p) => p.id === id)
}

export async function saveAllProducts(products: Product[]): Promise<void> {
  memoryProducts = products
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(CATALOG_PATH, JSON.stringify(products, null, 2), 'utf8')
  } catch {
    // Read-only host
  }
}

export async function upsertProduct(product: Product): Promise<Product> {
  const products = await getAllProducts(true)
  const idx = products.findIndex((p) => p.id === product.id)
  const clean: Record<string, unknown> = { ...product }
  delete clean.price
  delete clean.currency
  delete clean.priceNote
  const next: Product = { ...(clean as unknown as Product), updatedAt: new Date().toISOString() }

  // 1. Save to Supabase Cloud if configured
  const client = getServiceSupabase() || supabase
  if (isSupabaseConfigured && client) {
    try {
      const dbRow = mapProductToDbRow(next)
      const { error } = await client.from('products').upsert(dbRow, { onConflict: 'id' })
      if (error) {
        console.error('Error upserting product to Supabase:', error)
      }
    } catch (err) {
      console.error('Error upserting product to Supabase:', err)
    }
  }

  // 2. Save locally
  if (idx >= 0) products[idx] = next
  else products.push({ ...next, createdAt: next.createdAt || new Date().toISOString() })
  await saveAllProducts(products)
  return next
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getAllProducts(true)
  const next = products.filter((p) => p.id !== id)
  if (next.length === products.length) return false

  // 1. Delete from Supabase if configured
  const client = getServiceSupabase() || supabase
  if (isSupabaseConfigured && client) {
    try {
      const { error } = await client.from('products').delete().eq('id', id)
      if (error) {
        console.error('Error deleting product from Supabase:', error)
      }
    } catch (err) {
      console.error('Error deleting product from Supabase:', err)
    }
  }

  // 2. Delete locally
  await saveAllProducts(next)
  return true
}

export async function duplicateProduct(id: string): Promise<Product | null> {
  const products = await getAllProducts(true)
  const original = products.find((p) => p.id === id)
  if (!original) return null
  const copy: Product = {
    ...original,
    id: `${original.id}-copy-${Date.now()}`,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    productCode: original.productCode ? `${original.productCode}-C` : undefined,
    featured: false,
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return await upsertProduct(copy)
}

export async function importProducts(
  items: Array<{ name: string; category: Product['category']; subcategory?: string }>
): Promise<number> {
  const products = await getAllProducts(true)
  const existing = new Set(products.map((p) => `${p.category}:${p.name.toLowerCase()}`))
  let added = 0
  const now = new Date().toISOString()

  for (const item of items) {
    const key = `${item.category}:${item.name.toLowerCase()}`
    if (existing.has(key)) continue
    const slugBase = item.name
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/\+/g, ' plus ')
      .replace(/\//g, ' ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const newProd: Product = {
      id: `prod-${slugBase}-${Date.now()}-${added}`,
      name: item.name,
      slug: slugBase,
      category: item.category,
      subcategory: item.subcategory || '',
      images: [],
      sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      colorOptions: [
        { name: 'Black', hex: '#111111' },
        { name: 'White', hex: '#f5f5f5' },
        { name: 'Charcoal', hex: '#3a3a3a' },
        { name: 'Grey', hex: '#8a8a8a' },
        { name: 'Navy', hex: '#1f2a44' },
        { name: 'Beige', hex: '#d6c6a8' },
        { name: 'Olive', hex: '#5c6b5a' },
      ],
      moq: '50 pcs',
      published: true,
      featured: false,
      sortOrder: products.length + 1,
      createdAt: now,
      updatedAt: now,
    }
    await upsertProduct(newProd)
    existing.add(key)
    added += 1
  }

  return added
}

export async function reorderProducts(orderedIds: string[]): Promise<void> {
  const products = await getAllProducts(true)
  const map = new Map(products.map((p) => [p.id, p]))
  const reordered: Product[] = []
  orderedIds.forEach((id, index) => {
    const item = map.get(id)
    if (item) {
      reordered.push({ ...item, sortOrder: index + 1, updatedAt: new Date().toISOString() })
      map.delete(id)
    }
  })
  for (const rest of map.values()) reordered.push(rest)

  // 1. Sync updated sort_order to Supabase Cloud if configured
  const client = getServiceSupabase() || supabase
  if (isSupabaseConfigured && client) {
    try {
      await Promise.all(
        reordered.map((p) =>
          client
            .from('products')
            .update({ sort_order: p.sortOrder, updated_at: p.updatedAt })
            .eq('id', p.id)
        )
      )
    } catch (err) {
      console.error('Error syncing reordered products to Supabase:', err)
    }
  }

  // 2. Persist locally
  await saveAllProducts(reordered)
}
