"use client"

import { Aperture } from "lucide-react"
import {
  useGenerationStore,
  type GenerationState,
} from "@/store/use-generation-store"
import { getImageGridLayoutClassName } from "./grid-layout"
import { QuotaRow } from "./quota-row"

const LOADING_STEPS = [
  "Analyzing scene...",
  "Enhancing details...",
  "Rendering lighting...",
  "Finalizing...",
]

export function SkeletonState() {
  const imageCount = useGenerationStore(
    (state: GenerationState) => state.imageCount
  )
  const loadingSteps = LOADING_STEPS.slice(0, imageCount)

  return (
    <div className="w-full space-y-6">
      <QuotaRow />
      <div className={getImageGridLayoutClassName(imageCount)}>
        {loadingSteps.map((step, i) => (
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
    </div>
  )
}
