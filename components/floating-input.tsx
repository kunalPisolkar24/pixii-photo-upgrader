"use client"

import { useState } from "react"
import { Paperclip, Send, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGenerationStore } from "@/store/use-generation-store"
import { cn } from "@/lib/utils"

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
      <div className="flex items-center gap-2 pointer-events-auto">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            disabled={isGenerating}
            className="rounded-full bg-white/80 backdrop-blur-sm border-outline-variant/30 text-muted-foreground text-xs hover:bg-white hover:text-foreground transition-all h-9 px-4 shadow-sm"
            onClick={() => setPrompt(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      <form 
        onSubmit={handleSubmit}
        className={cn(
          "w-full max-w-2xl bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-outline-variant/20 flex items-center p-2 pl-3 gap-2 pointer-events-auto transition-all duration-300",
          isGenerating && "opacity-70 grayscale-[0.5]"
        )}
      >
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:bg-surface-container h-10 w-10"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-foreground shrink-0">
          <ImageIcon className="w-5 h-5" />
        </div>

        <Input 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          placeholder="Describe your custom background..." 
          className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-12 px-2"
        />

        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0 w-11 h-11 transition-all active:scale-95"
          disabled={!prompt.trim() || isGenerating}
        >
          <Send className="w-5 h-5 text-white" />
        </Button>
      </form>
    </div>
  )
}
