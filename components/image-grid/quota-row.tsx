"use client"

import { useGenerationStore } from "../../store/use-generation-store"
import { GenerationCounterBadge } from "./generation-counter-badge"

export function QuotaRow() {
  const remaining = useGenerationStore((state) => state.quotaRemaining)
  const total = useGenerationStore((state) => state.quotaLimit)

  return (
    <div className="mx-auto flex w-full max-w-5xl justify-center px-container">
      <GenerationCounterBadge remaining={remaining} total={total} />
    </div>
  )
}
