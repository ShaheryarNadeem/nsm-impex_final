import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About NSM Impex — treads and garments manufacturer and exporter for global B2B markets.',
  alternates: {
    canonical: 'https://www.nsm-impex.com/about',
  },
  openGraph: {
    title: 'About Us | NSM Impex',
    description: 'About NSM Impex — treads and garments manufacturer and exporter for global B2B markets.',
    url: 'https://www.nsm-impex.com/about',
    images: [{ url: '/logo.jpg', alt: 'About NSM Impex' }],
  },
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
            <a href="tel:+923243998808" className="font-medium hover:underline">
              +92 324 3998808
            </a>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" className="cta-dark inline-flex rounded-full px-5 py-2.5 text-sm font-semibold">
            Contact NSM Impex
          </Link>
          <a
            href="https://wa.me/923243998808?text=Hello%20NSM%20Impex%2C%20I%20would%20like%20to%20inquire%20about%20custom%20apparel%20manufacturing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          >
            <svg className="h-4 w-4 fill-[#25D366]" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.06-1.579-.327-1.205-.494-2.186-1.583-2.73-2.316-.059-.081-.462-.614-.462-1.173 0-.558.291-.832.395-.945.103-.113.226-.142.302-.142.076 0 .152 0 .218.004.072.004.167-.027.26.196.096.23.327.798.356.856.029.058.049.127.011.202-.038.076-.057.123-.114.19-.057.067-.12.15-.172.202-.058.058-.118.12-.051.236.068.115.301.498.647.806.446.398.823.522.939.58.115.057.183.048.251-.03.069-.077.297-.346.376-.465.079-.118.158-.099.267-.058.109.04.69.326.809.385.118.059.197.089.227.139.03.049.03.287-.114.692z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.436 5.179L2 22l4.981-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.606 0-3.109-.462-4.38-1.26l-.314-.197-2.952.824.836-2.887-.206-.328A8.127 8.127 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/>
            </svg>
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  )
}
