import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About NSM Impex — treads and garments manufacturer and exporter for global B2B markets.',
}

export default function AboutPage() {
  return (
    <div className="container-x py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">About NSM Impex</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
        Built for Quality. Made for Global Markets.
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
        NSM Impex is a treads and garments manufacturer and exporter focused on producing quality apparel for brands,
        wholesalers, retailers and international buyers.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Product Quality', 'Clean construction, consistent finishing and dependable apparel standards.'],
          ['Manufacturing', 'Structured production flow from fabric selection through packaging.'],
          ['Customization', 'Support for private label, branding, colors and measurements.'],
          ['B2B Relationships', 'Built for wholesale and export partnerships with clear communication.'],
        ].map(([title, text]) => (
          <article key={title} className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-white p-8">
        <h2 className="text-xl font-semibold">Manufacturing Hub & Contact</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Headquartered in Sialkot, Pakistan — the global manufacturing heartland for apparel, activewear, and textile export. Factory audits, tech-pack consultations, and custom sample development are available by appointment.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#0d0f12]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6a7078] block">Email</span>
            <a href="mailto:nsmimpex.pk@gmail.com" className="font-medium hover:underline">
              nsmimpex.pk@gmail.com
            </a>
          </div>
          <div className="border-l border-line pl-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6a7078] block">Phone / WhatsApp</span>
            <a href="tel:+923079952363" className="font-medium hover:underline">
              +92 307 9952363
            </a>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" className="cta-dark inline-flex rounded-full px-5 py-2.5 text-sm font-semibold">
            Contact NSM Impex
          </Link>
          <a
            href="https://wa.me/923079952363"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          >
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  )
}
