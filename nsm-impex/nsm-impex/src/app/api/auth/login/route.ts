import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { AUTH_COOKIE_NAME, signAdminSession } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    // 1. If Supabase Cloud is configured, authenticate via Supabase Auth
    if (supabaseUrl && supabaseAnonKey) {
      const cookieStore: { name: string; value: string; options: Record<string, unknown> }[] = []

      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach((c) => cookieStore.push(c))
          },
        },
      })

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message || 'Invalid email or password' },
          { status: 401 }
        )
      }

      // Check non-user-editable admin_users allowlist
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .maybeSingle()

      if (adminError || !adminRecord) {
        // Sign out user immediately since they are not an authorized admin
        await supabase.auth.signOut()
        return NextResponse.json(
          { error: 'Access denied. This account is not in the administrator allowlist.' },
          { status: 403 }
        )
      }

      // Authorized Supabase Admin!
      const localJwt = await signAdminSession(normalizedEmail)

      const response = NextResponse.json({
        ok: true,
        message: 'Admin authentication successful',
        user: { id: authData.user.id, email: normalizedEmail, role: 'admin' },
      })

      // Apply Supabase session cookies
      cookieStore.forEach(({ name, value, options }) => {
        response.cookies.set({ name, value, ...options })
      })

      // Also set local encrypted JWT cookie as backup
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: localJwt,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })

      return response
    }

    // 2. Local Fallback (Development mode before Supabase credentials are populated)
    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@nsmimpex.com').trim().toLowerCase()
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123456'

    if (normalizedEmail !== expectedEmail || password !== expectedPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signAdminSession(expectedEmail)

    const response = NextResponse.json({
      ok: true,
      message: 'Login successful (local mode)',
      user: { email: expectedEmail, role: 'admin' },
    })

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 })
  }
}
