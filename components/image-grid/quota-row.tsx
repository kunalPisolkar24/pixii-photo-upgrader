"use client"

import { GenerationCounterBadge } from "./generation-counter-badge"

export function QuotaRow() {
  return (
    <div className="mx-auto flex w-full max-w-5xl justify-center px-container">
      <GenerationCounterBadge remaining={2} total={3} />
    </div>
  )
}
