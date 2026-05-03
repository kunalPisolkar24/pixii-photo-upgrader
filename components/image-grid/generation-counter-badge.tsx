"use client"

interface GenerationCounterBadgeProps {
  remaining: number
  total: number
}

export function GenerationCounterBadge({
  remaining,
  total,
}: GenerationCounterBadgeProps) {
  const safeTotal = Math.max(0, total)
  const safeRemaining = Math.min(Math.max(0, remaining), safeTotal)

  return (
    <div className="flex justify-center">
      <div
        className="inline-flex h-8 items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-low px-3 text-xs leading-none font-medium tracking-[0.02em] text-on-surface-variant shadow-ambient"
        aria-label={`${safeRemaining} of ${safeTotal} generations left today`}
      >
        <span className="inline-flex h-5 min-w-9 items-center justify-center rounded-full bg-primary/10 px-2 text-primary">
          {safeRemaining} / {safeTotal}
        </span>
        <span>generations left today</span>
      </div>
    </div>
  )
}
