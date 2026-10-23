'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials. Please try again.')
      }

      // Successful login
      router.push(from)
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#e4e2dc] bg-white p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d0f12] text-xl font-bold text-white">
            N
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[#0d0f12]">
            NSM Admin Portal
          </h1>
          <p className="mt-2 text-sm text-[#6a7078]">
            Enter your credentials to securely access the admin panel
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nsmimpex.com"
              className="mt-2 w-full rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-sm text-[#0d0f12] placeholder-[#a2a7ad] outline-none transition-all focus:border-[#0d0f12] focus:bg-white focus:ring-1 focus:ring-[#0d0f12]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6a7078]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-medium text-[#6a7078] hover:text-[#0d0f12]"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-2 w-full rounded-xl border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-3 text-sm text-[#0d0f12] placeholder-[#a2a7ad] outline-none transition-all focus:border-[#0d0f12] focus:bg-white focus:ring-1 focus:ring-[#0d0f12]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cta-dark w-full rounded-full bg-[#0d0f12] py-3.5 text-sm font-semibold !text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ color: '#ffffff' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-8 border-t border-[#e4e2dc] pt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-[#6a7078] transition-colors hover:text-[#0d0f12]"
          >
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center text-sm text-[#6a7078]">
          Loading admin login...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
