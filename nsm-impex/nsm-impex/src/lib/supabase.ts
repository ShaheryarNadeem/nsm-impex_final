import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey))

/**
 * Returns a privileged server-side Supabase client initialized with SUPABASE_SERVICE_ROLE_KEY.
 * This client bypasses RLS policies and is strictly for server-side mutations, administration,
 * and background tasks where route access is already validated by middleware/proxy.
 */
export function getServiceSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseServiceKey || supabaseAnonKey
  if (!url || !serviceKey) return null

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * Server-side client using Service Role key for database operations with full bypass of RLS.
 * STRICTLY SERVER-SIDE.
 */
export const supabase = isSupabaseConfigured
  ? getServiceSupabase()
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
  const client = getServiceSupabase() || supabase
  if (!client) return null

  try {
    const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { error: uploadError } = await client.storage
      .from(bucketName)
      .upload(cleanFileName, buffer, {
        contentType,
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError)
      return null
    }

    const { data } = client.storage.from(bucketName).getPublicUrl(cleanFileName)
    return data.publicUrl
  } catch (err) {
    console.error('Error uploading to Supabase Storage:', err)
    return null
  }
}

/**
 * Remove an image/file from Supabase Storage bucket
 */
export async function deleteImageFromSupabase(
  pathOrUrl: string,
  bucketName = 'product-images'
): Promise<boolean> {
  const client = getServiceSupabase() || supabase
  if (!client) return false

  try {
    const fileName = pathOrUrl.includes('/')
      ? pathOrUrl.substring(pathOrUrl.lastIndexOf('/') + 1)
      : pathOrUrl

    const { error } = await client.storage.from(bucketName).remove([fileName])
    if (error) {
      console.error('Supabase storage delete error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Error deleting from Supabase Storage:', err)
    return false
  }
}

export * from './supabase/client'
export * from './supabase/server'

