import type { Metadata } from 'next'
import { InquiryForm } from '@/components/inquiry/InquiryForm'

export const metadata: Metadata = {
  title: 'Send Inquiry',
  description: 'Send a B2B inquiry to NSM Impex for apparel manufacturing and export.',
}

type Props = {
  searchParams: Promise<{
    product?: string
    code?: string
    type?: string
    size?: string
    color?: string
    quantity?: string
  }>
}

export default async function InquiryPage({ searchParams }: Props) {
  const params = await searchParams
  const isCustom = params.type === 'custom'

  return (
    <div className="container-x py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7078]">B2B Inquiry</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0d0f12]">
        {isCustom ? 'Request Custom Production' : 'Send Inquiry'}
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[#6a7078]">
        Tell us about your requirements. Our team will respond with next steps for sampling, production and export.
      </p>
      <div className="mt-10 max-w-3xl rounded-2xl border border-[#e4e2dc] bg-white p-6 md:p-8">
        <InquiryForm
          defaultProduct={params.product}
          defaultProductCode={params.code}
          defaultSize={params.size}
          defaultColor={params.color}
          defaultQuantity={params.quantity}
        />
      </div>
    </div>
  )
}
