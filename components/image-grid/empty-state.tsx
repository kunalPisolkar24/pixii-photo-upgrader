"use client"

import { Aperture } from "lucide-react"
import { QuotaRow } from "./quota-row"

export function EmptyState() {
  return (
    <div className="flex min-h-[calc(100dvh-14rem)] flex-1 flex-col justify-center gap-8">
      <QuotaRow />
      <div className="px-container">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Aperture className="h-8 w-8" />
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground/80">
            Start creating
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Describe your product background below to generate high-quality
            Amazon listings instantly.
          </p>
        </div>
      </div>
    </div>
  )
}
