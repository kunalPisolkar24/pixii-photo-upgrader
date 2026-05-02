"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useGenerationStore } from "@/store/use-generation-store"
import { Sparkles } from "lucide-react"

export function ImageGrid() {
  const { currentGenerations, isGenerating } = useGenerationStore()

  if (isGenerating) {
    return (
      <div className="space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-container">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-[32px]" />
          ))}
          <div className="aspect-square rounded-[32px] bg-surface-container-low border flex flex-col items-center justify-center space-y-4 shadow-sm border-dashed">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
              <Sparkles className="w-5 h-5 text-primary absolute inset-0 m-auto" />
            </div>
            <span className="text-muted-foreground text-sm font-medium animate-pulse">Rendering lighting...</span>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground/60 font-medium">
          2 / 3 generations left today
        </p>
      </div>
    )
  }

  if (currentGenerations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-container">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-surface-container rounded-3xl flex items-center justify-center mx-auto text-muted-foreground">
             <Sparkles className="w-8 h-8 opacity-20" />
          </div>
          <h2 className="text-xl font-heading font-semibold text-foreground/80">Start creating</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Describe your product background below to generate high-quality Amazon listings instantly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-container">
        {currentGenerations.map((img, idx) => (
          <div 
            key={idx} 
            className="aspect-square rounded-[32px] overflow-hidden bg-surface-container border shadow-sm transition-all hover:shadow-lg hover:border-primary/20 group"
          >
            <img 
              src={img} 
              alt={`Generation ${idx + 1}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground/60 font-medium">
        2 / 3 generations left today
      </p>
    </div>
  )
}
