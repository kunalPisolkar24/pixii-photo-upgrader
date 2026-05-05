"use client"

import { useState } from "react"
import { useGenerationStore } from "../../store/use-generation-store"
import { useQuotaStore } from "../../store/use-quota-store"
import { useGenerationActions } from "../../hooks/use-generation-actions"
import { SuggestionChips } from "./suggestion-chips"
import { PromptForm } from "./prompt-form"
import { ImageCountSelector } from "./image-count-selector"
import { OutputQualitySelector } from "./output-quality-selector"

import { GenerateRequestSchema } from "@/lib/schemas"
import { STYLE_PACKS } from "@/lib/style-packs"
import { isLocalEnvironment } from "@/lib/environment"

const SUGGESTIONS = Object.keys(STYLE_PACKS)

export function FloatingInput() {
  const [prompt, setPrompt] = useState("")
  const { generate } = useGenerationActions()
  
  const {
    isGenerating,
    imageCount,
    setImageCount,
    outputQuality,
    setOutputQuality,
    selectedStyle,
    setSelectedStyle,
    uploadedImages,
    setUploadedImages
  } = useGenerationStore()

  const quotaRemaining = useQuotaStore((state) => state.quotaRemaining)
  const isLocal = isLocalEnvironment()
  const isQuotaExceeded = quotaRemaining <= 0 && !isLocal

  const validationResult = GenerateRequestSchema.safeParse({
    base64Images: uploadedImages,
    selectedStyle,
    prompt,
    imageCount,
    outputQuality,
  })

  const isValid = validationResult.success

  const getPlaceholder = () => {
    if (isQuotaExceeded) return "Quota exceeded for today"
    if (uploadedImages.length === 0) return "Attach an image first..."
    if (!isValid) return "Select a style or type 20+ chars..."
    return "Describe your custom background..."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isGenerating || isQuotaExceeded) return
    
    const currentPrompt = prompt
    setPrompt("")
    await generate(currentPrompt)
    setUploadedImages([])
    setSelectedStyle(null)
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-3 px-4 sm:bottom-10 sm:gap-4 sm:px-container">
      <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
        <ImageCountSelector
          value={imageCount}
          onChange={setImageCount}
          disabled={isGenerating || isQuotaExceeded}
        />
        <OutputQualitySelector
          value={outputQuality}
          onChange={setOutputQuality}
          disabled={isGenerating || isQuotaExceeded}
        />
        <SuggestionChips
          suggestions={SUGGESTIONS}
          selectedStyle={selectedStyle}
          onStyleSelect={setSelectedStyle}
          disabled={isGenerating || isQuotaExceeded}
        />
      </div>

      <PromptForm
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleSubmit}
        isGenerating={isGenerating}
        uploadedImages={uploadedImages}
        onImagesUpload={setUploadedImages}
        isValid={isValid}
        placeholder={getPlaceholder()}
        disabled={isQuotaExceeded}
      />
    </div>
  )
}
