"use client"

import { useState } from "react"
import {
  useGenerationStore,
  type GenerationState,
} from "../../store/use-generation-store"
import { SuggestionChips } from "./suggestion-chips"
import { PromptForm } from "./prompt-form"

const SUGGESTIONS = ["Minimalist Studio", "Kitchen Counter", "Silk Sheets"]

export function FloatingInput() {
  const [prompt, setPrompt] = useState("")
  const generate = useGenerationStore(
    (state: GenerationState) => state.generate
  )
  const isGenerating = useGenerationStore(
    (state: GenerationState) => state.isGenerating
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    const currentPrompt = prompt
    setPrompt("")
    await generate(currentPrompt)
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-3 px-4 sm:bottom-10 sm:gap-4 sm:px-container">
      <SuggestionChips
        suggestions={SUGGESTIONS}
        onSelect={setPrompt}
        disabled={isGenerating}
      />

      <PromptForm
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleSubmit}
        isGenerating={isGenerating}
      />
    </div>
  )
}
