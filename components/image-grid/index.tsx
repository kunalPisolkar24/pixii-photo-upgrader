"use client"

import {
  useGenerationStore,
  type GenerationState,
} from "../../store/use-generation-store"
import { EmptyState } from "./empty-state"
import { SkeletonState } from "./skeleton-state"
import { ImageCard } from "./image-card"
import { GenerationCounterBadge } from "./generation-counter-badge"
import { getImageGridLayoutClassName } from "./grid-layout"

export function ImageGrid() {
  const currentGenerations = useGenerationStore(
    (state: GenerationState) => state.currentGenerations
  )
  const isGenerating = useGenerationStore(
    (state: GenerationState) => state.isGenerating
  )

  if (isGenerating) {
    return <SkeletonState />
  }

  if (currentGenerations.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="w-full space-y-6">
      <div className={getImageGridLayoutClassName(currentGenerations.length)}>
        {currentGenerations.map((img, idx) => (
          <ImageCard key={idx} src={img} alt={`Generation ${idx + 1}`} />
        ))}
      </div>
      <GenerationCounterBadge remaining={2} total={3} />
    </div>
  )
}
