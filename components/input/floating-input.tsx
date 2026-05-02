"use client"

import { useState } from "react"
import { useGenerationStore } from "@/store/use-generation-store"
import { SuggestionChips } from "./suggestion-chips"
import { PromptForm } from "./prompt-form"

const SUGGESTIONS = ["Minimalist Studio", "Kitchen Counter", "Silk Sheets"]

export function FloatingInput() {
  const [prompt, setPrompt] = useState("")
  const generate = useGenerationStore((state) => state.generate)
  const isGenerating = useGenerationStore((state) => state.isGenerating)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    const currentPrompt = prompt
    setPrompt("")
    await generate(currentPrompt)
  }

  return (
    <div className="fixed bottom-10 inset-x-0 flex flex-col items-center gap-4 px-container z-40 pointer-events-none">
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
