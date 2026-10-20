'use client'

import { FormEvent, useState } from 'react'

type Props = {
  defaultProduct?: string
  defaultProductCode?: string
  defaultSize?: string
  defaultColor?: string
  defaultQuantity?: string
  onSuccess?: () => void
}

export function InquiryForm({
  defaultProduct = '',
  defaultProductCode = '',
  defaultSize = '',
  defaultColor = '',
  defaultQuantity = '',
  onSuccess,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    delete payload.file

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit inquiry')
      setStatus('success')
      e.currentTarget.reset()
      onSuccess?.()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[#e4e2dc] bg-[#f7f6f2] p-6 text-sm leading-relaxed text-[#0d0f12]">
        Thank you. Your inquiry has been received. Our team will get back to you shortly.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Company Name" name="company" />
        <Field label="Email" name="email" type="email" required />
        <Field label="WhatsApp / Phone" name="phone" />
        <Field label="Country" name="country" />
        <Field label="Required Quantity" name="quantity" defaultValue={defaultQuantity} />
        <Field label="Size" name="size" defaultValue={defaultSize} />
        <Field label="Color" name="color" defaultValue={defaultColor} />
      </div>
      <Field label="Product" name="product" defaultValue={defaultProduct} />
      <Field label="Product Code" name="productCode" defaultValue={defaultProductCode} />
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-[#0d0f12]">Message</span>
        <textarea
          name="message"
          rows={5}
          className="rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-[#0d0f12] outline-none focus:border-[#0d0f12]"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-[#0d0f12]">Upload Reference Image / File</span>
        <input name="file" type="file" className="rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12]" />
        <span className="text-xs text-[#6a7078]">File upload is captured in the form UI for now; connect storage later.</span>
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="cta-dark rounded-full px-6 py-3 text-sm font-semibold transition disabled:opacity-60"
      >
        {status === 'loading' ? 'Submitting…' : 'Submit Inquiry'}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  defaultValue?: string
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[#0d0f12]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-[#0d0f12] outline-none focus:border-[#0d0f12]"
      />
    </label>
  )
}
