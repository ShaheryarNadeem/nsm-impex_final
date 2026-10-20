import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories, upsertCategory } from '@/lib/categories/store'
import { verifyAdminAccess } from '@/lib/supabase/server'

export async function GET() {
  try {
    const list = await getAllCategories()
    return NextResponse.json(list)
  } catch (err) {
    console.error('Error fetching categories:', err)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { name, slug, description, image, subcategories } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const saved = await upsertCategory({
      name,
      slug,
      description,
      image,
      subcategories: Array.isArray(subcategories) ? subcategories : [],
    })

    return NextResponse.json(saved, { status: 201 })
  } catch (err) {
    console.error('Error creating category:', err)
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 })
  }
}
