"use client"

import { useEffect } from "react"
import { useGenerationStore } from "../../store/use-generation-store"
import { GenerationCounterBadge } from "./generation-counter-badge"

export function QuotaRow() {
  const remaining = useGenerationStore((state) => state.quotaRemaining)
  const total = useGenerationStore((state) => state.quotaLimit)
  const fetchQuota = useGenerationStore((state) => state.fetchQuota)

  useEffect(() => {
    fetchQuota()
  }, [fetchQuota])

  return (
    <div className="mx-auto flex w-full max-w-5xl justify-center px-container">
      <GenerationCounterBadge remaining={remaining} total={total} />
    </div>
  )
}
