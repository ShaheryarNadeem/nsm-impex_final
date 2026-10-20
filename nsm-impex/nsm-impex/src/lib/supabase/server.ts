import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, verifyAdminSession } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Creates a server-side Supabase client for Route Handlers and Server Components
 */
export async function createServerSupabaseClient() {
  if (!isSupabaseConfigured) return null

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}

/**
 * Server-only privileged Supabase admin client (Strictly for backend tasks)
 */
export function getAdminSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export interface AdminVerificationResult {
  isAdmin: boolean
  userId?: string
  email?: string
  authMethod: 'supabase' | 'local_jwt' | 'none'
  error?: string
}

/**
 * Comprehensive Admin Verification for Route Handlers & Server Actions
 * Checks Supabase Auth with dedicated public.admin_users table (never user_metadata)
 * Falls back to local secure session in dev mode if Supabase credentials are not set
 */
export async function verifyAdminAccess(request?: NextRequest): Promise<AdminVerificationResult> {
  // 1. Try Supabase Auth first if configured
  if (isSupabaseConfigured) {
    try {
      let token: string | undefined

      if (request) {
        const authHeader = request.headers.get('Authorization')
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.substring(7)
        }
      }

      const client = await createServerSupabaseClient()
      if (client) {
        const {
          data: { user },
          error: userError,
        } = await client.auth.getUser(token)

        if (!userError && user) {
          // Query dedicated, non-user-editable admin_users table
          // NEVER trust user.user_metadata or raw_user_meta_data
          const { data: adminRecord, error: adminError } = await client
            .from('admin_users')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle()

          if (!adminError && adminRecord) {
            return {
              isAdmin: true,
              userId: user.id,
              email: user.email,
              authMethod: 'supabase',
            }
          }

          // User is authenticated in Supabase but not in admin_users allowlist
          return {
            isAdmin: false,
            userId: user.id,
            email: user.email,
            authMethod: 'supabase',
            error: 'User is not an authorized administrator',
          }
        }
      }
    } catch (err) {
      console.warn('Supabase auth verification failed:', err)
    }
  }

  // 2. Fallback to Local Encrypted JWT Admin Session (for development & transitional use)
  try {
    let localToken: string | undefined

    if (request) {
      localToken = request.cookies.get(AUTH_COOKIE_NAME)?.value
    } else {
      const cookieStore = await cookies()
      localToken = cookieStore.get(AUTH_COOKIE_NAME)?.value
    }

    const session = await verifyAdminSession(localToken)
    if (session && session.role === 'admin') {
      return {
        isAdmin: true,
        email: session.email,
        authMethod: 'local_jwt',
      }
    }
  } catch (err) {
    console.warn('Local session verification failed:', err)
  }

  return {
    isAdmin: false,
    authMethod: 'none',
    error: 'Unauthenticated. Administrator login required.',
  }
}
