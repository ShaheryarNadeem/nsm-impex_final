import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { verifyAdminAccess } from '@/lib/supabase/server'
import type { Inquiry } from '@/lib/products/types'

const DATA_DIR = path.join(process.cwd(), 'data')
const INQUIRIES_PATH = path.join(DATA_DIR, 'inquiries.json')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const name = String(body?.name || '').trim()
    const email = String(body?.email || '').trim()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Clean payload (exclude empty/dummy file objects)
    const cleanData = { ...body }
    delete cleanData.file

    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      company: cleanData.company ? String(cleanData.company).trim() : undefined,
      phone: cleanData.phone ? String(cleanData.phone).trim() : undefined,
      country: cleanData.country ? String(cleanData.country).trim() : undefined,
      product: cleanData.product ? String(cleanData.product).trim() : undefined,
      productCode: cleanData.productCode ? String(cleanData.productCode).trim() : undefined,
      quantity: cleanData.quantity ? String(cleanData.quantity).trim() : undefined,
      size: cleanData.size ? String(cleanData.size).trim() : undefined,
      color: cleanData.color ? String(cleanData.color).trim() : undefined,
      message: cleanData.message ? String(cleanData.message).trim() : undefined,
      createdAt: new Date().toISOString(),
    }

    // 1. Save to Supabase Cloud if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('inquiries').insert({
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
          created_at: inquiry.createdAt,
        })
      } catch (dbErr) {
        console.error('Error inserting inquiry into Supabase:', dbErr)
      }
    }

    // 2. Local fallback / backup
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
      // In serverless / read-only environment, local disk write failure is expected
      console.warn('Local inquiry backup skipped (serverless environment):', fsErr)
    }

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
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
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
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('inquiries').delete().eq('id', id)
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

  return NextResponse.json({ ok: true, message: `Inquiry ${id} deleted` })
}
