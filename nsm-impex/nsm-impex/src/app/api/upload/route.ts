import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { isSupabaseConfigured, uploadImageToSupabase } from '@/lib/supabase'
import { verifyAdminAccess } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
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
    const form = await req.formData()
    const files = form.getAll('files').filter((f): f is File => f instanceof File)

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const urls: string[] = []

    const ALLOWED_MIME_TYPES = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/avif',
    ])
    const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) continue

      let ext = path.extname(file.name).toLowerCase()
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        ext = file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg'
      }

      const base = safeName(path.basename(file.name, ext)) || 'image'
      const filename = `${base}${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())

      // 1. If Supabase Cloud Storage is configured, upload to Supabase bucket
      if (isSupabaseConfigured) {
        const publicUrl = await uploadImageToSupabase(filename, buffer, file.type)
        if (publicUrl) {
          urls.push(publicUrl)
          continue
        }
      }

      // 2. Fallback to local /public/uploads
      try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true })
        const localFilename = `${Date.now()}-${filename}`
        await fs.writeFile(path.join(UPLOAD_DIR, localFilename), buffer)
        urls.push(`/uploads/${localFilename}`)
      } catch (fsErr) {
        console.warn('Local file write failed (ephemeral/serverless env):', fsErr)
      }
    }

    if (!urls.length) {
      return NextResponse.json({ error: 'No valid image files were processed' }, { status: 400 })
    }

    return NextResponse.json({ urls })
  } catch (err) {
    console.error('Upload API route error:', err)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}
