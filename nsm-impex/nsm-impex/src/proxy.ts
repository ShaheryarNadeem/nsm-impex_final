import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { AUTH_COOKIE_NAME, verifyAdminSession } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl

  let isAdmin = false

  // 1. Check Supabase Auth session if configured
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Query public.admin_users allowlist (never trust user_metadata)
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle()

        if (adminRecord) {
          isAdmin = true
        }
      }
    } catch (err) {
      console.warn('Proxy Supabase auth error:', err)
    }
  }

  // 2. Check Local encrypted JWT session cookie fallback
  if (!isAdmin) {
    const localToken = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const session = await verifyAdminSession(localToken)
    if (session && session.role === 'admin') {
      isAdmin = true
    }
  }

  // 3. Handle /admin/login route
  if (pathname === '/admin/login') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  // 4. Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // 5. Protect mutation APIs (POST, PUT, DELETE, PATCH)
  const isApiMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)
  const isProtectedApi =
    pathname.startsWith('/api/categories') ||
    pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/upload')

  if (isProtectedApi && isApiMutation) {
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      )
    }
  }

  // 6. Protect GET and DELETE on /api/inquiries (only verified admins may view/delete customer inquiries)
  if (pathname.startsWith('/api/inquiries') && (request.method === 'GET' || request.method === 'DELETE')) {
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin authentication required to access customer inquiries.' },
        { status: 401 }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/products/:path*',
    '/api/categories/:path*',
    '/api/upload/:path*',
    '/api/inquiries/:path*',
  ],
}
