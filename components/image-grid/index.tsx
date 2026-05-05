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
  const uploadedImages = useGenerationStore((state) => state.uploadedImages)
  const latestHistoryItem = useGenerationStore((state) => state.history[0])
  
  const isLoading = isGenerating || (latestHistoryItem?.status === "pending")

  if (isLoading) {
    return <SkeletonState />
  }

  if (currentGenerations.length === 0 && uploadedImages.length === 0) {
    return <EmptyState />
  }

  const imagesToDisplay = currentGenerations.length > 0 ? currentGenerations : uploadedImages
  const isPreview = currentGenerations.length === 0

  return (
    <div className="w-full space-y-6">
      <QuotaRow />
      <div className={getImageGridLayoutClassName(imagesToDisplay.length)}>
        {imagesToDisplay.map((img, idx) => (
          <ImageCard 
            key={img} 
            src={img} 
            alt={isPreview ? `Upload ${idx + 1}` : `Generation ${idx + 1}`} 
          />
        ))}
      </div>
    </div>
  )
}
