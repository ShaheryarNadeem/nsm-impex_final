import type { Metadata } from 'next'
import { InquiryForm } from '@/components/inquiry/InquiryForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact NSM Impex for bulk apparel production, private label and export inquiries.',
}

export default function ContactPage() {
  return (
    <div className="container-x py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Contact</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">Let’s Build Your Next Collection</h1>
      <p className="mt-4 text-base text-muted">
        NSM Impex — Treads & Garments Manufacturer & Exporter
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-white p-6 text-sm">
            <h2 className="text-lg font-semibold">Contact details</h2>
            <dl className="mt-4 space-y-3 text-muted">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em]">Email</dt>
                <dd className="mt-1 text-ink">
                  <a href="mailto:nsmimpex.pk@gmail.com" className="hover:underline">
                    nsmimpex.pk@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em]">WhatsApp & Phone</dt>
                <dd className="mt-1 text-ink">
                  <a href="tel:+923079952363" className="hover:underline">
                    +92 307 9952363
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em]">Headquarters & Export</dt>
                <dd className="mt-1 text-ink">Sialkot / Punjab, Pakistan — Serving Global Markets</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em]">Business Hours</dt>
                <dd className="mt-1 text-ink">Monday – Saturday: 9:00 AM – 6:00 PM (PKT)</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:nsmimpex.pk@gmail.com"
              className="rounded-full border border-[#0d0f12] bg-white px-5 py-2.5 text-sm font-semibold text-[#0d0f12] transition-colors hover:bg-[#f7f6f2]"
            >
              Email Us Directly
            </a>
            <a
              href="https://wa.me/923079952363"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-dark rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 inline-flex items-center gap-2"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-[#e4e2dc] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a7078]">
                Export & Manufacturing Hub
              </p>
            </div>
            <p className="mt-2 text-sm font-medium text-[#0d0f12]">
              Factory visits, production inspections & sample meetings available by appointment.
            </p>
          </div>
        </aside>

        <div className="rounded-2xl border border-line bg-white p-6 md:p-8">
          <h2 className="mb-6 text-xl font-semibold">Inquiry form</h2>
          <InquiryForm />
        </div>
      </div>
    </div>
  )
}
