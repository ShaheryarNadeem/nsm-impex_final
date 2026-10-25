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
                  <a href="tel:+923243998808" className="hover:underline">
                    +92 324 3998808
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
              href="https://mail.google.com/mail/?view=cm&fs=1&to=nsmimpex.pk@gmail.com&su=Manufacturing%20Inquiry%20-%20NSM%20Impex"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#0d0f12] bg-white px-5 py-2.5 text-sm font-semibold text-[#0d0f12] transition-colors hover:bg-[#f7f6f2] inline-flex items-center gap-2"
            >
              <svg className="h-4 w-4 text-[#0d0f12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email Us Directly</span>
            </a>
            <a
              href="https://wa.me/923243998808?text=Hello%20NSM%20Impex%2C%20I%20would%20like%20to%20inquire%20about%20custom%20apparel%20manufacturing."
              target="_blank"
              rel="noopener noreferrer"
              className="cta-dark rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 inline-flex items-center gap-2"
            >
              <svg className="h-4 w-4 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.06-1.579-.327-1.205-.494-2.186-1.583-2.73-2.316-.059-.081-.462-.614-.462-1.173 0-.558.291-.832.395-.945.103-.113.226-.142.302-.142.076 0 .152 0 .218.004.072.004.167-.027.26.196.096.23.327.798.356.856.029.058.049.127.011.202-.038.076-.057.123-.114.19-.057.067-.12.15-.172.202-.058.058-.118.12-.051.236.068.115.301.498.647.806.446.398.823.522.939.58.115.057.183.048.251-.03.069-.077.297-.346.376-.465.079-.118.158-.099.267-.058.109.04.69.326.809.385.118.059.197.089.227.139.03.049.03.287-.114.692z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.436 5.179L2 22l4.981-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.606 0-3.109-.462-4.38-1.26l-.314-.197-2.952.824.836-2.887-.206-.328A8.127 8.127 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/>
              </svg>
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
