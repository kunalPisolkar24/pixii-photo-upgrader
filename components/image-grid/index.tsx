"use client"

import { useGenerationStore, type GenerationState } from "../../store/use-generation-store"
import { EmptyState } from "./empty-state"
import { SkeletonState } from "./skeleton-state"
import { ImageCard } from "./image-card"

export function ImageGrid() {
  const { currentGenerations, isGenerating } = useGenerationStore((state: GenerationState) => ({
    currentGenerations: state.currentGenerations,
    isGenerating: state.isGenerating
  }))

  if (isGenerating) {
    return <SkeletonState />
  }

  if (currentGenerations.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-container">
        {currentGenerations.map((img, idx) => (
          <ImageCard key={idx} src={img} alt={`Generation ${idx + 1}`} />
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground/60 font-medium">
        2 / 3 generations left today
      </p>
    </div>
  )
}
