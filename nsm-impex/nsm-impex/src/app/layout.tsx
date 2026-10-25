import type { Metadata } from 'next'
import { Manrope, Syne } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const display = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
})

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nsm-impex.com'),
  title: {
    default: 'NSM Impex | Treads & Garments Manufacturer & Exporter',
    template: '%s | NSM Impex',
  },
  description:
    'NSM Impex manufactures and exports quality treads and garments for brands, wholesalers and international buyers.',
  alternates: {
    canonical: 'https://www.nsm-impex.com',
  },
  icons: {
    icon: [
      { url: '/logo.jpg' },
      { url: '/logo.jpeg' },
    ],
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'NSM Impex | Treads & Garments Manufacturer & Exporter',
    description:
      'Premium apparel manufacturing and export for B2B buyers, wholesalers and clothing brands.',
    url: 'https://www.nsm-impex.com',
    siteName: 'NSM Impex',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'NSM Impex Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NSM Impex | Treads & Garments Manufacturer & Exporter',
    description:
      'Premium apparel manufacturing and export for B2B buyers, wholesalers and clothing brands.',
    images: ['/logo.jpg'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
