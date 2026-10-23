import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  getCategoryBySlug,
  upsertCategory,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
} from '@/lib/categories/store'
import { verifyAdminAccess } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }
  return NextResponse.json(category)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  try {
    const { slug } = await params
    const body = await req.json()

    // Handle subcategory specific actions
    if (body.action === 'add-sub' && body.subcategory) {
      const updated = await addSubcategory(slug, body.subcategory)
      if (!updated) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      revalidatePath('/admin')
      revalidatePath('/admin/categories')
      revalidatePath('/products')
      revalidatePath('/')
      return NextResponse.json(updated)
    }

    if (body.action === 'remove-sub' && body.subcategory) {
      const updated = await removeSubcategory(slug, body.subcategory)
      if (!updated) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      revalidatePath('/admin')
      revalidatePath('/admin/categories')
      revalidatePath('/products')
      revalidatePath('/')
      return NextResponse.json(updated)
    }

    // General category update
    const updated = await upsertCategory({
      slug,
      name: body.name,
      description: body.description,
      image: body.image,
      subcategories: body.subcategories,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    revalidatePath('/')

    return NextResponse.json(updated)
  } catch (err) {
    console.error('Error updating category:', err)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  try {
    const { slug } = await params
    const deleted = await deleteCategory(slug)
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found or already deleted' }, { status: 404 })
    }

    revalidatePath('/admin')
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    revalidatePath('/')

    return NextResponse.json({ ok: true, message: `Category ${slug} deleted successfully` })
  } catch (err) {
    console.error('Error deleting category:', err)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
