'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import type { Inquiry } from '@/lib/products/types'

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
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [quantity, setQuantity] = useState(defaultQuantity)
  const [size, setSize] = useState(defaultSize)
  const [color, setColor] = useState(defaultColor)
  const [product, setProduct] = useState(defaultProduct)
  const [productCode, setProductCode] = useState(defaultProductCode)
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [globalError, setGlobalError] = useState('')
  const [submittedInquiry, setSubmittedInquiry] = useState<Inquiry | null>(null)

  function validate(): boolean {
    const errors: Record<string, string> = {}

    // Name validation
    if (!name.trim()) {
      errors.name = 'Full name is required.'
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      errors.email = 'Business email is required.'
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@company.com).'
    }

    // WhatsApp / Phone validation
    if (phone.trim()) {
      const digits = phone.replace(/[^0-9]/g, '')
      const phoneFormatRegex = /^\+?[0-9\s\-()]{7,20}$/
      if (digits.length < 7 || digits.length > 16 || !phoneFormatRegex.test(phone.trim())) {
        errors.phone = 'Please enter a valid phone or WhatsApp number (minimum 7 digits, e.g. +1 555 123 4567).'
      }
    }

    // File validation
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        errors.file = 'File size exceeds 10MB limit. Please upload a smaller file.'
      }
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
      const lowerName = file.name.toLowerCase()
      const isAllowed = allowedExts.some((ext) => lowerName.endsWith(ext))
      if (!isAllowed) {
        errors.file = 'Only JPG, PNG, WEBP, or PDF files are supported.'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 10 * 1024 * 1024) {
        setFieldErrors((prev) => ({ ...prev, file: 'File exceeds 10MB limit.' }))
        setFile(null)
        e.target.value = ''
        return
      }
      setFile(selected)
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next.file
        return next
      })
    }
  }

  function removeFile() {
    setFile(null)
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next.file
      return next
    })
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGlobalError('')

    if (!validate()) {
      return
    }

    setStatus('loading')

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('email', email.trim())
      if (company.trim()) formData.append('company', company.trim())
      if (phone.trim()) formData.append('phone', phone.trim())
      if (country.trim()) formData.append('country', country.trim())
      if (quantity.trim()) formData.append('quantity', quantity.trim())
      if (size.trim()) formData.append('size', size.trim())
      if (color.trim()) formData.append('color', color.trim())
      if (product.trim()) formData.append('product', product.trim())
      if (productCode.trim()) formData.append('productCode', productCode.trim())
      if (message.trim()) formData.append('message', message.trim())
      if (file) formData.append('file', file)

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setSubmittedInquiry(data.inquiry)
      setStatus('success')
      onSuccess?.()
    } catch (err) {
      setStatus('error')
      setGlobalError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  function resetForm() {
    setName('')
    setCompany('')
    setEmail('')
    setPhone('')
    setCountry('')
    setQuantity(defaultQuantity)
    setSize(defaultSize)
    setColor(defaultColor)
    setProduct(defaultProduct)
    setProductCode(defaultProductCode)
    setMessage('')
    setFile(null)
    setFieldErrors({})
    setStatus('idle')
    setSubmittedInquiry(null)
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 text-[#0d0f12]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold">
            ✓
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-emerald-950">
              Inquiry Successfully Submitted
            </h3>
            <p className="text-xs text-emerald-800">
              Reference ID:{' '}
              <span className="font-mono font-semibold">{submittedInquiry?.id || 'Received'}</span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-emerald-900">
          Thank you for reaching out to <strong>NSM Impex</strong>. Our merchandising and production team
          has received your requirements and will review your specifications. We will contact you within
          <strong> 24 business hours</strong> via email
          {submittedInquiry?.phone ? ' or WhatsApp' : ''}.
        </p>

        <div className="mt-5 rounded-2xl border border-emerald-200/80 bg-white/80 p-4 text-xs text-[#6a7078] space-y-1">
          <p>
            <strong className="text-[#0d0f12]">Contact:</strong> {submittedInquiry?.name} ({submittedInquiry?.email})
          </p>
          {submittedInquiry?.phone && (
            <p>
              <strong className="text-[#0d0f12]">WhatsApp / Phone:</strong> {submittedInquiry.phone}
            </p>
          )}
          {submittedInquiry?.product && (
            <p>
              <strong className="text-[#0d0f12]">Product:</strong> {submittedInquiry.product}
              {submittedInquiry.quantity ? ` (Quantity: ${submittedInquiry.quantity})` : ''}
            </p>
          )}
          {submittedInquiry?.attachmentUrl && (
            <p>
              <strong className="text-[#0d0f12]">Attachment:</strong> Successfully uploaded and linked to RFQ
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="mt-6 rounded-full border border-emerald-800/20 bg-white px-5 py-2 text-xs font-semibold text-emerald-900 shadow-2xs hover:bg-emerald-100/50 transition"
        >
          Submit Another Inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {globalError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {globalError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }))
            }}
            placeholder="John Doe"
            className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12] ${
              fieldErrors.name ? 'border-red-400 bg-red-50/20' : 'border-[#e4e2dc]'
            }`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Company / Brand Name
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Apex Apparel Co."
            className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Business Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }))
            }}
            placeholder="buyer@brand.com"
            className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12] ${
              fieldErrors.email ? 'border-red-400 bg-red-50/20' : 'border-[#e4e2dc]'
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* WhatsApp / Phone with Validation */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
              WhatsApp / Phone Number
            </label>
            <span className="text-[11px] text-[#8a9098]">Direct chat for samples</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }))
            }}
            placeholder="+1 555 123 4567"
            className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12] ${
              fieldErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#e4e2dc]'
            }`}
          />
          {fieldErrors.phone ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
          ) : (
            <p className="mt-1 text-[11px] text-[#8a9098]">
              Include country code (e.g., +1 for USA, +44 for UK, +92 for Pakistan).
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Destination Country / Port
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United States, Germany, UAE..."
            className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
          />
        </div>

        {/* Required Quantity */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Estimated Quantity (MOQ: 50–100 pcs)
          </label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 200 pcs (or 5 sample pcs)"
            className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Size Breakdown
          </label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. S-XXL or Custom Techpack"
            className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
          />
        </div>

        {/* Colors */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Color / Pantone Specs
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Black, Washed Sage, Pantone 19-4007"
            className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Product Name / Article
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g. Heavyweight Pullover Hoodie 400 GSM"
            className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
            Product SKU / Code
          </label>
          <input
            type="text"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="e.g. TOP-001"
            className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
          Customization & Production Instructions
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Specify fabric composition, GSM, printing/embroidery details, custom neck labels, hangtags, or target delivery dates..."
          className="mt-1.5 w-full rounded-xl border border-[#e4e2dc] bg-white px-4 py-3 text-sm text-[#0d0f12] outline-none transition focus:border-[#0d0f12]"
        />
      </div>

      {/* File Upload Box (Genuine File Attachment) */}
      <div className="rounded-2xl border border-[#e4e2dc] bg-[#f7f6f2] p-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#0d0f12]">
          Attach Tech-Pack, Sketch, or Reference Photo (Optional)
        </label>
        <p className="mt-1 text-xs text-[#6a7078]">
          Attach technical drawing, artwork, measurement sheet, or photo (PNG, JPG, WEBP, or PDF up to 10MB).
        </p>

        {file ? (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-[#e4e2dc] bg-white p-3 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-base">📎</span>
              <span className="truncate font-medium text-[#0d0f12]">{file.name}</span>
              <span className="text-[11px] text-[#8a9098]">
                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="ml-3 rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#e4e2dc] bg-white px-4 py-2.5 text-xs font-semibold text-[#0d0f12] shadow-2xs hover:bg-[#f1f0ec] transition">
              <span>📎 Choose File...</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.pdf,image/png,image/jpeg,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {fieldErrors.file && (
          <p className="mt-2 text-xs text-red-600">{fieldErrors.file}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="cta-dark rounded-full bg-[#0d0f12] px-8 py-3.5 text-sm font-semibold !text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ color: '#ffffff' }}
        >
          {status === 'loading' ? 'Submitting Inquiry...' : 'Submit Inquiry & Request Quote →'}
        </button>
      </div>
    </form>
  )
}
