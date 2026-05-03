"use client"

import { Aperture } from "lucide-react"
import { GenerationCounterBadge } from "./generation-counter-badge"

const LOADING_STEPS = [
  "Analyzing scene...",
  "Enhancing details...",
  "Rendering lighting...",
  "Finalizing...",
]

export function SkeletonState() {
  return (
    <div className="w-full space-y-6">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-container md:grid-cols-2">
        {LOADING_STEPS.map((step, i) => (
          <div
            key={i}
            className="flex aspect-square flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-outline-variant/10 bg-muted/50 shadow-sm"
          >
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/10 border-t-primary" />
              <Aperture className="absolute inset-0 m-auto h-5 w-5 text-primary" />
            </div>
            <span className="animate-pulse text-sm font-medium text-muted-foreground">
              {step}
            </span>
          </div>
        ))}
      </div>
      <GenerationCounterBadge remaining={2} total={3} />
    </div>
  )
}
