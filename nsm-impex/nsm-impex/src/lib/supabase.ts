import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Server-side client using Service Role key for database operations with full bypass of RLS
 * STRICTLY SERVER-SIDE.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null

/**
 * Upload an image buffer to Supabase Storage bucket 'product-images'
 */
export async function uploadImageToSupabase(
  fileName: string,
  buffer: Buffer,
  contentType: string,
  bucketName = 'product-images'
): Promise<string | null> {
  if (!supabase) return null

  try {
    const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(cleanFileName, buffer, {
        contentType,
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError)
      return null
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(cleanFileName)
    return data.publicUrl
  } catch (err) {
    console.error('Error uploading to Supabase Storage:', err)
    return null
  }
}

export * from './supabase/client'
export * from './supabase/server'
