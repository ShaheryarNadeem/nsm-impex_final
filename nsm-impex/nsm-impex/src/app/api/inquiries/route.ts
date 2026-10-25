import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServiceSupabase, isSupabaseConfigured, supabase, uploadImageToSupabase } from '@/lib/supabase'
import { verifyAdminAccess } from '@/lib/supabase/server'
import type { Inquiry } from '@/lib/products/types'

const DATA_DIR = path.join(process.cwd(), 'data')
const INQUIRIES_PATH = path.join(DATA_DIR, 'inquiries.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  try {
    let name = ''
    let email = ''
    let phone = ''
    let company = ''
    let country = ''
    let product = ''
    let productCode = ''
    let quantity = ''
    let size = ''
    let color = ''
    let message = ''
    let attachmentUrl = ''

    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      name = String(form.get('name') || '').trim()
      email = String(form.get('email') || '').trim()
      phone = String(form.get('phone') || '').trim()
      company = String(form.get('company') || '').trim()
      country = String(form.get('country') || '').trim()
      product = String(form.get('product') || '').trim()
      productCode = String(form.get('productCode') || '').trim()
      quantity = String(form.get('quantity') || '').trim()
      size = String(form.get('size') || '').trim()
      color = String(form.get('color') || '').trim()
      message = String(form.get('message') || '').trim()

      const file = form.get('file')
      if (file && file instanceof File && file.size > 0) {
        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: 'Attached file exceeds the 10MB limit.' }, { status: 400 })
        }

        const ALLOWED_MIME_TYPES = new Set([
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'application/pdf',
        ])
        if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
          return NextResponse.json(
            { error: 'Invalid file format. Only PNG, JPG, WEBP, and PDF files are allowed.' },
            { status: 400 }
          )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const cleanName = sanitizeFileName(file.name) || 'attachment'
        const filename = `${Date.now()}-${cleanName}`

        if (isSupabaseConfigured) {
          const publicUrl = await uploadImageToSupabase(filename, buffer, file.type, 'product-images')
          if (publicUrl) {
            attachmentUrl = publicUrl
          }
        }

        if (!attachmentUrl) {
          try {
            await fs.mkdir(UPLOAD_DIR, { recursive: true })
            await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer)
            attachmentUrl = `/uploads/${filename}`
          } catch (fsErr) {
            console.warn('Could not write attachment to local disk:', fsErr)
          }
        }
      }
    } else {
      const body = await req.json().catch(() => ({}))
      name = String(body?.name || '').trim()
      email = String(body?.email || '').trim()
      phone = String(body?.phone || '').trim()
      company = String(body?.company || '').trim()
      country = String(body?.country || '').trim()
      product = String(body?.product || '').trim()
      productCode = String(body?.productCode || '').trim()
      quantity = String(body?.quantity || '').trim()
      size = String(body?.size || '').trim()
      color = String(body?.color || '').trim()
      message = String(body?.message || '').trim()
      attachmentUrl = String(body?.attachmentUrl || '').trim()
    }

    // 1. Strict Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name (minimum 2 characters).' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid business email address (e.g. name@company.com).' },
        { status: 400 }
      )
    }

    if (phone) {
      const digitsOnly = phone.replace(/[^0-9]/g, '')
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/
      if (digitsOnly.length < 7 || digitsOnly.length > 16 || !phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: 'Please enter a valid phone or WhatsApp number (minimum 7 digits, e.g. +1 555 123 4567).' },
          { status: 400 }
        )
      }
    }

    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      country: country || undefined,
      product: product || undefined,
      productCode: productCode || undefined,
      quantity: quantity || undefined,
      size: size || undefined,
      color: color || undefined,
      message: message || undefined,
      attachmentUrl: attachmentUrl || undefined,
      createdAt: new Date().toISOString(),
    }

    // 2. Save to Supabase Cloud if configured
    const client = getServiceSupabase() || supabase
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('inquiries').insert({
          id: inquiry.id,
          name: inquiry.name,
          company: inquiry.company || null,
          email: inquiry.email,
          phone: inquiry.phone || null,
          country: inquiry.country || null,
          product: inquiry.product || null,
          product_code: inquiry.productCode || null,
          quantity: inquiry.quantity || null,
          size: inquiry.size || null,
          color: inquiry.color || null,
          message: inquiry.message || null,
          attachment_url: inquiry.attachmentUrl || null,
          created_at: inquiry.createdAt,
        })
        if (error) {
          console.error('Error inserting inquiry into Supabase:', error)
        }
      } catch (dbErr) {
        console.error('Error inserting inquiry into Supabase:', dbErr)
      }
    }

    // 3. Local fallback / backup
    try {
      let list: Inquiry[] = []
      try {
        const raw = await fs.readFile(INQUIRIES_PATH, 'utf8')
        list = JSON.parse(raw)
      } catch {
        list = []
      }
      list.unshift(inquiry)
      await fs.mkdir(DATA_DIR, { recursive: true })
      await fs.writeFile(INQUIRIES_PATH, JSON.stringify(list, null, 2), 'utf8')
    } catch (fsErr) {
      console.warn('Local inquiry backup skipped:', fsErr)
    }

    revalidatePath('/admin')
    revalidatePath('/admin/inquiries')

    return NextResponse.json({ ok: true, inquiry }, { status: 201 })
  } catch (err) {
    console.error('Inquiry submission error:', err)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // STRICT ADMIN AUTHENTICATION REQUIRED
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required to view customer inquiries.' },
      { status: 401 }
    )
  }

  // 1. Fetch from Supabase Cloud if configured
  const client = getServiceSupabase() || supabase
  if (isSupabaseConfigured && client) {
    try {
      const { data, error } = await client
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data)) {
        const mapped: Inquiry[] = data.map((row) => ({
          id: String(row.id),
          name: String(row.name),
          email: String(row.email),
          company: row.company ? String(row.company) : undefined,
          phone: row.phone ? String(row.phone) : undefined,
          country: row.country ? String(row.country) : undefined,
          product: row.product ? String(row.product) : undefined,
          productCode: row.product_code ? String(row.product_code) : undefined,
          quantity: row.quantity ? String(row.quantity) : undefined,
          size: row.size ? String(row.size) : undefined,
          color: row.color ? String(row.color) : undefined,
          message: row.message ? String(row.message) : undefined,
          attachmentUrl: row.attachment_url ? String(row.attachment_url) : undefined,
          createdAt: String(row.created_at),
        }))
        return NextResponse.json(mapped)
      }
    } catch (dbErr) {
      console.error('Error fetching inquiries from Supabase:', dbErr)
    }
  }

  // 2. Fallback to local file
  try {
    const raw = await fs.readFile(INQUIRIES_PATH, 'utf8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE(req: NextRequest) {
  // STRICT ADMIN AUTHENTICATION REQUIRED
  const adminCheck = await verifyAdminAccess(req)
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing inquiry ID' }, { status: 400 })
  }

  // 1. Delete from Supabase if configured
  const client = getServiceSupabase() || supabase
  if (isSupabaseConfigured && client) {
    try {
      const { error } = await client.from('inquiries').delete().eq('id', id)
      if (error) {
        console.error('Error deleting inquiry from Supabase:', error)
      }
    } catch (err) {
      console.error('Error deleting inquiry from Supabase:', err)
    }
  }

  // 2. Delete locally
  try {
    const raw = await fs.readFile(INQUIRIES_PATH, 'utf8')
    const list = JSON.parse(raw) as Inquiry[]
    const filtered = list.filter((item) => item.id !== id)
    await fs.writeFile(INQUIRIES_PATH, JSON.stringify(filtered, null, 2), 'utf8')
  } catch {
    // Local file missing or read-only host
  }

  revalidatePath('/admin')
  revalidatePath('/admin/inquiries')

  return NextResponse.json({ ok: true, message: `Inquiry ${id} deleted` })
}
