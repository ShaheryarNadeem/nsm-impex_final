import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const result = await verifyAdminAccess(req)

  if (!result.isAdmin) {
    return NextResponse.json({ authenticated: false, error: result.error }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    user: { email: result.email, role: 'admin', authMethod: result.authMethod },
  })
}
