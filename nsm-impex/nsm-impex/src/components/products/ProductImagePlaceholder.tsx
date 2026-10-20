export function ProductImagePlaceholder({ label }: { label?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#f0efeb_0%,#e7e5df_100%)]">
      <div className="absolute inset-6 rounded-xl border border-dashed border-black/10" />
      <div className="relative z-[1] px-6 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Image Placeholder</p>
        {label ? <p className="mt-2 text-sm font-medium text-ink/70">{label}</p> : null}
        <p className="mt-1 text-xs text-muted">Upload product photography in Admin</p>
      </div>
    </div>
  )
}
