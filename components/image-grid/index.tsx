"use client"

import { useGenerationStore } from "../../store/use-generation-store"
import { EmptyState } from "./empty-state"
import { SkeletonState } from "./skeleton-state"
import { ImageCard } from "./image-card"
import { getImageGridLayoutClassName } from "./grid-layout"
import { QuotaRow } from "./quota-row"

export function ImageGrid() {
  const currentGenerations = useGenerationStore((state) => state.currentGenerations)
  const isGenerating = useGenerationStore((state) => state.isGenerating)

  if (isGenerating) {
    return <SkeletonState />
  }

  if (currentGenerations.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="w-full space-y-6">
      <QuotaRow />
      <div className={getImageGridLayoutClassName(currentGenerations.length)}>
        {currentGenerations.map((img, idx) => (
          <ImageCard key={img} src={img} alt={`Generation ${idx + 1}`} />
        ))}
      </div>
    </div>
  )
}
