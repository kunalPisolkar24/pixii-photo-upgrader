"use client"

import { useQuotaStore } from "../../store/use-quota-store"
import { GenerationCounterBadge } from "./generation-counter-badge"

export function QuotaRow() {
  const remaining = useQuotaStore((state) => state.quotaRemaining)
  const total = useQuotaStore((state) => state.quotaLimit)

  return (
    <div className="mx-auto flex w-full max-w-5xl justify-center px-container">
      <GenerationCounterBadge remaining={remaining} total={total} />
    </div>
  )
}
