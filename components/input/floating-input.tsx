"use client"

import { useState } from "react"
import {
  useGenerationStore,
  type GenerationState,
} from "../../store/use-generation-store"
import { SuggestionChips } from "./suggestion-chips"
import { PromptForm } from "./prompt-form"
import { ImageCountSelector } from "./image-count-selector"
import { OutputQualitySelector } from "./output-quality-selector"

const SUGGESTIONS = ["Modern Minimal", "Cozy Lifestyle", "Premium Studio"]

export function FloatingInput() {
  const [prompt, setPrompt] = useState("")
  const generate = useGenerationStore(
    (state: GenerationState) => state.generate
  )
  const isGenerating = useGenerationStore(
    (state: GenerationState) => state.isGenerating
  )
  const imageCount = useGenerationStore(
    (state: GenerationState) => state.imageCount
  )
  const setImageCount = useGenerationStore(
    (state: GenerationState) => state.setImageCount
  )
  const outputQuality = useGenerationStore(
    (state: GenerationState) => state.outputQuality
  )
  const setOutputQuality = useGenerationStore(
    (state: GenerationState) => state.setOutputQuality
  )

  const quotaRemaining = useGenerationStore((state) => state.quotaRemaining)
  const isLocalhost = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  
  const isQuotaExceeded = quotaRemaining <= 0 && !isLocalhost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating || isQuotaExceeded) return
    const currentPrompt = prompt
    setPrompt("")
    await generate(currentPrompt)
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
          onSelect={setPrompt}
          disabled={isGenerating || isQuotaExceeded}
        />
      </div>

      <PromptForm
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleSubmit}
        isGenerating={isGenerating}
        disabled={isQuotaExceeded}
      />
    </div>
  )
}
