"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SuggestionChipsProps {
  suggestions: string[]
  selectedStyle: string | null
  onStyleSelect: (style: string | null) => void
  disabled?: boolean
}

export function SuggestionChips({
  suggestions,
  selectedStyle,
  onStyleSelect,
  disabled,
}: SuggestionChipsProps) {
  return (
    <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant={selectedStyle === suggestion ? "default" : "outline"}
          size="sm"
          disabled={disabled}
          className={cn(
            "h-9 rounded-full px-3 text-xs shadow-sm transition-all sm:px-4",
            selectedStyle === suggestion
              ? "bg-primary text-primary-foreground border-primary"
              : "border-outline-variant/30 bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground backdrop-blur-sm",
            disabled && "cursor-not-allowed disabled:opacity-100"
          )}
          onClick={() => onStyleSelect(selectedStyle === suggestion ? null : suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
