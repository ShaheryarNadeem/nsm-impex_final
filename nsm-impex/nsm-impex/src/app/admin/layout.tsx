import type { Metadata } from 'next'
import { AdminHeader } from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'NSM Impex Admin Panel',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f1f0ec]">
      <AdminHeader />
      <main className="container-x py-8">{children}</main>
    </div>
  )
}
