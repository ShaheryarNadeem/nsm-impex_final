import { NextRequest, NextResponse } from 'next/server'
import {
  deleteProduct,
  getAllProducts,
  importProducts,
  reorderProducts,
  upsertProduct,
} from '@/lib/products/store'
import type { CategorySlug, Product } from '@/lib/products/types'
import { slugify } from '@/lib/utils'
import { verifyAdminAccess } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const adminCheck = await verifyAdminAccess(req)
  // Public visitors only see published products; admins see all (including unpublished drafts)
  const products = await getAllProducts(adminCheck.isAdmin)
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  const body = await req.json()

  if (body?.action === 'import') {
    const items = (body.items || []) as Array<{
      name: string
      category: CategorySlug
      subcategory?: string
    }>
    const added = await importProducts(items)
    return NextResponse.json({ added })
  }

  if (body?.action === 'reorder') {
    await reorderProducts(body.ids || [])
    return NextResponse.json({ ok: true })
  }

  const now = new Date().toISOString()
  const name = String(body.name || '').trim()
  if (!name || !body.category) {
    return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
  }

  const product: Product = {
    id: body.id || `prod-${slugify(name)}-${Date.now()}`,
    name,
    slug: body.slug || slugify(name),
    category: body.category,
    subcategory: body.subcategory || '',
    productCode: body.productCode || '',
    description: body.description || '',
    shortDescription: body.shortDescription || '',
    images: body.images || [],
    fabric: body.fabric || '',
    composition: body.composition || '',
    gsm: body.gsm || '',
    fit: body.fit || '',
    sizes: body.sizes || '',
    colors: body.colors || '',
    sizeOptions: body.sizeOptions || [],
    colorOptions: body.colorOptions || [],
    season: body.season || '',
    customization: body.customization || '',
    packaging: body.packaging || '',
    moq: body.moq || '',
    leadTime: body.leadTime || '',
    featured: Boolean(body.featured),
    published: body.published !== false,
    sortOrder: Number(body.sortOrder || 0),
    createdAt: body.createdAt || now,
    updatedAt: now,
  }

  const saved = await upsertProduct(product)
  return NextResponse.json(saved)
}

export async function DELETE(req: NextRequest) {
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const ok = await deleteProduct(id)
  return NextResponse.json({ ok })
}
