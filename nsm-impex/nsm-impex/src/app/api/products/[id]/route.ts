import { NextRequest, NextResponse } from 'next/server'
import { deleteProduct, duplicateProduct, getProductById, upsertProduct } from '@/lib/products/store'
import type { Product } from '@/lib/products/types'
import { verifyAdminAccess } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // If product is unpublished, only admins can view it directly by ID
  if (product.published === false) {
    const adminCheck = await verifyAdminAccess(req)
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
  }

  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  const { id } = await params
  const existing = await getProductById(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const next: Product = {
    ...existing,
    ...body,
    id,
    price: undefined,
    currency: undefined,
    priceNote: undefined,
    updatedAt: new Date().toISOString(),
  }
  const saved = await upsertProduct(next)
  return NextResponse.json(saved)
}

export async function POST(req: NextRequest, { params }: Params) {
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  const { id } = await params
  const body = await req.json()
  if (body?.action === 'duplicate') {
    const copy = await duplicateProduct(id)
    if (!copy) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(copy)
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  const { id } = await params
  const ok = await deleteProduct(id)
  return NextResponse.json({ ok })
}
